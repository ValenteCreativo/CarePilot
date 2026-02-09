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
    <Link href={`/case/${caseItem.id}`} className="block h-full">
      <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300 cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight text-[#004d6d]">{caseItem.title}</CardTitle>
            <div className="flex gap-1.5 flex-shrink-0">
              {hasRisk && (
                <Badge className="text-xs px-2 bg-[#f66] text-white">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Attention
                </Badge>
              )}
            </div>
          </div>
          <CardDescription className="flex items-center gap-2 pt-1">
            <Badge variant="outline" className="text-xs font-bold border-[#0097b2] text-[#0097b2]">
              {getSituationLabel(caseItem.lovedOneContext.situationType)}
            </Badge>
            <Badge
              className={
                hasPlan
                  ? "text-xs bg-[#0097b2] text-white"
                  : "text-xs bg-[#fff8d7] text-[#004d6d] border border-[#fff8d7]"
              }
            >
              {hasPlan ? "Has Plan" : "No Plan"}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 text-sm text-[#004d6d]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0097b2]" />
              {new Date(caseItem.createdAt).toLocaleDateString()}
            </span>
            {caseItem.latestPlan && (
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0097b2]" />
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
      <Card className="bg-white border-2 border-dashed border-[#0097b2]/30 shadow-xl">
        <CardContent className="flex flex-col items-center justify-center py-16 px-8">
          <div className="w-16 h-16 rounded-full bg-[#aee4ff]/40 border border-[#0097b2]/20 flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-[#0097b2]" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-[#004d6d]">Welcome to CarePilot</h3>
          <p className="text-[#004d6d]/90 text-center mb-8 max-w-md leading-relaxed">
            Create your first care case to get started. We&apos;ll help you build a structured 7-day plan
            for managing care.
          </p>

          <div className="grid md:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-start gap-3 p-4 rounded-lg bg-[#aee4ff]/20 border border-[#0097b2]/20">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-[#0097b2]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#0097b2]">{n}</span>
                </div>
                <div>
                  {n === 1 && (
                    <>
                      <h4 className="font-bold text-sm text-[#004d6d]">Describe the situation</h4>
                      <p className="text-xs text-[#004d6d]/80 mt-0.5">Type, constraints, risks</p>
                    </>
                  )}
                  {n === 2 && (
                    <>
                      <h4 className="font-bold text-sm text-[#004d6d]">Share your capacity</h4>
                      <p className="text-xs text-[#004d6d]/80 mt-0.5">Time, budget, energy</p>
                    </>
                  )}
                  {n === 3 && (
                    <>
                      <h4 className="font-bold text-sm text-[#004d6d]">Generate your plan</h4>
                      <p className="text-xs text-[#004d6d]/80 mt-0.5">Goals, actions, timeline</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Link href="/case/new">
            <Button size="lg" className="px-8 bg-[#f66] hover:bg-[#f66]/90 text-white font-bold shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Care Case
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0097b2]" />
            <CardTitle className="text-lg text-[#004d6d]">What we evaluate with Opik</CardTitle>
          </div>
          <CardDescription className="text-[#004d6d]/90">
            Every generated plan is automatically evaluated by AI judges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-[#aee4ff]/20 border border-[#0097b2]/20">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-4 h-4 text-[#0097b2]" />
                <h4 className="font-bold text-sm text-[#004d6d]">Actionability</h4>
              </div>
              <p className="text-xs text-[#004d6d]/80">Are the actions specific and executable?</p>
            </div>
            <div className="p-4 rounded-lg bg-[#aee4ff]/20 border border-[#0097b2]/20">
              <div className="flex items-center gap-2 mb-2">
                <LineChart className="w-4 h-4 text-[#0097b2]" />
                <h4 className="font-bold text-sm text-[#004d6d]">Feasibility</h4>
              </div>
              <p className="text-xs text-[#004d6d]/80">Can the plan be completed within constraints?</p>
            </div>
            <div className="p-4 rounded-lg bg-[#aee4ff]/20 border border-[#0097b2]/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#0097b2]" />
                <h4 className="font-bold text-sm text-[#004d6d]">Empathy Tone</h4>
              </div>
              <p className="text-xs text-[#004d6d]/80">Is the language supportive and caring?</p>
            </div>
            <div className="p-4 rounded-lg bg-[#aee4ff]/20 border border-[#0097b2]/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#0097b2]" />
                <h4 className="font-bold text-sm text-[#004d6d]">Safety</h4>
              </div>
              <p className="text-xs text-[#004d6d]/80">Are risks properly addressed?</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#0097b2]/20">
            <Link href="/app/quality" className="text-sm font-bold text-[#0097b2] hover:underline flex items-center gap-1">
              Learn more about quality metrics
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function CasesPage() {
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#004d6d]">Cases</h1>
          <p className="text-[#004d6d]/90 mt-2 text-lg">Manage your care cases and plans.</p>
        </div>
        <Link href="/case/new">
          <Button className="bg-[#f66] hover:bg-[#f66]/90 text-white font-bold shadow-lg">
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

          <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl">
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#0097b2]" />
                  <span className="text-sm text-[#004d6d]/90 font-medium">
                    Plans are evaluated for actionability, feasibility, empathy, and safety
                  </span>
                </div>
                <Link href="/app/quality" className="text-sm font-bold text-[#0097b2] hover:underline flex items-center gap-1">
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
