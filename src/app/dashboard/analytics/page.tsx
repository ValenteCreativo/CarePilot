import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const opikUrl = process.env.OPIK_DASHBOARD_URL ?? null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-[#004d6d]">Analytics</h1>
        <p className="text-[#004d6d]/90 text-lg">
          Track response quality, action throughput, and caregiver communication trends.
        </p>
      </div>

      <div className="bg-white border-2 border-[#0097b2]/30 rounded-xl shadow-xl p-6">
        <AnalyticsDashboard />
      </div>

      <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-[#004d6d]">
            <span className="text-[#0097b2]">📊</span> Opik Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-[#004d6d]/90">
          {opikUrl ? (
            <iframe
              title="Opik Dashboard"
              src={opikUrl}
              className="w-full h-[420px] rounded-lg border-2 border-[#0097b2]/20"
            />
          ) : (
            <div className="rounded-lg border-2 border-dashed border-[#fff8d7] bg-[#fff8d7]/20 p-8 text-center">
              <p className="text-[#004d6d] font-semibold">
                Add <code className="bg-[#aee4ff] px-2 py-1 rounded text-xs">OPIK_DASHBOARD_URL</code> to embed your live tracing dashboard here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
