import { NextResponse } from "next/server";
import { executeApprovedActions } from "@/lib/actions/cron";

export async function POST() {
  try {
    const result = await executeApprovedActions();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error executing approved actions:", error);
    return NextResponse.json(
      { error: "Failed to execute approved actions", details: String(error) },
      { status: 500 }
    );
  }
}
