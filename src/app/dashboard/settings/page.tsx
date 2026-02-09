import { db } from "@/db";
import { getCurrentUserId } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteAccountButton } from "@/components/dashboard/settings-client";

export default async function SettingsPage() {
  const userId = await getCurrentUserId();
  let user:
    | {
        name: string | null;
        email: string | null;
        phoneNumber: string | null;
        createdAt: Date;
      }
    | null = null;

  if (userId) {
    try {
      const found = await db.query.users.findFirst({
        columns: {
          name: true,
          email: true,
          phoneNumber: true,
          createdAt: true,
        },
        where: (userRow, { eq }) => eq(userRow.id, userId),
      });
      user = found ?? null;
    } catch (error) {
      console.error("Settings error:", error);
    }
  }

  const subscriptionStatus = "Trial";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-[#004d6d]">Settings</h1>
        <p className="text-[#004d6d]/90 text-lg">
          Update your profile, review subscription status, and manage account options.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-[#004d6d] flex items-center gap-2">
              <span className="text-[#0097b2]">👤</span> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[#aee4ff]/20 p-4 rounded-lg border border-[#0097b2]/20">
              <p className="text-xs uppercase text-[#0097b2] font-bold mb-1">Name</p>
              <p className="text-[#004d6d] font-semibold">{user?.name ?? "Not set"}</p>
            </div>
            <div className="bg-[#aee4ff]/20 p-4 rounded-lg border border-[#0097b2]/20">
              <p className="text-xs uppercase text-[#0097b2] font-bold mb-1">Email</p>
              <p className="text-[#004d6d] font-semibold">{user?.email ?? "Not set"}</p>
            </div>
            <div className="bg-[#aee4ff]/20 p-4 rounded-lg border border-[#0097b2]/20">
              <p className="text-xs uppercase text-[#0097b2] font-bold mb-1">WhatsApp number</p>
              <p className="text-[#004d6d] font-semibold">{user?.phoneNumber ?? "Not set"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-[#004d6d] flex items-center gap-2">
              <span className="text-[#0097b2]">💳</span> Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#fff8d7]/30 rounded-lg border border-[#fff8d7]">
              <span className="text-[#004d6d] font-semibold">Status</span>
              <Badge variant="secondary" className="bg-[#0097b2] text-white">{subscriptionStatus}</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#aee4ff]/20 rounded-lg border border-[#0097b2]/20">
              <span className="text-[#004d6d] font-semibold">Plan</span>
              <span className="text-[#0097b2] font-bold">CarePilot Plus</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#aee4ff]/20 rounded-lg border border-[#0097b2]/20">
              <span className="text-[#004d6d] font-semibold">Started</span>
              <span className="text-[#004d6d] font-semibold">
                {user?.createdAt ? user.createdAt.toLocaleDateString() : "Not available"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg text-[#004d6d] flex items-center gap-2">
            <span className="text-[#0097b2]">💰</span> Billing
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[#004d6d] bg-[#fff8d7]/30 p-6 rounded-lg border border-[#fff8d7]">
          <p className="font-semibold">Stripe billing management coming soon.</p>
          <p className="text-[#004d6d]/90 mt-2">We&apos;ll notify you before any charges start.</p>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#f66]/50 shadow-xl hover:border-[#f66] transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg text-[#f66] flex items-center gap-2">
            ⚠️ Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm bg-[#f66]/10 p-6 rounded-lg border border-[#f66]/30">
          <p className="text-[#004d6d] font-semibold">Delete your account and remove all CarePilot data permanently.</p>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  );
}
