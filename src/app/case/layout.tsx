import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function CaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight">CarePilot</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              <Link href="/dashboard/cases">
                <Button variant="ghost" size="sm" className="text-[#004d6d] hover:bg-[#fff8d7] hover:text-[#004d6d]">
                  <Home className="w-4 h-4 mr-1.5 text-[#0097b2]" />
                  Cases
                </Button>
              </Link>
            </nav>
          </div>
          <Link href="/case/new">
            <Button size="sm">New Case</Button>
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
}
