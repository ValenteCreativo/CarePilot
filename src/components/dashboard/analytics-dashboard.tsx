"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type AnalyticsPayload = {
  messageVolume: Array<{ date: string; count: number }>;
  completionRate: number;
  avgResponseMinutes: number;
};

const emptyAnalytics: AnalyticsPayload = {
  messageVolume: [],
  completionRate: 0,
  avgResponseMinutes: 0,
};

export function AnalyticsDashboard({ initialData }: { initialData?: AnalyticsPayload }) {
  const [data, setData] = useState<AnalyticsPayload>(initialData ?? emptyAnalytics);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    let active = true;
    setLoading(true);
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((payload) => {
        if (active) {
          setData(payload);
        }
      })
      .catch(() => {
        if (active) {
          setData(emptyAnalytics);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [initialData]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#0097b2] font-bold">Action Completion Rate</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-[#004d6d]">{data.completionRate}%</CardContent>
        </Card>
        <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#0097b2] font-bold">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-[#004d6d]">
            {data.avgResponseMinutes}m
          </CardContent>
        </Card>
        <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#0097b2] font-bold">Data Freshness</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[#004d6d] font-semibold">
            {loading ? "Refreshing..." : "Updated just now"}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-[#004d6d] flex items-center gap-2">
            <span className="text-[#0097b2]">📊</span> Message Volume
          </CardTitle>
          <Badge variant="secondary" className="bg-[#0097b2] text-white">Last 7 days</Badge>
        </CardHeader>
        <CardContent className="h-64">
          {data.messageVolume.length === 0 ? (
            <div className="h-full flex items-center justify-center bg-[#aee4ff]/20 rounded-lg border-2 border-dashed border-[#0097b2]/30">
              <p className="text-sm text-[#004d6d] font-semibold">No message data yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.messageVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0097b2" opacity={0.2} />
                <XAxis dataKey="date" stroke="#004d6d" fontSize={12} fontWeight="600" />
                <YAxis stroke="#004d6d" fontSize={12} fontWeight="600" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    borderColor: "#0097b2",
                    color: "#004d6d",
                    fontWeight: "600",
                    borderWidth: "2px",
                  }}
                />
                <Line type="monotone" dataKey="count" stroke="#0097b2" strokeWidth={3} dot={{ fill: "#f66", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
