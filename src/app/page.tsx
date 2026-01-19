import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FileText, Clock, AlertCircle } from "lucide-react";
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
      <Card className="hover:border-primary/50 transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{caseItem.title}</CardTitle>
            <div className="flex gap-2">
              {hasRisk && (
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Attention
                </Badge>
              )}
              <Badge variant={hasPlan ? "default" : "secondary"}>
                {hasPlan ? "Has Plan" : "No Plan"}
              </Badge>
            </div>
          </div>
          <CardDescription className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getSituationLabel(caseItem.lovedOneContext.situationType)}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Created {new Date(caseItem.createdAt).toLocaleDateString()}
            </span>
            {caseItem.latestPlan && (
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Plan updated {new Date(caseItem.latestPlan.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function CaseCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-24 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-48" />
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No care cases yet</h3>
        <p className="text-muted-foreground text-center mb-4 max-w-md">
          Create your first care case to get started. We&apos;ll help you build a structured plan for managing care.
        </p>
        <Link href="/case/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Care Case
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default async function Dashboard() {
  // Get or create user
  const userId = await getOrCreateUser();

  // Fetch user's cases with latest plan
  const userCases = await db.query.cases.findMany({
    where: eq(cases.userId, userId),
    orderBy: [desc(cases.createdAt)],
  });

  // Fetch latest plans for each case
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {casesWithPlans.map((caseItem) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} />
          ))}
        </div>
      )}
    </div>
  );
}

// Export loading state
export function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-5 w-60 mt-1" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CaseCardSkeleton />
        <CaseCardSkeleton />
        <CaseCardSkeleton />
      </div>
    </div>
  );
}
