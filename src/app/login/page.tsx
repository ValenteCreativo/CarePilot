import Link from "next/link";
import Image from "next/image";
import { AuthForm } from "@/components/auth/auth-form";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,151,178,0.18),_transparent_55%)]" />
      <div className="relative w-full max-w-4xl grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div className="space-y-6 text-muted-foreground">
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Back to home
          </Link>
          <div className="mb-2">
            <Image
              src="/images/logos/CarePilot.jpg"
              alt="CarePilot Logo"
              width={80}
              height={80}
              priority
              className="rounded-xl shadow-lg"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
            Keep caregiving aligned, one message at a time.
          </h1>
          <p className="text-base leading-relaxed">
            Sign in to review action queues, check WhatsApp activity, and keep care plans moving forward.
          </p>
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck className="h-4 w-4 text-primary" />
            HIPAA-adjacent security practices
          </div>
        </div>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
