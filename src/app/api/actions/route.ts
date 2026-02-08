import { NextRequest, NextResponse } from "next/server";
import { db, actions, cases } from "@/db";
import { getCurrentUserId } from "@/lib/auth";
import { and, desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .select({
        id: actions.id,
        type: actions.type,
        status: actions.status,
        payload: actions.payload,
        scheduledFor: actions.scheduledFor,
        createdAt: actions.createdAt,
        caseId: actions.caseId,
        caseTitle: cases.title,
      })
      .from(actions)
      .leftJoin(cases, eq(actions.caseId, cases.id))
      .where(eq(cases.userId, userId))
      .orderBy(desc(actions.createdAt));

    return NextResponse.json({ actions: rows });
  } catch (error) {
    console.error("Error fetching actions:", error);
    return NextResponse.json({ message: "Failed to fetch actions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { caseId, type, payload, scheduledFor } = body as {
      caseId?: string;
      type?: "reminder" | "message" | "calendar" | "checkin_prompt";
      payload?: unknown;
      scheduledFor?: string;
    };

    if (!caseId || !type || !payload) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const caseRow = await db.query.cases.findFirst({
      where: and(eq(cases.id, caseId), eq(cases.userId, userId)),
    });

    if (!caseRow) {
      return NextResponse.json({ message: "Case not found" }, { status: 404 });
    }

    const [newAction] = await db
      .insert(actions)
      .values({
        caseId,
        type,
        payload,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      })
      .returning();

    return NextResponse.json({ action: newAction });
  } catch (error) {
    console.error("Error creating action:", error);
    return NextResponse.json({ message: "Failed to create action" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body as {
      id?: string;
      status?: "pending" | "approved" | "executing" | "completed" | "failed";
    };

    if (!id || !status) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const actionRow = await db
      .select({ id: actions.id })
      .from(actions)
      .leftJoin(cases, eq(actions.caseId, cases.id))
      .where(and(eq(actions.id, id), eq(cases.userId, userId)))
      .limit(1);

    if (actionRow.length === 0) {
      return NextResponse.json({ message: "Action not found" }, { status: 404 });
    }

    const now = new Date();
    const updateValues =
      status === "approved"
        ? { status, approvedAt: now, updatedAt: now }
        : status === "completed"
        ? { status, executedAt: now, updatedAt: now }
        : status === "failed"
        ? { status, failureReason: "Rejected by user", updatedAt: now }
        : { status, updatedAt: now };

    const [updated] = await db.update(actions).set(updateValues).where(eq(actions.id, id)).returning();

    return NextResponse.json({ action: updated });
  } catch (error) {
    console.error("Error updating action:", error);
    return NextResponse.json({ message: "Failed to update action" }, { status: 500 });
  }
}
