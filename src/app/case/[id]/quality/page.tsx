"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
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

  const fetchQualityData = useCallback(async () => {
    try {
      const response = await fetch(`/api/case/${caseId}/quality`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/");
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/case/${caseId}`}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Case
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Quality Metrics</h1>
        <p className="text-muted-foreground mt-1">
          LLM evaluation results and performance data
        </p>
      </div>

      {/* Aggregate Scores */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className={`text-2xl font-bold ${getScoreColor(aggregates.avgActionability)}`}>
              {aggregates.avgActionability?.toFixed(1) ?? "—"}
            </div>
            <p className="text-sm text-muted-foreground">Avg Actionability</p>
            <p className="text-xs text-muted-foreground mt-1">(1-5 scale)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className={`text-2xl font-bold ${getScoreColor(aggregates.avgFeasibility)}`}>
              {aggregates.avgFeasibility?.toFixed(1) ?? "—"}
            </div>
            <p className="text-sm text-muted-foreground">Avg Feasibility</p>
            <p className="text-xs text-muted-foreground mt-1">(1-5 scale)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className={`text-2xl font-bold ${getScoreColor(aggregates.avgEmpathyTone)}`}>
              {aggregates.avgEmpathyTone?.toFixed(1) ?? "—"}
            </div>
            <p className="text-sm text-muted-foreground">Avg Empathy Tone</p>
            <p className="text-xs text-muted-foreground mt-1">(1-5 scale)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className={`text-2xl font-bold ${aggregates.safetyPassRate !== null && aggregates.safetyPassRate >= 0.9 ? "text-green-400" : "text-yellow-400"}`}>
              {aggregates.safetyPassRate !== null ? `${(aggregates.safetyPassRate * 100).toFixed(0)}%` : "—"}
            </div>
            <p className="text-sm text-muted-foreground">Safety Pass Rate</p>
            <p className="text-xs text-muted-foreground mt-1">(pass/fail)</p>
          </CardContent>
        </Card>
      </div>

      {/* Prompt Version Comparison */}
      {promptVersions.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Prompt Versions</CardTitle>
            <CardDescription>
              Multiple prompt versions have been used for this case
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {promptVersions.map((version) => (
                <Badge key={version} variant="outline">
                  {version}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* LLM Runs Table */}
      <Card>
        <CardHeader>
          <CardTitle>LLM Runs</CardTitle>
          <CardDescription>
            Recent pipeline executions with evaluation metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {runs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No LLM runs recorded yet. Generate a plan to see quality metrics.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stage</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actionability</TableHead>
                  <TableHead>Feasibility</TableHead>
                  <TableHead>Empathy</TableHead>
                  <TableHead>Safety</TableHead>
                  <TableHead>Opik</TableHead>
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
                      <TableCell>
                        <Badge variant="outline">{run.stage}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{run.promptVersion}</TableCell>
                      <TableCell className="text-sm">{run.model}</TableCell>
                      <TableCell>{run.latencyMs}ms</TableCell>
                      <TableCell className="text-sm">
                        {new Date(run.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {actionability ? (
                          <span className={getScoreColor(actionability.scoreNumber)} title={actionability.rationale}>
                            {actionability.scoreNumber?.toFixed(1) ?? "—"}
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        {feasibility ? (
                          <span className={getScoreColor(feasibility.scoreNumber)} title={feasibility.rationale}>
                            {feasibility.scoreNumber?.toFixed(1) ?? "—"}
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        {empathy ? (
                          <span className={getScoreColor(empathy.scoreNumber)} title={empathy.rationale}>
                            {empathy.scoreNumber?.toFixed(1) ?? "—"}
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        {safety ? (
                          <span title={safety.rationale}>
                            {getVerdictIcon(safety.verdict)}
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        {run.opikTraceId ? (
                          <a
                            href={`${opikProjectUrl}/traces/${run.opikTraceId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
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
          )}
        </CardContent>
      </Card>

      {/* Eval Details */}
      {runs.length > 0 && runs[0].evals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Evaluation Details</CardTitle>
            <CardDescription>
              Detailed rationales from the most recent critic stage evaluation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {runs[0].evals.map((evalItem) => (
              <div key={evalItem.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">{evalItem.metricName.replace("_", " ")}</h4>
                  <div className="flex items-center gap-2">
                    {evalItem.scoreNumber !== null && (
                      <Badge className={getScoreColor(evalItem.scoreNumber)}>
                        {evalItem.scoreNumber.toFixed(1)}/5
                      </Badge>
                    )}
                    {evalItem.verdict && (
                      <Badge variant={evalItem.verdict === "pass" ? "default" : "destructive"}>
                        {evalItem.verdict}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{evalItem.rationale}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function QualitySkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-64 mt-1" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
