import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { db, cases, actions } from "@/db";
import { eq, and } from "drizzle-orm";
import { generatePlan } from "@/lib/pipeline";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getCurrentUserId();
    
    await request.json().catch(() => ({}));

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch the case
    const caseData = await db.query.cases.findFirst({
      where: and(eq(cases.id, id), eq(cases.userId, userId)),
    });

    if (!caseData) {
      return NextResponse.json(
        { message: "Case not found" },
        { status: 404 }
      );
    }

    // Run the pipeline
    const result = await generatePlan(
      caseData.id,
      caseData.lovedOneContext,
      caseData.caregiverContext
    );

    const caregiverContext = (caseData.caregiverContext ?? {}) as Record<string, unknown>;
    const phoneNumber =
      (caregiverContext.phoneNumber as string | undefined) ||
      (caregiverContext.phone as string | undefined) ||
      process.env.TWILIO_DEFAULT_NUMBER ||
      "";

    const now = new Date();
    const createdActions = await Promise.all(
      result.plan.actions.map((planAction, index) => {
        const actionDay = index + 1;
        const scheduledFor = new Date(now);
        scheduledFor.setDate(now.getDate() + actionDay);

        return db
          .insert(actions)
          .values({
            caseId: caseData.id,
            type: "reminder",
            status: "pending",
            payload: {
              message: planAction.title,
              phoneNumber,
              actionDay,
              actionIndex: index,
            },
            scheduledFor,
          })
          .returning({ id: actions.id });
      })
    );

    const actionIds = createdActions.flatMap((rows) => rows.map((row) => row.id));

    return NextResponse.json({
      plan: result.plan,
      planId: result.planId,
      triageResult: result.triageResult,
      actionsGenerated: actionIds.length > 0,
      actionCount: actionIds.length,
    });
  } catch (error) {
    console.error("Error generating plan:", error);
    return NextResponse.json(
      { message: "Failed to generate plan", error: String(error) },
      { status: 500 }
    );
  }
}
