import { NextResponse } from "next/server";
import { db, actions, cases, messages } from "@/db";
import { getCurrentUserId } from "@/lib/auth";
import { and, asc, desc, eq, gte } from "drizzle-orm";

type VolumePoint = { date: string; count: number };

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const days = 7;
    const dayBuckets: VolumePoint[] = Array.from({ length: days }).map((_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (days - 1 - index));
      return {
        date: date.toISOString().slice(0, 10),
        count: 0,
      };
    });

    const weekStart = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1)));

    const recentMessages = await db
      .select()
      .from(messages)
      .where(and(eq(messages.userId, userId), gte(messages.createdAt, weekStart)))
      .orderBy(asc(messages.createdAt));

    const bucketIndex = new Map(dayBuckets.map((bucket, index) => [bucket.date, index]));
    for (const message of recentMessages) {
      const key = message.createdAt.toISOString().slice(0, 10);
      const index = bucketIndex.get(key);
      if (index !== undefined) {
        dayBuckets[index].count += 1;
      }
    }

    const recentActions = await db
      .select()
      .from(actions)
      .leftJoin(cases, eq(actions.caseId, cases.id))
      .where(eq(cases.userId, userId))
      .orderBy(desc(actions.createdAt))
      .limit(200);

    const totalActions = recentActions.length;
    const completedActions = recentActions.filter((row) => row.actions.status === "completed").length;
    const completionRate = totalActions === 0 ? 0 : Math.round((completedActions / totalActions) * 100);

    const inbound = recentMessages.filter((message) => message.direction === "inbound");
    const outbound = recentMessages.filter((message) => message.direction === "outbound");

    let avgResponseMinutes = 0;
    if (inbound.length > 0 && outbound.length > 0) {
      let totalDelta = 0;
      let pairs = 0;
      for (const inboundMessage of inbound) {
        const nextOutbound = outbound.find((message) => message.createdAt > inboundMessage.createdAt);
        if (nextOutbound) {
          totalDelta += nextOutbound.createdAt.getTime() - inboundMessage.createdAt.getTime();
          pairs += 1;
        }
      }
      if (pairs > 0) {
        avgResponseMinutes = Math.round(totalDelta / pairs / 60000);
      }
    }

    return NextResponse.json({
      messageVolume: dayBuckets,
      completionRate,
      avgResponseMinutes,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ message: "Failed to fetch analytics" }, { status: 500 });
  }
}
