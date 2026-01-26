"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  LineChart,
  Shield,
  ArrowRight,
  Target,
  Calendar,
  CheckCircle2,
  Lock,
  Github,
  Key,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Subtle grain overlay */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                CarePilot
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                A caregiver&apos;s command center
              </p>
            </div>

            <p className="text-lg md:text-xl text-muted-foreground/80 max-w-xl mx-auto">
              Turn care into a plan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/case/new">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6">
                  Start a care case
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base px-8 py-6"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              >
                How it works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 border-border/40 backdrop-blur-sm">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Plan</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Generate structured 7-day care plans tailored to your situation, constraints, and capacity.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/40 backdrop-blur-sm">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <LineChart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Track</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Log check-ins, monitor stress levels, and track completed actions with visual progress charts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/40 backdrop-blur-sm">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trust</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every plan is evaluated by AI judges for actionability, feasibility, empathy, and safety using Opik.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to actionable care planning
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute top-8 left-[60%] hidden md:block w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
                  <span className="text-sm font-medium text-primary mb-2">Step 1</span>
                  <h3 className="text-lg font-semibold mb-2">Capture context</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Describe your loved one&apos;s situation and your capacity as a caregiver.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <Calendar className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute top-8 left-[60%] hidden md:block w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
                  <span className="text-sm font-medium text-primary mb-2">Step 2</span>
                  <h3 className="text-lg font-semibold mb-2">Generate 7-day plan</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    AI creates a structured plan with goals, actions, time estimates, and safety notes.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary mb-2">Step 3</span>
                  <h3 className="text-lg font-semibold mb-2">Check-ins + charts</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Track progress with regular check-ins and visualize trends over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Privacy */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Safety & Privacy</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Your care data stays with you. CarePilot processes information locally and never shares
              personal details with third parties. Plans include safety-focused guidance, but this tool
              is not a substitute for professional medical or legal advice.
            </p>
            <p className="text-sm text-muted-foreground/70">
              If there&apos;s immediate danger, please contact emergency services.
            </p>
          </div>
        </div>
      </section>

      {/* Open Source + BYO Key */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card/50 border-border/40">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Key className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Bring your own API key</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    CarePilot uses OpenAI or Gemini for plan generation. You provide your own API key and
                    pay the model provider directly. No markup, no hidden costs.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/40">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Github className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Open source</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The entire codebase is open source. Audit it, fork it, or contribute improvements.
                    Built with transparency for caregivers, by builders who care.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">CarePilot</span>
              <span className="text-muted-foreground text-sm">| A caregiver&apos;s command center</span>
            </div>

            <nav className="flex items-center gap-6 text-sm">
              <Link href="/app" className="text-muted-foreground hover:text-foreground transition-colors">
                Demo
              </Link>
              <a
                href="https://github.com/ValenteCreativo/CarePilot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <Link href="/app/quality" className="text-muted-foreground hover:text-foreground transition-colors">
                Quality Metrics
              </Link>
            </nav>
          </div>

          <div className="mt-8 pt-8 border-t border-border/40 text-center">
            <p className="text-xs text-muted-foreground/60">
              CarePilot is a planning tool. Always consult healthcare professionals for medical decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
