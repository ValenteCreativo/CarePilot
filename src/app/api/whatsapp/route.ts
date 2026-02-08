import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db, users, cases, plans, actions, messages, type LovedOneContext, type CaregiverContext, type PlanJson } from "@/db";
import { actionGenerator } from "@/lib/actions/generator";
import { actionExecutor } from "@/lib/actions/executor";
import { generatePlan } from "@/lib/pipeline";
import { geminiService } from "@/lib/gemini";
import { buildTwimlMessage, verifyTwilioSignature } from "@/lib/twilio";

const HELP_TEXT =
  "Available commands:\n" +
  "- plan: Get your current care plan summary\n" +
  "- status: See next 3 approved actions\n" +
  "- update [message]: Update your context and regenerate plan\n" +
  "- help: See this help message";

const ONBOARDING_QUESTIONS = {
  step1: "To get started, tell me: Who are you caring for and what's their situation?",
  step2: "Thanks for sharing. How much time can you dedicate each week to caregiving?",
  step3: "Got it. What's your weekly budget for care-related expenses?",
};

type Command =
  | { type: "plan" }
  | { type: "status" }
  | { type: "help" }
  | { type: "update"; text: string }
  | { type: "none" };

function parseCommand(message: string): Command {
  const trimmed = message.trim();
  const lower = trimmed.toLowerCase();

  if (lower === "plan") {
    return { type: "plan" };
  }
  if (lower === "status") {
    return { type: "status" };
  }
  if (lower === "help") {
    return { type: "help" };
  }
  if (lower.startsWith("update ")) {
    return { type: "update", text: trimmed.slice(7).trim() };
  }

  return { type: "none" };
}

