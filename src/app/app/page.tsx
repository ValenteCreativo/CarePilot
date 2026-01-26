import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  FileText,
  Clock,
  AlertCircle,
  ArrowRight,
  ClipboardList,
  LineChart,
  Shield,
  Sparkles,
} from "lucide-react";
import { getOrCreateUser } from "@/lib/auth";
import { db, cases, plans } from "@/db";
import { eq, desc } from "drizzle-orm";

type CaseWithPlan = {
  id: string;
  title: string;
  lovedOneContext: {
    situationType: string;
    riskSignals?: {
      selfHarm?: boolean;
      violence?: boolean;
      urgentMedical?: boolean;
      abuse?: boolean;
    };
  };
  createdAt: Date;
  latestPlan?: { id: string; createdAt: Date } | null;
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

function hasHighRisk(riskSignals?: CaseWithPlan["lovedOneContext"]["riskSignals"]): boolean {
  if (!riskSignals) return false;
  return !!(riskSignals.selfHarm || riskSignals.violence || riskSignals.urgentMedical || riskSignals.abuse);
}

function CaseCard({ caseItem }: { caseItem: CaseWithPlan }) {
  const hasRisk = hasHighRisk(caseItem.lovedOneContext.riskSignals);
  const hasPlan = !!caseItem.latestPlan;

  return (
    <Link href={`/case/${caseItem.id}`}>
      <Card className="hover:border-primary/50 transition-all duration-200 cursor-pointer h-full hover:shadow-md hover:shadow-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight">{caseItem.title}</CardTitle>
            <div className="flex gap-1.5 flex-shrink-0">
              {hasRisk && (
                <Badge variant="destructive" className="text-xs px-2">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Attention
                </Badge>
              )}
            </div>
          </div>
          <CardDescription className="flex items-center gap-2 pt-1">
            <Badge variant="outline" className="text-xs font-medium">
              {getSituationLabel(caseItem.lovedOneContext.situationType)}
            </Badge>
            <Badge variant={hasPlan ? "default" : "secondary"} className="text-xs">
              {hasPlan ? "Has Plan" : "No Plan"}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {new Date(caseItem.createdAt).toLocaleDateString()}
            </span>
            {caseItem.latestPlan && (
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Plan: {new Date(caseItem.latestPlan.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="space-y-8">
      {/* Main Empty State Card */}
      <Card className="border-dashed border-2 bg-card/50">
        <CardContent className="flex flex-col items-center justify-center py-16 px-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">Welcome to CarePilot</h3>
          <p className="text-muted-foreground text-center mb-8 max-w-md leading-relaxed">
            Create your first care case to get started. We&apos;ll help you build a structured 7-day plan
            for managing care.
          </p>

          {/* Quick Start Steps */}
          <div className="grid md:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Describe the situation</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Type, constraints, risks</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Share your capacity</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Time, budget, energy</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Generate your plan</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Goals, actions, timeline</p>
              </div>
            </div>
          </div>

          <Link href="/case/new">
            <Button size="lg" className="px-8">
              <Plus className="w-5 h-5 mr-2" />
              Create Care Case
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* What We Evaluate Card */}
      <Card className="bg-card/50 border-border/40">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">What we evaluate with Opik</CardTitle>
          </div>
          <CardDescription>
            Every generated plan is automatically evaluated by AI judges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-4 h-4 text-primary" />
                <h4 className="font-medium text-sm">Actionability</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Are the actions specific and executable?
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
              <div className="flex items-center gap-2 mb-2">
                <LineChart className="w-4 h-4 text-primary" />
                <h4 className="font-medium text-sm">Feasibility</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Can the plan be completed within constraints?
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h4 className="font-medium text-sm">Empathy Tone</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Is the language supportive and caring?
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary" />
                <h4 className="font-medium text-sm">Safety</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Are risks properly addressed?
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/40">
            <Link
              href="/app/quality"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Learn more about quality metrics
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function Dashboard() {
  const userId = await getOrCreateUser();

  const userCases = await db.query.cases.findMany({
    where: eq(cases.userId, userId),
    orderBy: [desc(cases.createdAt)],
  });

  const casesWithPlans: CaseWithPlan[] = await Promise.all(
    userCases.map(async (caseItem) => {
      const latestPlan = await db.query.plans.findFirst({
        where: eq(plans.caseId, caseItem.id),
        orderBy: [desc(plans.createdAt)],
        columns: { id: true, createdAt: true },
      });

      return {
        id: caseItem.id,
        title: caseItem.title,
        lovedOneContext: caseItem.lovedOneContext,
        createdAt: caseItem.createdAt,
        latestPlan,
      };
    })
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your care cases and plans
          </p>
        </div>
        <Link href="/case/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Care Case
          </Button>
        </Link>
      </div>

      {casesWithPlans.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {casesWithPlans.map((caseItem) => (
              <CaseCard key={caseItem.id} caseItem={caseItem} />
            ))}
          </div>

          {/* Quick link to quality page when there are cases */}
          <Card className="bg-card/30 border-border/40">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Plans are evaluated for actionability, feasibility, empathy, and safety
                  </span>
                </div>
                <Link
                  href="/app/quality"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View quality metrics
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
