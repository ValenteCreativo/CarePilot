import { createHash } from "crypto";
import { db, llmRuns, llmEvals, plans, type LovedOneContext, type CaregiverContext, type PlanJson } from "@/db";
import { getOpikClient, getTrackedOpenAI, getModelName, logEvalScores, flushOpik } from "../opik";
import { geminiService } from "../gemini";
import { PROMPT_VERSION, buildTriagePrompt, buildPlanPrompt, buildCriticPrompt, buildEvalPrompt } from "./prompts";

type TriageResult = {
  redFlags: string[];
  disclaimers: string[];
  mustDoNow: string[];
};

type PipelineResult = {
  plan: PlanJson;
  triageResult: TriageResult;
  planId: string;
  traceId: string;
};

function hashInput(input: string): string {
  return createHash("sha256").update(input).digest("hex").slice(0, 16);
}

async function callAI(
  prompt: string,
  systemPrompt?: string
): Promise<{ content: string; latencyMs: number }> {
  // Use Gemini as primary AI for CarePilot
  if (process.env.GOOGLE_AI_API_KEY) {
    return geminiService.generateText(prompt, systemPrompt);
  }
  
  // Fallback to OpenAI if Gemini not configured
  const openai = getTrackedOpenAI();
  const model = getModelName();
  const start = Date.now();

  const messages: Array<{ role: "system" | "user"; content: string }> = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 4096,
  });

  const latencyMs = Date.now() - start;
  const content = response.choices[0]?.message?.content || "";

  return { content, latencyMs };
}

function parseJsonResponse<T>(content: string): T {
  // Try to extract JSON from the response
  let jsonStr = content;

  // Handle markdown code blocks
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  // Clean up and parse
  jsonStr = jsonStr.trim();
  return JSON.parse(jsonStr) as T;
}

export async function runTriageStage(
  caseId: string,
  lovedOneContext: LovedOneContext,
  caregiverContext: CaregiverContext
): Promise<{ result: TriageResult; llmRunId: string; traceId: string }> {
  const opikClient = getOpikClient();
  const model = getModelName();

  // Create trace for this stage
  const trace = opikClient.trace({
    name: "triage-stage",
    input: { caseId, stage: "triage" },
    metadata: {
      caseId,
      stage: "triage",
      promptVersion: PROMPT_VERSION,
      model,
    },
    tags: ["carepilot", "triage"],
  });

  try {
    const prompt = buildTriagePrompt(lovedOneContext, caregiverContext);
    const inputHash = hashInput(prompt);

    const { content, latencyMs } = await callAI(prompt);
    const result = parseJsonResponse<TriageResult>(content);

    // Log to database
    const [llmRun] = await db.insert(llmRuns).values({
      caseId,
      stage: "triage",
      promptVersion: PROMPT_VERSION,
      model,
      inputHash,
      outputJson: result,
      latencyMs,
      opikTraceId: trace.data.id,
    }).returning();

    trace.update({
      output: result,
    });
    trace.end();

    return { result, llmRunId: llmRun.id, traceId: trace.data.id };
  } catch (error) {
    trace.update({
      output: { error: String(error) },
    });
    trace.end();
    throw error;
  }
}

export async function runPlanStage(
  caseId: string,
  lovedOneContext: LovedOneContext,
  caregiverContext: CaregiverContext,
  triageResult: TriageResult
): Promise<{ result: PlanJson; llmRunId: string; traceId: string }> {
  const opikClient = getOpikClient();
  const model = getModelName();

  const trace = opikClient.trace({
    name: "plan-stage",
    input: { caseId, stage: "plan" },
    metadata: {
      caseId,
      stage: "plan",
      promptVersion: PROMPT_VERSION,
      model,
    },
    tags: ["carepilot", "plan"],
  });

  try {
    const prompt = buildPlanPrompt(lovedOneContext, caregiverContext, triageResult);
    const inputHash = hashInput(prompt);

    const { content, latencyMs } = await callAI(prompt);
    const result = parseJsonResponse<PlanJson>(content);

    const [llmRun] = await db.insert(llmRuns).values({
      caseId,
      stage: "plan",
      promptVersion: PROMPT_VERSION,
      model,
      inputHash,
      outputJson: result,
      latencyMs,
      opikTraceId: trace.data.id,
    }).returning();

    trace.update({
      output: result,
    });
    trace.end();

    return { result, llmRunId: llmRun.id, traceId: trace.data.id };
  } catch (error) {
    trace.update({
      output: { error: String(error) },
    });
    trace.end();
    throw error;
  }
}