function parseNumberFromText(text: string): number | null {
  const match = text.match(/(\d+(?:[\.,]\d+)?)/);
  if (!match) {
    return null;
  }
  const value = parseFloat(match[1].replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

function buildPlanSummary(plan: PlanJson): string {
  const goals = plan.goals.slice(0, 3).map((goal, index) => `${index + 1}. ${goal.title}`);
  const actions = plan.actions.slice(0, 3).map((action, index) => `${index + 1}. ${action.title}`);

  return [
    `Resumen: ${plan.case_summary}`,
    goals.length > 0 ? `Metas principales:\n${goals.join("\n")}` : "",
    actions.length > 0 ? `Acciones clave:\n${actions.join("\n")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildStatusSummary(upcoming: Array<{ title: string; when: string }>): string {
  if (upcoming.length === 0) {
    return "Aún no hay acciones programadas. Si necesitas algo, envía un update y regenero tu plan.";
  }

  const lines = upcoming.map((item, index) => `${index + 1}. ${item.title} (${item.when})`);
  return `Próximas acciones:\n${lines.join("\n")}`;
}

async function logMessage(
  userId: string,
  direction: "inbound" | "outbound",
  body: string,
  raw?: unknown
) {
  try {
    await db.insert(messages).values({
      userId,
      direction,
      body,
      raw: raw ?? null,
    });
  } catch (error) {
    console.warn("WhatsApp message log failed:", error);
  }
}

async function findInboundByMessageSid(messageSid: string) {
  const [existing] = await db
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.direction, "inbound"),
        sql`(${messages.raw} ->> 'MessageSid') = ${messageSid}`
      )
    )
    .limit(1);

  return existing;
}

async function findOutboundReplyByMessageSid(userId: string, messageSid: string) {
  const [reply] = await db
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.userId, userId),
        eq(messages.direction, "outbound"),
        sql`(${messages.raw} ->> 'inReplyTo') = ${messageSid}`
      )
    )
    .orderBy(desc(messages.createdAt))
    .limit(1);

  return reply;
}

async function getOrCreateWhatsAppUser(phoneNumber: string) {
  const existing = await db.query.users.findFirst({
    where: eq(users.phoneNumber, phoneNumber),
  });

  if (existing) {
    return existing;
  }

  const [created] = await db
    .insert(users)
    .values({
      phoneNumber,
      whatsappState: "NUEVO",
      whatsappStep: 1,
      whatsappContext: {},
    })
    .returning();

  return created;
}

async function getLatestCase(userId: string) {
  return db.query.cases.findFirst({
    where: eq(cases.userId, userId),
    orderBy: [desc(cases.createdAt)],
  });
}

async function getLatestPlan(caseId: string) {
  return db.query.plans.findFirst({
    where: eq(plans.caseId, caseId),
    orderBy: [desc(plans.createdAt)],
  });
}

async function approveGeneratedActions(actionIds: string[]) {
  await Promise.all(actionIds.map((actionId) => actionExecutor.approveAction(actionId)));
}

async function generateEmpatheticResponse(input: {
  summary: string;
  nextStep: string;
  tone?: string;
}): Promise<string> {
  try {
    const prompt =
      `Generate a warm, supportive response in English that acknowledges the caregiver's effort and provides clear next steps.

Context: ${input.summary}
Next step: ${input.nextStep}
Tone: ${input.tone ?? "supportive"}

Keep it to 2-3 sentences maximum. Sound like a caring friend who's also knowledgeable.

Examples:
- "Got it! I've scheduled that appointment and will send you a reminder. One less thing to worry about."
- "That's a great update. I've updated your care plan with this new information. You're doing an amazing job staying on top of everything."`;

    const result = await geminiService.generateText(prompt);
    return result.content.trim() || input.nextStep;
  } catch (error) {
    console.error("Gemini response generation failed:", error);
    return input.nextStep;
  }
}

async function handleOnboarding(user: typeof users.$inferSelect, messageText: string): Promise<string> {
  const step = user.whatsappStep ?? 0;
  const context = (user.whatsappContext ?? {}) as {
    caregivingSituation?: string;
    timeAvailable?: string;
    budgetConstraints?: string;
  };

  if (step <= 0) {
    await db
      .update(users)
      .set({ whatsappState: "NUEVO", whatsappStep: 1 })
      .where(eq(users.id, user.id));
    return ONBOARDING_QUESTIONS.step1;
  }

  if (step === 1) {
    if (!messageText) {
      return ONBOARDING_QUESTIONS.step1;
    }

    const updatedContext = {
      ...context,
      caregivingSituation: messageText,
    };

    await db
      .update(users)
      .set({ whatsappContext: updatedContext, whatsappStep: 2 })
      .where(eq(users.id, user.id));

    return ONBOARDING_QUESTIONS.step2;
  }

  if (step === 2) {
    if (!messageText) {
      return ONBOARDING_QUESTIONS.step2;
    }

    const updatedContext = {
      ...context,
      timeAvailable: messageText,
    };

    await db
      .update(users)
      .set({ whatsappContext: updatedContext, whatsappStep: 3 })
      .where(eq(users.id, user.id));

    return ONBOARDING_QUESTIONS.step3;
  }

  if (step === 3) {
    if (!messageText) {
      return ONBOARDING_QUESTIONS.step3;
    }

    const updatedContext = {
      ...context,
      budgetConstraints: messageText,
    };

    const lovedOneContext: LovedOneContext = {
      situationType: "other",
      summary: updatedContext.caregivingSituation || "Sin contexto adicional",
      constraints: {},
      riskSignals: {},
    };

    const timeNumber = updatedContext.timeAvailable
      ? parseNumberFromText(updatedContext.timeAvailable)
      : null;
    const budgetNumber = updatedContext.budgetConstraints
      ? parseNumberFromText(updatedContext.budgetConstraints)
      : null;

    const caregiverContext: CaregiverContext = {
      timePerWeek: timeNumber && timeNumber > 0 ? Math.round(timeNumber) : 5,
      budgetPerWeekUsd: budgetNumber && budgetNumber >= 0 ? Math.round(budgetNumber) : 50,
      distance: "same_city",
      energyLevel: 3,
      supportNetwork: "alone",
      hardLimits: updatedContext.budgetConstraints || "",
    };

    const title = `Caso de cuidado: ${lovedOneContext.summary.slice(0, 60)}`;

    const [newCase] = await db
      .insert(cases)
      .values({
        userId: user.id,
        title,
        lovedOneContext,
        caregiverContext,
      })
      .returning();

    const { plan } = await generatePlan(newCase.id, lovedOneContext, caregiverContext);

    const generatedActions = await actionGenerator.generateFromPlan({
      caseId: newCase.id,
      plan,
      caregiverPhone: user.phoneNumber ?? undefined,
    });

    await approveGeneratedActions(generatedActions);

    await db
      .update(users)
      .set({
        whatsappState: "ACTIVO",
        whatsappStep: 0,
        whatsappContext: updatedContext,
      })
      .where(eq(users.id, user.id));

    const summary = buildPlanSummary(plan);

    const response = await generateEmpatheticResponse({
      summary,
      nextStep: "Ya tengo un plan inicial listo. ¿Quieres que te comparta el resumen ahora? Puedes responder 'plan' o 'status'.",
    });

    return response;
  }

  return ONBOARDING_QUESTIONS.step1;
}

async function handleContextUpdate(
  user: typeof users.$inferSelect,
  messageText: string
): Promise<string> {
  const activeCase = await getLatestCase(user.id);
  if (!activeCase) {
    await db
      .update(users)
      .set({ whatsappState: "NUEVO", whatsappStep: 1 })
      .where(eq(users.id, user.id));
    return ONBOARDING_QUESTIONS.step1;
  }

  const currentLovedOne = activeCase.lovedOneContext as LovedOneContext;
  const updatedLovedOne: LovedOneContext = {
    ...currentLovedOne,
    summary: `${currentLovedOne.summary}\n\nActualización: ${messageText}`.trim(),
  };

  const caregiverContext = activeCase.caregiverContext as CaregiverContext;

  await db
    .update(cases)
    .set({ lovedOneContext: updatedLovedOne })
    .where(eq(cases.id, activeCase.id));

  const { plan } = await generatePlan(activeCase.id, updatedLovedOne, caregiverContext);

  const generatedActions = await actionGenerator.generateFromPlan({
    caseId: activeCase.id,
    plan,
    caregiverPhone: user.phoneNumber ?? undefined,
  });

  await approveGeneratedActions(generatedActions);

  const summary = buildPlanSummary(plan);

  const response = await generateEmpatheticResponse({
    summary,
    nextStep: "Listo, ya actualicé el plan. ¿Quieres ver el resumen completo? Responde 'plan' o dime si prefieres otra cosa.",
  });

  return response;
}

async function handlePlanCommand(user: typeof users.$inferSelect): Promise<string> {
  const activeCase = await getLatestCase(user.id);
  if (!activeCase) {
    return "Aún no tengo un caso activo. Empecemos: ¿a quién cuidas y cuál es la situación principal?";
  }

  const latestPlan = await getLatestPlan(activeCase.id);
  if (!latestPlan) {
    return "Todavía estoy preparando tu plan. ¿Quieres compartir más contexto mientras tanto?";
  }

  const summary = buildPlanSummary(latestPlan.planJson as PlanJson);
  return generateEmpatheticResponse({
    summary,
    nextStep: summary,
    tone: "claridad y apoyo",
  });
}

async function handleStatusCommand(user: typeof users.$inferSelect): Promise<string> {
  const activeCase = await getLatestCase(user.id);
  if (!activeCase) {
    return "Aún no tengo acciones programadas porque no hay un caso activo. ¿Empezamos?";
  }

  const upcomingActions = await db
    .select()
    .from(actions)
    .where(and(eq(actions.caseId, activeCase.id), inArray(actions.status, ["approved"])))
    .orderBy(desc(actions.scheduledFor))
    .limit(10);

  const sorted = upcomingActions
    .filter((action) => action.scheduledFor)
    .sort((a, b) => (a.scheduledFor?.getTime() ?? 0) - (b.scheduledFor?.getTime() ?? 0))
    .slice(0, 3)
    .map((action) => ({
      title: (action.payload as { message?: string }).message ?? action.type,
      when: action.scheduledFor ? action.scheduledFor.toLocaleDateString("es-ES") : "por programar",
    }));

  return buildStatusSummary(sorted);
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const params = new URLSearchParams(rawBody);
  const signature = request.headers.get("X-Twilio-Signature");
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (authToken) {
    const isValid = verifyTwilioSignature({
      url: request.url,
      params,
      signature,
      authToken,
    });

    if (!isValid) {
      return new Response("Firma inválida", { status: 403 });
    }
  } else {
    console.warn("TWILIO_AUTH_TOKEN no configurado; omitiendo verificación de firma.");
  }

  const from = params.get("From")?.trim();
  const to = params.get("To")?.trim();
  const body = params.get("Body")?.trim() ?? "";
  const messageSid = params.get("MessageSid")?.trim();

  if (!from) {
    const twiml = buildTwimlMessage("No pude identificar tu número. Intenta de nuevo, por favor.");
    return new Response(twiml, { status: 200, headers: { "Content-Type": "text/xml" } });
  }

  const user = await getOrCreateWhatsAppUser(from);

  if (messageSid) {
    const existingInbound = await findInboundByMessageSid(messageSid);
    if (existingInbound) {
      const priorReply = await findOutboundReplyByMessageSid(user.id, messageSid);
      const replyText =
        priorReply?.body ??
        "Ya procesé tu mensaje. Si necesitas algo, escribe 'status' o 'plan'.";
      const twiml = buildTwimlMessage(replyText);
      return new Response(twiml, { status: 200, headers: { "Content-Type": "text/xml" } });
    }
  }

  await logMessage(user.id, "inbound", body, {
    ...Object.fromEntries(params.entries()),
    to,
    from,
    MessageSid: messageSid,
  });

  const command = parseCommand(body);
  let reply: string;

  if (user.whatsappState !== "ACTIVO") {
    if (command.type === "help") {
      reply = `${HELP_TEXT}\n\nAntes de eso, necesito conocerte. ${ONBOARDING_QUESTIONS.step1}`;
    } else {
      reply = await handleOnboarding(user, body);
    }
  } else {
    switch (command.type) {
      case "plan":
        reply = await handlePlanCommand(user);
        break;
      case "status":
        reply = await handleStatusCommand(user);
        break;
      case "help":
        reply = HELP_TEXT;
        break;
      case "update":
        reply = command.text
          ? await handleContextUpdate(user, command.text)
          : "Para actualizar, escribe: update [tu mensaje]";
        break;
      case "none":
        reply = body
          ? await handleContextUpdate(user, body)
          : "Cuéntame un poco más para poder ayudarte.";
        break;
      default:
        reply = HELP_TEXT;
    }
  }

  await logMessage(user.id, "outbound", reply, {
    inReplyTo: messageSid ?? null,
  });

  const twiml = buildTwimlMessage(reply);
  return new Response(twiml, { status: 200, headers: { "Content-Type": "text/xml" } });
}

export const dynamic = "force-dynamic";
