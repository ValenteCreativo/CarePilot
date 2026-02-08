import { NextResponse } from "next/server";
import { db, actions } from "@/db";
import { eq, desc } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await params;

    const caseActions = await db
      .select()
      .from(actions)
      .where(eq(actions.caseId, caseId))
      .orderBy(desc(actions.createdAt));

    return NextResponse.json({ actions: caseActions });
  } catch (error) {
    console.error("Error fetching actions:", error);
    return NextResponse.json(
      { error: "Failed to fetch actions", details: String(error) },
      { status: 500 }
    );
  }
}
