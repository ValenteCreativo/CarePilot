import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { db, cases, llmRuns, llmEvals } from "@/db";
import { eq, and, desc } from "drizzle-orm";

export async function GET(
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

    // Verify case ownership
    const caseData = await db.query.cases.findFirst({
      where: and(eq(cases.id, id), eq(cases.userId, userId)),
      columns: { id: true },
    });

    if (!caseData) {
      return NextResponse.json(
        { message: "Case not found" },
        { status: 404 }
      );
    }

    // Fetch LLM runs with evals, most recent first
    const runs = await db.query.llmRuns.findMany({
      where: eq(llmRuns.caseId, id),
      orderBy: [desc(llmRuns.createdAt)],
      limit: 20,
      with: {
        evals: true,
      },
    });

    // Calculate aggregates from the last 10 critic runs
    const criticRuns = runs.filter((r) => r.stage === "critic").slice(0, 10);

    const allEvals = criticRuns.flatMap((r) => r.evals);

    const actionabilityScores = allEvals
      .filter((e) => e.metricName === "actionability" && e.scoreNumber !== null)
      .map((e) => e.scoreNumber as number);

    const feasibilityScores = allEvals
      .filter((e) => e.metricName === "feasibility" && e.scoreNumber !== null)
      .map((e) => e.scoreNumber as number);

    const empathyScores = allEvals
      .filter((e) => e.metricName === "empathy_tone" && e.scoreNumber !== null)
      .map((e) => e.scoreNumber as number);

    const safetyVerdicts = allEvals.filter((e) => e.metricName === "safety");
    const safetyPasses = safetyVerdicts.filter((e) => e.verdict === "pass").length;

    const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

    // Get unique prompt versions
    const promptVersions = [...new Set(runs.map((r) => r.promptVersion))];

    return NextResponse.json({
      runs: runs.map((r) => ({
        id: r.id,
        stage: r.stage,
        promptVersion: r.promptVersion,
        model: r.model,
        latencyMs: r.latencyMs,
        opikTraceId: r.opikTraceId,
        createdAt: r.createdAt,
        evals: r.evals.map((e) => ({
          id: e.id,
          metricName: e.metricName,
          scoreNumber: e.scoreNumber,
          verdict: e.verdict,
          rationale: e.rationale,
        })),
      })),
      aggregates: {
        avgActionability: avg(actionabilityScores),
        avgFeasibility: avg(feasibilityScores),
        avgEmpathyTone: avg(empathyScores),
        safetyPassRate: safetyVerdicts.length > 0 ? safetyPasses / safetyVerdicts.length : null,
      },
      promptVersions,
    });
  } catch (error) {
    console.error("Error fetching quality data:", error);
    return NextResponse.json(
      { message: "Failed to fetch quality data" },
      { status: 500 }
    );
  }
}
