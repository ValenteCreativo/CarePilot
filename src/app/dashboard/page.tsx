import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db, actions, cases, messages } from "@/db";
import { and, eq, desc, gte } from "drizzle-orm";
import { MessageSquare, Plus, Send, ClipboardCheck } from "lucide-react";
import { getCurrentUserId } from "@/lib/auth";

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export default async function DashboardOverviewPage() {
  const userId = await getCurrentUserId();
  const today = startOfDay(new Date());

  let activeCases = 0;
  let pendingActions = 0;
  let messagesToday = 0;
  let recentMessages: Array<{ id: string; direction: string; body: string; createdAt: Date }> = [];

  if (userId) {
    try {
      const caseRows = await db.select().from(cases).where(eq(cases.userId, userId));
      activeCases = caseRows.length;

      const actionRows = await db
        .select()
        .from(actions)
        .leftJoin(cases, eq(actions.caseId, cases.id))
        .where(eq(cases.userId, userId));
      pendingActions = actionRows.filter((row) => row.actions.status === "pending").length;

      const messageRows = await db
        .select()
        .from(messages)
        .where(eq(messages.userId, userId))
        .orderBy(desc(messages.createdAt))
        .limit(8);

      recentMessages = messageRows.map((row) => ({
        id: row.id,
        direction: row.direction,
        body: row.body,
        createdAt: row.createdAt,
      }));

      const todayMessages = await db
        .select()
        .from(messages)
        .where(and(eq(messages.userId, userId), gte(messages.createdAt, today)));
      messagesToday = todayMessages.length;
    } catch (error) {
      console.error("Dashboard overview error:", error);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#004d6d]">Overview</h1>
          <p className="text-[#004d6d]/90 mt-2 text-lg">
            Keep a pulse on today&apos;s care coordination and WhatsApp activity.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/case/new">
            <Button className="bg-[#f66] hover:bg-[#f66]/90 text-white font-bold shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </Link>
          <Link href="/dashboard/whatsapp">
            <Button className="bg-[#fff8d7] hover:bg-[#fff8d7]/90 text-[#004d6d] font-bold border-2 border-[#0097b2]/20">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#0097b2] font-bold">Active cases</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {activeCases === 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Looks like you don't have a support network yet.</p>
                <p className="text-sm text-[#0097b2] font-bold">Would you like us to meet who you're caring for?</p>
                <Link href="/case/new">
                  <Button size="sm" className="mt-2">Start my first case</Button>
                </Link>
              </div>
            ) : (
              activeCases
            )}
          </CardContent>
        </Card>
        <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#0097b2] font-bold">Pending actions</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {pendingActions === 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Everything's under control for now.</p>
                <p className="text-sm text-[#0097b2] font-bold">Take a breath, your Otter Guide will let you know if anything changes.</p>
              </div>
            ) : (
              pendingActions
            )}
          </CardContent>
        </Card>
        <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#0097b2] font-bold">Messages today</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{messagesToday}</CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#0097b2]" />
              Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMessages.length === 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Your conversation hasn't started yet.</p>
                <p className="text-sm text-[#0097b2] font-bold">Your Otter Guide is ready when you are.</p>
              </div>
            ) : (
              recentMessages.map((message) => (
                <div key={message.id} className="rounded-lg border border-border/50 p-4">
                  <div className="flex items-center justify-between text-xs text-[#004d6d]/90 mb-2">
                    <span>{message.direction === "inbound" ? "Inbound" : "Outbound"}</span>
                    <span>{message.createdAt.toLocaleString()}</span>
                  </div>
                  <p className="text-sm">{message.body}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-[#0097b2]" />
              Quick actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-[#0097b2] font-bold">
            <div className="rounded-lg border border-border/40 p-4">
              <p className="font-medium text-[#004d6d]">New case intake</p>
              <p className="mt-1">Capture medical context, caregiver schedule, and priorities.</p>
              <Link href="/case/new">
                <Button size="sm" className="mt-3">Start case</Button>
              </Link>
            </div>
            <div className="rounded-lg border border-border/40 p-4">
              <p className="font-medium text-[#004d6d]">WhatsApp check-in</p>
              <p className="mt-1">Send a quick update or test message to the caregiver.</p>
              <Link href="/dashboard/whatsapp">
                <Button size="sm" variant="outline" className="mt-3">Open WhatsApp config</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
