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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Update your profile, review subscription status, and manage account options.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-background/80 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="text-xs uppercase">Name</p>
              <p className="text-foreground">{user?.name ?? "Not set"}</p>
            </div>
            <div>
              <p className="text-xs uppercase">Email</p>
              <p className="text-foreground">{user?.email ?? "Not set"}</p>
            </div>
            <div>
              <p className="text-xs uppercase">WhatsApp number</p>
              <p className="text-foreground">{user?.phoneNumber ?? "Not set"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <Badge variant="secondary">{subscriptionStatus}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Plan</span>
              <span className="text-foreground">CarePilot Plus</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Started</span>
              <span className="text-foreground">
                {user?.createdAt ? user.createdAt.toLocaleDateString() : "Not available"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background/80 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Billing</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Stripe billing management coming soon. We&apos;ll notify you before any charges start.
        </CardContent>
      </Card>

      <Card className="bg-background/80 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Danger zone</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-muted-foreground">
          <p>Delete your account and remove all CarePilot data permanently.</p>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  );
}
