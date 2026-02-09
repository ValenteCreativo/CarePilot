import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/signout-button";
import {
  LayoutGrid,
  KanbanSquare,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Actions", href: "/dashboard/actions", icon: KanbanSquare },
  { label: "WhatsApp Config", href: "/dashboard/whatsapp", icon: MessageSquare },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-background/80 backdrop-blur">
          <div className="px-6 py-6 border-b border-border/40">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              CarePilot
            </Link>
            <p className="text-xs text-[#004d6d]/90 mt-1">Caregiver AI workspace</p>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#004d6d]/90 hover:text-[#004d6d] hover:bg-muted/40 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-6 border-t border-border/40">
            <SignOutButton />
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="lg:hidden border-b border-border/50 bg-background/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4">
              <Link href="/" className="text-lg font-semibold">
                CarePilot
              </Link>
              <div className="flex gap-2">
                {navItems.slice(0, 2).map((item) => (
                  <Link key={item.href} href={item.href} className="text-xs text-[#004d6d]/90">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 py-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
