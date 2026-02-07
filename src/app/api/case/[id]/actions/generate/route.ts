import { NextResponse } from "next/server";
import { db, cases, plans } from "@/db";
import { eq, desc } from "drizzle-orm";
import { actionGenerator } from "@/lib/actions/generator";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await params;
    const { caregiverPhone } = await request.json();

    // Get the case
    const [caseData] = await db
      .select()
      .from(cases)
      .where(eq(cases.id, caseId))
      .limit(1);

    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // Get the latest plan
    const [latestPlan] = await db
      .select()
      .from(plans)
      .where(eq(plans.caseId, caseId))
      .orderBy(desc(plans.createdAt))
      .limit(1);

    if (!latestPlan) {
      return NextResponse.json({ error: "No plan found for this case" }, { status: 404 });
    }

    // Generate actions
    const actionIds = await actionGenerator.generateFromPlan({
      caseId,
      plan: latestPlan.planJson,
      caregiverPhone,
    });

    return NextResponse.json({
      success: true,
      actionCount: actionIds.length,
      actionIds,
    });
  } catch (error) {
    console.error("Error generating actions:", error);
    return NextResponse.json(
      { error: "Failed to generate actions", details: String(error) },
      { status: 500 }
    );
  }
}
