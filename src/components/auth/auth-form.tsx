"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const isSignup = mode === "signup";

  const handleChange = (field: keyof typeof formState) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const payload = isSignup
        ? {
          name: formState.name,
          phone: formState.phone,
          email: formState.email,
          password: formState.password,
        }
        : {
          email: formState.email,
          password: formState.password,
        };

      const response = await fetch(isSignup ? "/api/signup" : "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: "Request failed" }));
        toast.error(data.message ?? "Something went wrong");
        return;
      }

      toast.success(isSignup ? "Welcome to CarePilot!" : "Welcome back!");
      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <Card className="bg-card/70 backdrop-blur-md border border-white/20 shadow-xl hover:bg-card/75 transition-all duration-300">
      <CardHeader className="pt-8">
        <CardTitle className="text-3xl font-parisienne text-primary text-center">
          {isSignup ? "Start your free trial" : "Welcome back"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium opacity-70">Full name</Label>
                <Input
                  id="name"
                  placeholder="Jordan Lee"
                  value={formState.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-medium opacity-70">WhatsApp number</Label>
                <Input
                  id="phone"
                  placeholder="+1 555 123 4567"
                  value={formState.phone}
                  onChange={handleChange("phone")}
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium opacity-70">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@carepilot.com"
              value={formState.email}
              onChange={handleChange("email")}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium opacity-70">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formState.password}
              onChange={handleChange("password")}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white font-ultra rounded-full py-6 text-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20"
            disabled={isPending}
          >
            {isSignup ? "Create account" : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <Link href={isSignup ? "/login" : "/signup"} className="text-primary hover:underline">
            {isSignup ? "Sign in" : "Start free trial"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
