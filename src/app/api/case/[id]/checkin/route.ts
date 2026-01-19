import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { db, cases, checkins } from "@/db";
import { eq, and } from "drizzle-orm";

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

    const body = await request.json();
    const { actionId, done, outcomeNotes, costUsd, stress } = body;

    // Validate required fields
    if (!actionId || typeof done !== "boolean" || !stress) {
      return NextResponse.json(
        { message: "Missing required fields: actionId, done, stress" },
        { status: 400 }
      );
    }

    // Validate stress range
    if (stress < 1 || stress > 5) {
      return NextResponse.json(
        { message: "Stress must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create check-in
    const [checkin] = await db.insert(checkins).values({
      caseId: id,
      date: new Date(),
      actionId,
      done,
      outcomeNotes: outcomeNotes || null,
      costUsd: costUsd || null,
      stress,
    }).returning();

    return NextResponse.json({ id: checkin.id });
  } catch (error) {
    console.error("Error creating check-in:", error);
    return NextResponse.json(
      { message: "Failed to create check-in" },
      { status: 500 }
    );
  }
}
