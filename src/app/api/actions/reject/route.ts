import { NextResponse } from "next/server";
import { db, actions } from "@/db";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { actionId } = await request.json();

    if (!actionId) {
      return NextResponse.json(
        { error: "actionId is required" },
        { status: 400 }
      );
    }

    await db
      .update(actions)
      .set({
        status: "failed",
        failureReason: "Rejected by user",
        executedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(actions.id, actionId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error rejecting action:", error);
    return NextResponse.json(
      { error: "Failed to reject action", details: String(error) },
      { status: 500 }
    );
  }
}
