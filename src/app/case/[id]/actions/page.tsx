"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, XCircle, Play } from "lucide-react";

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
  approvedAt: string | null;
  failureReason: string | null;
  createdAt: string;
}

function ActionStatusBadge({ status }: { status: ActionStatus }) {
  const variants: Record<ActionStatus, { icon: React.ReactNode; label: string; className: string }> = {
    pending: { icon: <Clock className="h-3 w-3" />, label: "Pending", className: "bg-yellow-100 text-yellow-800" },
    approved: { icon: <CheckCircle className="h-3 w-3" />, label: "Approved", className: "bg-blue-100 text-blue-800" },
    executing: { icon: <Play className="h-3 w-3" />, label: "Executing", className: "bg-purple-100 text-purple-800" },
    completed: { icon: <CheckCircle className="h-3 w-3" />, label: "Completed", className: "bg-green-100 text-green-800" },
    failed: { icon: <XCircle className="h-3 w-3" />, label: "Failed", className: "bg-red-100 text-red-800" },
  };

  const variant = variants[status];

  return (
    <Badge className={`${variant.className} flex items-center gap-1`}>
      {variant.icon}
      {variant.label}
    </Badge>
  );
}

export default function ActionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

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
    try {
      await fetch("/api/actions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId }),
      });
      fetchActions();
    } catch (error) {
      console.error("Failed to approve action:", error);
    }
  }

  async function executeAction(actionId: string) {
    try {
      await fetch("/api/actions/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId }),
      });
      fetchActions();
    } catch (error) {
      console.error("Failed to execute action:", error);
    }
  }

  if (loading) {
    return <div className="p-8">Loading actions...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/case/${id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Case
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Autonomous Actions</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Action Queue</CardTitle>
            <CardDescription>
              CarePilot can execute these actions autonomously after approval
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {actions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No actions generated yet. Actions are created when you generate a plan with a phone number.
              </div>
            )}

            {actions.map((action) => (
              <Card key={action.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{action.type.replace("_", " ")}</Badge>
                      <ActionStatusBadge status={action.status} />
                    </div>

                    <div className="text-sm">
                      <strong>Message:</strong> {(action.payload as { message?: string }).message || "N/A"}
                    </div>

                    {action.scheduledFor && (
                      <div className="text-xs text-gray-600">
                        Scheduled for: {new Date(action.scheduledFor).toLocaleString()}
                      </div>
                    )}

                    {action.executedAt && (
                      <div className="text-xs text-gray-600">
                        Executed at: {new Date(action.executedAt).toLocaleString()}
                      </div>
                    )}

                    {action.failureReason && (
                      <div className="text-xs text-red-600">
                        Failure: {action.failureReason}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {action.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => approveAction(action.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => executeAction(action.id)}>
                          Execute Now
                        </Button>
                      </>
                    )}

                    {action.status === "approved" && (
                      <Button size="sm" onClick={() => executeAction(action.id)}>
                        Execute
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
