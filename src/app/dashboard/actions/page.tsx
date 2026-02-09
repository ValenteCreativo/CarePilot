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
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-[#004d6d]">Actions</h1>
        <p className="text-[#004d6d]/90 text-lg">
          Review and approve automation tasks before they run for caregivers.
        </p>
      </div>
      <div className="bg-white border-2 border-[#0097b2]/30 rounded-xl shadow-xl p-6">
        <ActionsKanban initialActions={initialActions} />
      </div>
    </div>
  );
}
