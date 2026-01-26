"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  HelpCircle,
  ClipboardList,
  LineChart,
  Sparkles,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

type LlmRun = {
  id: string;
  stage: string;
  promptVersion: string;
  model: string;
  latencyMs: number;
  opikTraceId: string | null;
  createdAt: string;
  evals: Array<{
    id: string;
    metricName: string;
    scoreNumber: number | null;
    verdict: string | null;
    rationale: string;
  }>;
};

type QualityData = {
  runs: LlmRun[];
  aggregates: {
    avgActionability: number | null;
    avgFeasibility: number | null;
    avgEmpathyTone: number | null;
    safetyPassRate: number | null;
  };
  promptVersions: string[];
};

function getScoreColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 4) return "text-green-400";
  if (score >= 3) return "text-yellow-400";
  return "text-red-400";
}

function getScoreBg(score: number | null): string {
  if (score === null) return "bg-muted/30";
  if (score >= 4) return "bg-green-500/10 border-green-500/20";
  if (score >= 3) return "bg-yellow-500/10 border-yellow-500/20";
  return "bg-red-500/10 border-red-500/20";
}

function getVerdictIcon(verdict: string | null) {
  if (verdict === "pass") return <CheckCircle className="w-4 h-4 text-green-400" />;
  if (verdict === "fail") return <XCircle className="w-4 h-4 text-red-400" />;
  return <AlertCircle className="w-4 h-4 text-yellow-400" />;
}

