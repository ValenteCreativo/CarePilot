import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { db, humanFeedback, plans, cases } from "@/db";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, helpful, note } = body;

    // Validate required fields
    if (!planId || typeof helpful !== "boolean") {
      return NextResponse.json(
        { message: "Missing required fields: planId, helpful" },
        { status: 400 }
      );
    }

    // Verify plan belongs to user's case
    const plan = await db.query.plans.findFirst({
      where: eq(plans.id, planId),
      with: {
        case: {
          columns: { userId: true },
        },
      },
    });

    if (!plan || plan.case.userId !== userId) {
      return NextResponse.json(
        { message: "Plan not found" },
        { status: 404 }
      );
    }

    // Create feedback
    const [feedback] = await db.insert(humanFeedback).values({
      planId,
      helpful,
      note: note || null,
    }).returning();

    return NextResponse.json({ id: feedback.id });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { message: "Failed to create feedback" },
      { status: 500 }
    );
  }
}
