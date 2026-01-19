import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { db, cases } from "@/db";
import { eq, and } from "drizzle-orm";
import { generatePlan } from "@/lib/pipeline";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getCurrentUserId();

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

    return NextResponse.json({
      plan: result.plan,
      planId: result.planId,
      triageResult: result.triageResult,
    });
  } catch (error) {
    console.error("Error generating plan:", error);
    return NextResponse.json(
      { message: "Failed to generate plan", error: String(error) },
      { status: 500 }
    );
  }
}
