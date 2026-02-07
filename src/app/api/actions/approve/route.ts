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

    const success = await actionExecutor.approveAction(actionId);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to approve action" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error approving action:", error);
    return NextResponse.json(
      { error: "Failed to approve action", details: String(error) },
      { status: 500 }
    );
  }
}
