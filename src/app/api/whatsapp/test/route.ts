import { NextResponse } from "next/server";
import { db, messages } from "@/db";
import { getCurrentUserId } from "@/lib/auth";

export async function POST() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [newMessage] = await db
      .insert(messages)
      .values({
        userId,
        direction: "outbound",
        body: "Test message from CarePilot: Your WhatsApp connection is ready.",
        raw: { source: "dashboard-test" },
      })
      .returning();

    return NextResponse.json({ ok: true, message: newMessage });
  } catch (error) {
    console.error("Error sending test message:", error);
    return NextResponse.json({ message: "Failed to send test message" }, { status: 500 });
  }
}