export default function QualityPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  const [data, setData] = useState<QualityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metricsOpen, setMetricsOpen] = useState(false);

  const fetchQualityData = useCallback(async () => {
    try {
      const response = await fetch(`/api/case/${caseId}/quality`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/app");
          return;
        }
        throw new Error("Failed to fetch quality data");
      }
      const qualityData = await response.json();
      setData(qualityData);
    } catch (error) {
      toast.error("Failed to load quality data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [caseId, router]);

  useEffect(() => {
    fetchQualityData();
  }, [fetchQualityData]);

  if (isLoading) {
    return <QualitySkeleton />;
  }

  if (!data) {
    return null;
  }

  const { runs, aggregates, promptVersions } = data;
  const opikProjectUrl = process.env.NEXT_PUBLIC_OPIK_PROJECT_URL || "https://www.comet.com/opik";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href={`/case/${caseId}`}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Case
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Quality Metrics</h1>
        <p className="text-muted-foreground mt-2">
          LLM evaluation results and performance data for this case
        </p>
      </div>

      {/* Aggregate Scores */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className={`border ${getScoreBg(aggregates.avgActionability)}`}>
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center justify-between mb-2">
              <ClipboardList className="w-5 h-5 text-blue-400" />
              <Badge variant="outline" className="text-xs">1-5</Badge>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(aggregates.avgActionability)}`}>
              {aggregates.avgActionability?.toFixed(1) ?? "—"}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Avg Actionability</p>
          </CardContent>
        </Card>
        <Card className={`border ${getScoreBg(aggregates.avgFeasibility)}`}>
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center justify-between mb-2">
              <LineChart className="w-5 h-5 text-green-400" />
              <Badge variant="outline" className="text-xs">1-5</Badge>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(aggregates.avgFeasibility)}`}>
              {aggregates.avgFeasibility?.toFixed(1) ?? "—"}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Avg Feasibility</p>
          </CardContent>
        </Card>
        <Card className={`border ${getScoreBg(aggregates.avgEmpathyTone)}`}>
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <Badge variant="outline" className="text-xs">1-5</Badge>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(aggregates.avgEmpathyTone)}`}>
              {aggregates.avgEmpathyTone?.toFixed(1) ?? "—"}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Avg Empathy Tone</p>
          </CardContent>
        </Card>
        <Card className={`border ${aggregates.safetyPassRate !== null && aggregates.safetyPassRate >= 0.9 ? "bg-green-500/10 border-green-500/20" : "bg-yellow-500/10 border-yellow-500/20"}`}>
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-red-400" />
              <Badge variant="outline" className="text-xs">pass/fail</Badge>
            </div>
            <div className={`text-3xl font-bold ${aggregates.safetyPassRate !== null && aggregates.safetyPassRate >= 0.9 ? "text-green-400" : "text-yellow-400"}`}>
              {aggregates.safetyPassRate !== null ? `${(aggregates.safetyPassRate * 100).toFixed(0)}%` : "—"}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Safety Pass Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Explanation Collapsible */}
      <Collapsible open={metricsOpen} onOpenChange={setMetricsOpen}>
        <Card className="border-border/40">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">What these metrics mean</CardTitle>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${metricsOpen ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardList className="w-4 h-4 text-blue-400" />
                    <h4 className="font-medium text-sm">Actionability (1-5)</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Are the actions specific and executable? Higher scores mean clearer, more concrete steps.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                  <div className="flex items-center gap-2 mb-2">
                    <LineChart className="w-4 h-4 text-green-400" />
                    <h4 className="font-medium text-sm">Feasibility (1-5)</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Can the plan be completed within stated constraints? Considers time, budget, and energy.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h4 className="font-medium text-sm">Empathy Tone (1-5)</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Is the language supportive and caring? Measures compassion and acknowledgment of burden.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-red-400" />
                    <h4 className="font-medium text-sm">Safety (Pass/Fail)</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Are risks properly addressed? Checks for emergency resources and absence of harmful suggestions.
                  </p>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Prompt Version Comparison */}
      {promptVersions.length > 1 && (
        <Card className="border-border/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Prompt Versions</CardTitle>
            <CardDescription>
              Multiple prompt versions have been used for this case
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {promptVersions.map((version) => (
                <Badge key={version} variant="outline" className="font-mono text-xs px-3 py-1">
                  {version}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* LLM Runs Table */}
      <Card className="border-border/40">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">LLM Runs</CardTitle>
          <CardDescription>
            Recent pipeline executions with evaluation metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {runs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                No LLM runs recorded yet. Generate a plan to see quality metrics.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">Stage</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead className="text-right">Latency</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-center">Action.</TableHead>
                    <TableHead className="text-center">Feas.</TableHead>
                    <TableHead className="text-center">Emp.</TableHead>
                    <TableHead className="text-center">Safety</TableHead>
                    <TableHead className="pr-6 text-right">Trace</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs.map((run) => {
                    const actionability = run.evals.find((e) => e.metricName === "actionability");
                    const feasibility = run.evals.find((e) => e.metricName === "feasibility");
                    const empathy = run.evals.find((e) => e.metricName === "empathy_tone");
                    const safety = run.evals.find((e) => e.metricName === "safety");

                    return (
                      <TableRow key={run.id}>
                        <TableCell className="pl-6">
                          <Badge variant="outline" className="font-medium text-xs">
                            {run.stage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {run.promptVersion}
                          </code>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{run.model}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm tabular-nums">{run.latencyMs}ms</span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(run.createdAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-center">
                          {actionability ? (
                            <Badge className={`${getScoreBg(actionability.scoreNumber)} ${getScoreColor(actionability.scoreNumber)} border font-medium`} title={actionability.rationale}>
                              {actionability.scoreNumber?.toFixed(1) ?? "—"}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {feasibility ? (
                            <Badge className={`${getScoreBg(feasibility.scoreNumber)} ${getScoreColor(feasibility.scoreNumber)} border font-medium`} title={feasibility.rationale}>
                              {feasibility.scoreNumber?.toFixed(1) ?? "—"}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {empathy ? (
                            <Badge className={`${getScoreBg(empathy.scoreNumber)} ${getScoreColor(empathy.scoreNumber)} border font-medium`} title={empathy.rationale}>
                              {empathy.scoreNumber?.toFixed(1) ?? "—"}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {safety ? (
                            <span title={safety.rationale}>
                              {getVerdictIcon(safety.verdict)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          {run.opikTraceId ? (
                            <a
                              href={`${opikProjectUrl}/traces/${run.opikTraceId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              View
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">N/A</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Eval Details */}
      {runs.length > 0 && runs[0].evals.length > 0 && (
        <Card className="border-border/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Latest Evaluation Details</CardTitle>
            <CardDescription>
              Detailed rationales from the most recent critic stage evaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {runs[0].evals.map((evalItem) => (
                <div key={evalItem.id} className="p-4 rounded-lg bg-muted/30 border border-border/40">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium capitalize text-sm">
                      {evalItem.metricName.replace("_", " ")}
                    </h4>
                    <div className="flex items-center gap-2">
                      {evalItem.scoreNumber !== null && (
                        <Badge className={`${getScoreBg(evalItem.scoreNumber)} ${getScoreColor(evalItem.scoreNumber)} border`}>
                          {evalItem.scoreNumber.toFixed(1)}/5
                        </Badge>
                      )}
                      {evalItem.verdict && (
                        <Badge variant={evalItem.verdict === "pass" ? "default" : "destructive"} className="text-xs">
                          {evalItem.verdict}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{evalItem.rationale}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function QualitySkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6 pb-4">
              <Skeleton className="h-5 w-5 mb-2" />
              <Skeleton className="h-9 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="pb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
