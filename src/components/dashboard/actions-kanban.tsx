"use client";

import { useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type ActionRow = {
  id: string;
  type: "reminder" | "message" | "calendar" | "checkin_prompt";
  status: "pending" | "approved" | "executing" | "completed" | "failed";
  payload: unknown;
  scheduledFor: string | null;
  caseTitle: string | null;
};

type ColumnKey = "pending" | "approved" | "executing" | "completed";

const columns: Array<{ key: ColumnKey; label: string; helper: string }> = [
  { key: "pending", label: "For Review", helper: "Suggestions from your Guide" },
  { key: "approved", label: "On the Way", helper: "Scheduled to act" },
  { key: "executing", label: "Acting", helper: "CarePilot is on it" },
  { key: "completed", label: "Peace Achieved", helper: "Done and settled" },
];

function getPayloadLabel(payload: unknown) {
  if (!payload || typeof payload !== "object") return "General action";
  const message = (payload as { message?: string }).message;
  return message ?? "Care action";
}

export function ActionsKanban({ initialActions }: { initialActions: ActionRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const grouped = useMemo(() => {
    const buckets: Record<ColumnKey, ActionRow[]> = {
      pending: [],
      approved: [],
      executing: [],
      completed: [],
    };

    for (const action of initialActions) {
      if (action.status === "pending") buckets.pending.push(action);
      else if (action.status === "approved") buckets.approved.push(action);
      else if (action.status === "executing") buckets.executing.push(action);
      else buckets.completed.push(action);
    }
    return buckets;
  }, [initialActions]);

  const updateStatus = (id: string, status: ActionRow["status"]) => {
    startTransition(async () => {
      const response = await fetch("/api/actions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: "Update failed" }));
        toast.error(data.message ?? "Update failed");
        return;
      }

      toast.success("All set!");
      router.refresh();
    });
  };

  return (
    <div className="grid lg:grid-cols-4 gap-4">
      {columns.map((column) => (
        <div key={column.key} className="space-y-3">
          <div className="px-1">
            <h3 className="text-sm font-semibold">{column.label}</h3>
            <p className="text-xs text-[#004d6d]/90">{column.helper}</p>
          </div>
          <div className="space-y-3">
            {grouped[column.key].length === 0 ? (
              <Card className="bg-card/60 backdrop-blur-md border border-primary/10 shadow-lg border-dashed">
                <CardContent className="p-4 text-xs text-[#004d6d]/90">Nothing here yet.</CardContent>
              </Card>
            ) : (
              grouped[column.key].map((action) => (
                <Card key={action.id} className="bg-card/60 backdrop-blur-md border border-primary/10 shadow-lg hover:bg-card/70 hover:-translate-y-0.5 transition-all duration-300">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#004d6d]/90">
                      <span>{action.caseTitle ?? "Care case"}</span>
                      <Badge variant="outline">{action.type.replace("_", " ")}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{getPayloadLabel(action.payload)}</p>
                      <p className="text-xs text-[#004d6d]/90 mt-1">
                        {action.scheduledFor
                          ? `Scheduled: ${new Date(action.scheduledFor).toLocaleString()}`
                          : "Scheduled time TBD"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {action.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateStatus(action.id, "approved")}
                            disabled={isPending}
                          >
                            Let's do this
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(action.id, "failed")}
                            disabled={isPending}
                          >
                            Not now
                          </Button>
                        </>
                      )}
                      {action.status === "approved" && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(action.id, "completed")}
                          disabled={isPending}
                        >
                          Mark as done
                        </Button>
                      )}
                      {action.status === "executing" && (
                        <Button size="sm" variant="outline" disabled>
                          On it...
                        </Button>
                      )}
                      {action.status === "completed" && (
                        <Button size="sm" variant="ghost" disabled>
                          All set
                        </Button>
                      )}
                      {action.status === "failed" && (
                        <Button size="sm" variant="ghost" disabled>
                          Passed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
