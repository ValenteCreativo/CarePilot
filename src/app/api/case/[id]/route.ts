import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { db, cases, plans, checkins } from "@/db";
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

    // Fetch the latest plan
    const latestPlan = await db.query.plans.findFirst({
      where: eq(plans.caseId, id),
      orderBy: [desc(plans.createdAt)],
    });

    // Fetch check-ins for stats
    const caseCheckins = await db.query.checkins.findMany({
      where: eq(checkins.caseId, id),
      orderBy: [desc(checkins.date)],
    });

    // Calculate stats
    const completedActions = caseCheckins.filter((c) => c.done).length;
    const totalCost = caseCheckins.reduce((sum, c) => sum + (c.costUsd || 0), 0);
    const avgStress =
      caseCheckins.length > 0
        ? caseCheckins.reduce((sum, c) => sum + c.stress, 0) / caseCheckins.length
        : null;

    // Get stress trend (last 7 check-ins)
    const recentCheckins = caseCheckins.slice(0, 7).reverse();
    const stressTrend = recentCheckins.map((c) => ({
      date: c.date,
      stress: c.stress,
    }));

    // Get actions completed over time
    const actionsOverTime = caseCheckins
      .filter((c) => c.done)
      .reduce((acc, c) => {
        const dateKey = new Date(c.date).toISOString().split("T")[0];
        acc[dateKey] = (acc[dateKey] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const actionsCompletedData = Object.entries(actionsOverTime)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    return NextResponse.json({
      case: caseData,
      latestPlan,
      stats: {
        completedActions,
        totalCost,
        avgStress,
        totalCheckins: caseCheckins.length,
      },
      charts: {
        stressTrend,
        actionsCompleted: actionsCompletedData,
      },
    });
  } catch (error) {
    console.error("Error fetching case:", error);
    return NextResponse.json(
      { message: "Failed to fetch case" },
      { status: 500 }
    );
  }
}
