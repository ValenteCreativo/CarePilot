"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  RefreshCw,
  Clock,
  DollarSign,
  Zap,
  AlertTriangle,
  CheckCircle,
  Target,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

type CaseData = {
  id: string;
  title: string;
  lovedOneContext: {
    situationType: string;
    summary: string;
    constraints: Record<string, boolean>;
    riskSignals?: Record<string, boolean>;
  };
  caregiverContext: {
    timePerWeek: number;
    budgetPerWeekUsd: number;
    distance: string;
    energyLevel: number;
    supportNetwork: string;
    hardLimits?: string;
  };
  createdAt: string;
};

type PlanAction = {
  id: string;
  goal_id: string;
  title: string;
  steps: string[];
  time_minutes: number;
  cost_usd: number;
  effort: string;
  risk_notes: string;
  expected_signal: string;
};

type PlanData = {
  id: string;
  case_summary: string;
  goals: Array<{ id: string; title: string; why: string }>;
  actions: PlanAction[];
  weekly_rhythm: { checkin_prompt: string; review_prompt: string };
  safety_notes: string[];
  change_log?: string[];
};

type CaseResponse = {
  case: CaseData;
  latestPlan?: {
    id: string;
    planJson: PlanData;
    createdAt: string;
  };
  stats: {
    completedActions: number;
    totalCost: number;
    avgStress: number | null;
    totalCheckins: number;
  };
  charts: {
    stressTrend: Array<{ date: string; stress: number }>;
    actionsCompleted: Array<{ date: string; count: number }>;
  };
};

function getSituationLabel(type: string): string {
  const labels: Record<string, string> = {
    recovery: "Recovery",
    elder_care: "Elder Care",
    mental_health: "Mental Health",
    addiction: "Addiction",
    debt: "Debt",
    legal: "Legal",
    other: "Other",
  };
  return labels[type] || type;
}

