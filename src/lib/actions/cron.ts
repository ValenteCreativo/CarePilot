import { db, actions } from "@/db";
import { and, eq, lte } from "drizzle-orm";
import { actionExecutor } from "./executor";

export async function executeApprovedActions(): Promise<{ processed: number }> {
  const now = new Date();
  const approvedActions = await db
    .select()
    .from(actions)
    .where(and(eq(actions.status, "approved"), lte(actions.scheduledFor, now)));

  for (const action of approvedActions) {
    await actionExecutor.executeAction(action.id);
  }

  return { processed: approvedActions.length };
}
