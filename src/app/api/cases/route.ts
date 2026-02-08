import { NextRequest, NextResponse } from "next/server";
import { db, cases, type LovedOneContext, type CaregiverContext } from "@/db";
import { getCurrentUserId } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .select()
      .from(cases)
      .where(eq(cases.userId, userId))
      .orderBy(desc(cases.createdAt));

    return NextResponse.json({ cases: rows });
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json({ message: "Failed to fetch cases" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, lovedOneContext, caregiverContext } = body as {
      title?: string;
      lovedOneContext?: LovedOneContext;
      caregiverContext?: CaregiverContext;
    };

    if (!title || !lovedOneContext || !caregiverContext) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const [newCase] = await db
      .insert(cases)
      .values({
        userId,
        title,
        lovedOneContext,
        caregiverContext,
      })
      .returning();

    return NextResponse.json({ case: newCase });
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json({ message: "Failed to create case" }, { status: 500 });
  }
}