export async function runCriticStage(
  caseId: string,
  lovedOneContext: LovedOneContext,
  caregiverContext: CaregiverContext,
  planResult: PlanJson
): Promise<{ result: PlanJson; llmRunId: string; traceId: string }> {
  const opikClient = getOpikClient();
  const model = getModelName();

  const trace = opikClient.trace({
    name: "critic-stage",
    input: { caseId, stage: "critic" },
    metadata: {
      caseId,
      stage: "critic",
      promptVersion: PROMPT_VERSION,
      model,
    },
    tags: ["carepilot", "critic"],
  });

  try {
    const planJson = JSON.stringify(planResult, null, 2);
    const prompt = buildCriticPrompt(lovedOneContext, caregiverContext, planJson);
    const inputHash = hashInput(prompt);

    const { content, latencyMs } = await callAI(prompt);
    const result = parseJsonResponse<PlanJson>(content);

    const [llmRun] = await db.insert(llmRuns).values({
      caseId,
      stage: "critic",
      promptVersion: PROMPT_VERSION,
      model,
      inputHash,
      outputJson: result,
      latencyMs,
      opikTraceId: trace.data.id,
    }).returning();

    trace.update({
      output: result,
    });
    trace.end();

    return { result, llmRunId: llmRun.id, traceId: trace.data.id };
  } catch (error) {
    trace.update({
      output: { error: String(error) },
    });
    trace.end();
    throw error;
  }
}

export async function runEvals(
  llmRunId: string,
  traceId: string,
  planJson: PlanJson,
  caregiverContext: CaregiverContext
): Promise<void> {
  const model = getModelName();
  const planJsonStr = JSON.stringify(planJson, null, 2);

  const metrics = ["actionability", "feasibility", "empathy_tone", "safety"];
  const evalResults: Array<{
    metricName: string;
    scoreNumber: number | null;
    verdict: string | null;
    rationale: string;
  }> = [];

  for (const metric of metrics) {
    try {
      const prompt = buildEvalPrompt(metric, planJsonStr, caregiverContext);
      const { content } = await callAI(prompt);
      const result = parseJsonResponse<{ score?: number; verdict?: string; rationale: string }>(content);

      const evalResult = {
        metricName: metric,
        scoreNumber: result.score ?? null,
        verdict: result.verdict ?? null,
        rationale: result.rationale,
      };
      evalResults.push(evalResult);

      // Log to database
      await db.insert(llmEvals).values({
        llmRunId,
        metricName: metric,
        scoreNumber: result.score ?? null,
        verdict: result.verdict ?? null,
        rationale: result.rationale,
      });
    } catch (error) {
      console.error(`Error running eval for ${metric}:`, error);
      // Log error eval
      await db.insert(llmEvals).values({
        llmRunId,
        metricName: metric,
        scoreNumber: null,
        verdict: "error",
        rationale: `Eval failed: ${String(error)}`,
      });
    }
  }

  // Log scores to Opik
  const opikScores = evalResults
    .filter((r) => r.scoreNumber !== null || r.verdict !== null)
    .map((r) => ({
      name: r.metricName,
      value: r.scoreNumber ?? (r.verdict === "pass" ? 1 : 0),
      reason: r.rationale,
    }));

  if (opikScores.length > 0) {
    await logEvalScores(traceId, opikScores);
  }
}

export async function generatePlan(
  caseId: string,
  lovedOneContext: LovedOneContext,
  caregiverContext: CaregiverContext
): Promise<PipelineResult> {
  const model = getModelName();

  // Stage 1: Triage
  const { result: triageResult } = await runTriageStage(caseId, lovedOneContext, caregiverContext);

  // Stage 2: Plan
  const { result: initialPlan } = await runPlanStage(caseId, lovedOneContext, caregiverContext, triageResult);

  // Stage 3: Critic
  const { result: finalPlan, llmRunId, traceId } = await runCriticStage(caseId, lovedOneContext, caregiverContext, initialPlan);

  // Save the plan to database
  const [savedPlan] = await db.insert(plans).values({
    caseId,
    promptVersion: PROMPT_VERSION,
    model,
    planJson: finalPlan,
  }).returning();

  // Run evals asynchronously (don't block response)
  runEvals(llmRunId, traceId, finalPlan, caregiverContext).catch(console.error);

  // Flush Opik traces
  await flushOpik();

  return {
    plan: finalPlan,
    triageResult,
    planId: savedPlan.id,
    traceId,
  };
}
