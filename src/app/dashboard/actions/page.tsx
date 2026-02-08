import { db, actions, cases } from "@/db";
import { getCurrentUserId } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { ActionsKanban } from "@/components/dashboard/actions-kanban";

export default async function ActionsPage() {
  const userId = await getCurrentUserId();
  let rows: Array<{
    id: string;
    type: "reminder" | "message" | "calendar" | "checkin_prompt";
    status: "pending" | "approved" | "executing" | "completed" | "failed";
    payload: unknown;
    scheduledFor: Date | null;
    caseTitle: string | null;
  }> = [];

  if (userId) {
    try {
      rows = await db
        .select({
          id: actions.id,
          type: actions.type,
          status: actions.status,
          payload: actions.payload,
          scheduledFor: actions.scheduledFor,
          caseTitle: cases.title,
        })
        .from(actions)
        .leftJoin(cases, eq(actions.caseId, cases.id))
        .where(eq(cases.userId, userId))
        .orderBy(desc(actions.createdAt));
    } catch (error) {
      console.error("Actions page error:", error);
    }
  }

  const initialActions = rows.map((row) => ({
    ...row,
    scheduledFor: row.scheduledFor ? row.scheduledFor.toISOString() : null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Actions</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve automation tasks before they run for caregivers.
        </p>
      </div>
      <ActionsKanban initialActions={initialActions} />
    </div>
  );
}
