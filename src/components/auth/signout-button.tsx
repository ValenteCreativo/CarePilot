"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut} disabled={isPending}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign out
    </Button>
  );
}
