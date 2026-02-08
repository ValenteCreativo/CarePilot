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
        <Card className="bg-background/80 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Action completion rate</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{data.completionRate}%</CardContent>
        </Card>
        <Card className="bg-background/80 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg response time</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {data.avgResponseMinutes}m
          </CardContent>
        </Card>
        <Card className="bg-background/80 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Data freshness</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {loading ? "Refreshing..." : "Updated just now"}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background/80 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Message volume</CardTitle>
          <Badge variant="secondary">Last 7 days</Badge>
        </CardHeader>
        <CardContent className="h-64">
          {data.messageVolume.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              No message data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.messageVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