function getEffortColor(effort: string): string {
  switch (effort) {
    case "low":
      return "bg-green-500/20 text-green-400";
    case "med":
      return "bg-yellow-500/20 text-yellow-400";
    case "high":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  const [data, setData] = useState<CaseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null);

  // Check-in dialog state
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<PlanAction | null>(null);
  const [checkInDone, setCheckInDone] = useState(false);
  const [checkInStress, setCheckInStress] = useState<string>("3");
  const [checkInNotes, setCheckInNotes] = useState("");
  const [checkInCost, setCheckInCost] = useState("");
  const [isSubmittingCheckIn, setIsSubmittingCheckIn] = useState(false);

  const fetchCase = useCallback(async () => {
    try {
      const response = await fetch(`/api/case/${caseId}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/app");
          return;
        }
        throw new Error("Failed to fetch case");
      }
      const caseData = await response.json();
      setData(caseData);
    } catch (error) {
      toast.error("Failed to load case");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [caseId, router]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/case/${caseId}/generate-plan`, {
        method: "POST",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate plan");
      }
      toast.success("Excellent decision! I'm getting started right now so you can rest a bit.");
      await fetchCase();
      setFeedbackGiven(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFeedback = async (helpful: boolean) => {
    if (!data?.latestPlan) return;

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: data.latestPlan.id,
          helpful,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit feedback");
      setFeedbackGiven(helpful);
      toast.success("Thanks for your feedback! Your dedication makes this possible.");
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  const handleCheckInSubmit = async () => {
    if (!selectedAction) return;

    setIsSubmittingCheckIn(true);
    try {
      const response = await fetch(`/api/case/${caseId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionId: selectedAction.id,
          done: checkInDone,
          stress: parseInt(checkInStress),
          outcomeNotes: checkInNotes || null,
          costUsd: checkInCost ? parseFloat(checkInCost) : null,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit check-in");
      toast.success("Check-in saved! Your consistency builds trust.");
      setCheckInOpen(false);
      setSelectedAction(null);
      setCheckInDone(false);
      setCheckInStress("3");
      setCheckInNotes("");
      setCheckInCost("");
      await fetchCase();
    } catch (error) {
      toast.error("Failed to submit check-in");
    } finally {
      setIsSubmittingCheckIn(false);
    }
  };

  if (isLoading) {
    return <CaseDetailSkeleton />;
  }

  if (!data) {
    return null;
  }

  const { case: caseData, latestPlan, stats, charts } = data;
  const plan = latestPlan?.planJson;

  return (
    <div className="space-y-6 text-[#004d6d]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/dashboard/cases" className="text-sm text-[#0097b2] hover:underline flex items-center gap-1 mb-2 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-[#004d6d]">{caseData.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="border-[#0097b2] text-[#0097b2] font-bold">
              {getSituationLabel(caseData.lovedOneContext.situationType)}
            </Badge>
            <span className="text-sm text-[#004d6d]/80 font-medium">
              Created {new Date(caseData.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/case/${caseId}/quality`}>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Quality Metrics
            </Button>
          </Link>
          <Button onClick={handleGeneratePlan} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                {plan ? "Update Plan" : "Generate Plan"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Case Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Case Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{caseData.lovedOneContext.summary}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{caseData.caregiverContext.timePerWeek}h/week available</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">${caseData.caregiverContext.budgetPerWeekUsd}/week budget</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Energy: {caseData.caregiverContext.energyLevel}/5</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{caseData.caregiverContext.distance.replace("_", " ")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Section */}
      {plan ? (
        <Tabs defaultValue="plan" className="space-y-4">
          <TabsList>
            <TabsTrigger value="plan">7-Day Plan</TabsTrigger>
            <TabsTrigger value="checkin">Quick Check-in</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="space-y-4">
            {/* Safety Notes */}
            {plan.safety_notes && plan.safety_notes.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Safety Notes</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    {plan.safety_notes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Goals</CardTitle>
                <CardDescription>{plan.case_summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {plan.goals.map((goal) => (
                    <Card key={goal.id} className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{goal.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{goal.why}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  {plan.actions.length} actions to complete this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plan.actions.map((action) => {
                    const goal = plan.goals.find((g) => g.id === action.goal_id);
                    return (
                      <Card key={action.id} className="bg-card">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{action.title}</CardTitle>
                              <CardDescription>Goal: {goal?.title}</CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {action.time_minutes}m
                              </Badge>
                              {action.cost_usd > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  {action.cost_usd}
                                </Badge>
                              )}
                              <Badge className={`text-xs ${getEffortColor(action.effort)}`}>
                                {action.effort}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Steps:</h4>
                            <ol className="list-decimal pl-4 space-y-1">
                              {action.steps.map((step, i) => (
                                <li key={i} className="text-sm text-muted-foreground">
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Expected signal:</span>
                              <p className="text-muted-foreground">{action.expected_signal}</p>
                            </div>
                            {action.risk_notes && (
                              <div>
                                <span className="font-medium">Risks:</span>
                                <p className="text-muted-foreground">{action.risk_notes}</p>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAction(action);
                              setCheckInOpen(true);
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Check-in on this action
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Rhythm */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Rhythm</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Daily Check-in Question</h4>
                  <p className="text-muted-foreground">{plan.weekly_rhythm.checkin_prompt}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Weekly Review Question</h4>
                  <p className="text-muted-foreground">{plan.weekly_rhythm.review_prompt}</p>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            {feedbackGiven === null && (
              <Card>
                <CardContent className="flex items-center justify-between py-4">
                  <span className="text-sm">Was this plan helpful?</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleFeedback(true)}>
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Yes
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleFeedback(false)}>
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      No
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="checkin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Check-in</CardTitle>
                <CardDescription>
                  Select an action and record your progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plan.actions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{action.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {action.time_minutes}m · ${action.cost_usd} · {action.effort} effort
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAction(action);
                          setCheckInOpen(true);
                        }}
                      >
                        Check-in
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.completedActions}</div>
                  <p className="text-sm text-muted-foreground">Actions Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">${stats.totalCost.toFixed(0)}</div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {stats.avgStress ? stats.avgStress.toFixed(1) : "—"}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Stress Level</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.totalCheckins}</div>
                  <p className="text-sm text-muted-foreground">Total Check-ins</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            {charts.stressTrend.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Stress Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={charts.stressTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                          stroke="#888"
                        />
                        <YAxis domain={[1, 5]} stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }}
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <Line
                          type="monotone"
                          dataKey="stress"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          dot={{ fill: "#8b5cf6" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {charts.actionsCompleted.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions Completed Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={charts.actionsCompleted}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="date" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }}
                        />
                        <Bar dataKey="count" fill="#22c55e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {charts.stressTrend.length === 0 && charts.actionsCompleted.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No check-in data yet. Complete some check-ins to see your progress.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No plan yet</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
              Generate a 7-day care plan based on your case details.
            </p>
            <Button onClick={handleGeneratePlan} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Check-in Dialog */}
      <Dialog open={checkInOpen} onOpenChange={setCheckInOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check-in: {selectedAction?.title}</DialogTitle>
            <DialogDescription>
              Record your progress on this action
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="done"
                checked={checkInDone}
                onCheckedChange={(checked) => setCheckInDone(checked === true)}
              />
              <Label htmlFor="done">Completed this action</Label>
            </div>

            <div className="space-y-2">
              <Label>Current stress level (1-5)</Label>
              <RadioGroup
                value={checkInStress}
                onValueChange={setCheckInStress}
                className="flex gap-4"
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={String(level)} id={`stress-${level}`} />
                    <Label htmlFor={`stress-${level}`}>{level}</Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low stress</span>
                <span>High stress</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="How did it go? Any observations?"
                value={checkInNotes}
                onChange={(e) => setCheckInNotes(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost spent (optional)</Label>
              <Input
                id="cost"
                type="number"
                placeholder="0"
                value={checkInCost}
                onChange={(e) => setCheckInCost(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCheckInSubmit} disabled={isSubmittingCheckIn}>
              {isSubmittingCheckIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Check-in"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CaseDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-9 w-64" />
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center">
            <Skeleton className="h-12 w-12 rounded-full mb-4" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64 mb-4" />
            <Skeleton className="h-10 w-36" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
