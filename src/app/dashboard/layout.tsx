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
    <div className="min-h-screen bg-[#aee4ff]">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-64 flex-col border-r-4 border-[#fff8d7] bg-white shadow-xl">
          <div className="px-6 py-6 border-b-2 border-[#fff8d7]">
            <Link href="/" className="text-2xl font-bold tracking-tight text-[#004d6d]">
              CarePilot
            </Link>
            <p className="text-xs text-[#0097b2] mt-1 font-medium">Your AI Care Assistant</p>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#004d6d] hover:bg-[#fff8d7] hover:shadow-md transition-all duration-200"
              >
                <item.icon className="h-5 w-5 text-[#0097b2]" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-6 border-t-2 border-[#fff8d7]">
            <SignOutButton />
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="lg:hidden border-b-2 border-[#fff8d7] bg-white shadow-md">
            <div className="flex items-center justify-between px-4 py-4">
              <Link href="/" className="text-lg font-bold text-[#004d6d]">
                CarePilot
              </Link>
              <div className="flex gap-3">
                {navItems.slice(0, 2).map((item) => (
                  <Link key={item.href} href={item.href} className="text-xs text-[#004d6d] font-medium">
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
