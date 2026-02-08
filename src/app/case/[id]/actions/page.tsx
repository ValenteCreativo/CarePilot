"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ActionStatus = "pending" | "approved" | "executing" | "completed" | "failed";
type ActionType = "reminder" | "message" | "calendar" | "checkin_prompt";

interface Action {
  id: string;
  caseId: string;
  type: ActionType;
  status: ActionStatus;
  payload: Record<string, unknown>;
  scheduledFor: string | null;
  executedAt: string | null;
  createdAt: string;
}

const statusStyles: Record<ActionStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  executing: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

export default function ActionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    fetchActions();
  }, [id]);

  async function fetchActions() {
    try {
      const response = await fetch(`/api/case/${id}/actions`);
      const data = await response.json();
      setActions(data.actions || []);
    } catch (error) {
      console.error("Failed to fetch actions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function approveAction(actionId: string) {
    setSubmittingId(actionId);
    try {
      await fetch("/api/actions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId }),
      });
      fetchActions();
    } catch (error) {
      console.error("Failed to approve action:", error);
    } finally {
      setSubmittingId(null);
    }
  }

  async function rejectAction(actionId: string) {
    setSubmittingId(actionId);
    try {
      await fetch("/api/actions/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId }),
      });
      fetchActions();
    } catch (error) {
      console.error("Failed to reject action:", error);
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-10">
      <div className="flex items-center gap-3">
        <Link href={`/case/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Case
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Action Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Review, approve, or reject upcoming actions.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading actions...</div>
      ) : actions.length === 0 ? (
        <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          No actions have been generated for this case yet.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled For</TableHead>
                <TableHead>Executed At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.map((action) => {
                const message = (action.payload as { message?: string }).message || "—";
                const isPending = action.status === "pending";
                const isSubmitting = submittingId === action.id;

                return (
                  <TableRow key={action.id}>
                    <TableCell className="font-medium">
                      {action.type.replace("_", " ")}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{message}</TableCell>
                    <TableCell>
                      <Badge className={statusStyles[action.status]}>
                        {action.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(action.scheduledFor)}</TableCell>
                    <TableCell>{formatDate(action.executedAt)}</TableCell>
                    <TableCell className="text-right">
                      {isPending ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => approveAction(action.id)}
                            disabled={isSubmitting}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectAction(action.id)}
                            disabled={isSubmitting}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
