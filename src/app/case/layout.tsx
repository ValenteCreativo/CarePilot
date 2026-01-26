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
              <Link href="/app">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Home className="w-4 h-4 mr-1.5" />
                  Dashboard
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
