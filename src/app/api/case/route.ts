import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db, cases, type LovedOneContext, type CaregiverContext } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const userId = await getOrCreateUser();
    const body = await request.json();

    const { title, lovedOneContext, caregiverContext } = body;

    // Validate required fields
    if (!title || !lovedOneContext || !caregiverContext) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate lovedOneContext
    const validSituationTypes = [
      "recovery",
      "elder_care",
      "mental_health",
      "addiction",
      "debt",
      "legal",
      "other",
    ];
    if (!validSituationTypes.includes(lovedOneContext.situationType)) {
      return NextResponse.json(
        { message: "Invalid situation type" },
        { status: 400 }
      );
    }

    // Validate caregiverContext
    const validDistances = ["same_home", "same_city", "remote"];
    const validSupportNetworks = ["alone", "some_help", "team"];
    if (!validDistances.includes(caregiverContext.distance)) {
      return NextResponse.json(
        { message: "Invalid distance value" },
        { status: 400 }
      );
    }
    if (!validSupportNetworks.includes(caregiverContext.supportNetwork)) {
      return NextResponse.json(
        { message: "Invalid support network value" },
        { status: 400 }
      );
    }

    // Create the case
    const [newCase] = await db
      .insert(cases)
      .values({
        userId,
        title,
        lovedOneContext: lovedOneContext as LovedOneContext,
        caregiverContext: caregiverContext as CaregiverContext,
      })
      .returning();

    return NextResponse.json({ id: newCase.id });
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { message: "Failed to create case" },
      { status: 500 }
    );
  }
}
