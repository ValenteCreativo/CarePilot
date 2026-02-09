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
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="text-lg flex items-center gap-2 text-[#004d6d]">
            <span className="text-[#0097b2]">📊</span> Opik Dashboard
          </CardTitle>
          {opikUrl ? (
            <a
              href={opikUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-[#0097b2] hover:underline"
            >
              Open in new tab
            </a>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-[#004d6d]/90">
          {opikUrl ? (
            <div className="space-y-3">
              <p className="text-xs text-[#004d6d]/90">
                If the embed doesn&apos;t load (some dashboards block iframes), use the link above.
              </p>
              <iframe
                title="Opik Dashboard"
                src={opikUrl}
                className="w-full h-[520px] rounded-lg border-2 border-[#0097b2]/20 bg-white"
              />
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-[#fff8d7] bg-[#fff8d7]/20 p-8 text-center">
              <p className="text-[#004d6d] font-semibold">
                Add <code className="bg-[#aee4ff] px-2 py-1 rounded text-xs">OPIK_DASHBOARD_URL</code> to embed your Opik dashboard here.
              </p>
              <p className="text-xs text-[#004d6d]/90 mt-2">
                You&apos;ll need to set it both locally (<code className="bg-white px-1 rounded">.env.local</code>) and in Vercel Environment Variables for Production.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
