import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const opikUrl = process.env.OPIK_DASHBOARD_URL ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track response quality, action throughput, and caregiver communication trends.
        </p>
      </div>

      <AnalyticsDashboard />

      <Card className="bg-background/80 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Opik dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          {opikUrl ? (
            <iframe
              title="Opik Dashboard"
              src={opikUrl}
              className="w-full h-[420px] rounded-lg border border-border/40"
            />
          ) : (
            <div className="rounded-lg border border-dashed border-border/60 p-6 text-center">
              Add `OPIK_DASHBOARD_URL` to embed your live tracing dashboard here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
