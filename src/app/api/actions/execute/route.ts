import { NextResponse } from "next/server";
import { actionExecutor } from "@/lib/actions/executor";

export async function POST(request: Request) {
  try {
    const { actionId } = await request.json();

    if (!actionId) {
      return NextResponse.json(
        { error: "actionId is required" },
        { status: 400 }
      );
    }

    const result = await actionExecutor.executeAction(actionId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error executing action:", error);
    return NextResponse.json(
      { error: "Failed to execute action", details: String(error) },
      { status: 500 }
    );
  }
}
