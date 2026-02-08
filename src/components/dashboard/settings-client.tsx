"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DeleteAccountButton() {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      toast.error("Account deletion is a protected action. Please contact support.");
    });
  };

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
      Delete account
    </Button>
  );
}
