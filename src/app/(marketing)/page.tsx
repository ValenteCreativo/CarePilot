import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  CalendarClock,
  Pill,
  Stethoscope,
  ShieldCheck,
  Star,
  Users,
  Bot,
  CheckCircle,
  Smartphone,
} from "lucide-react";

const valueProps = [
  {
    title: "24/7 WhatsApp support",
    description: "Ask questions anytime and get calm, actionable guidance in minutes.",
    icon: MessageSquare,
  },
  {
    title: "Smart scheduling",
    description: "Coordinate appointments, follow-ups, and reminders without the back-and-forth.",
    icon: CalendarClock,
  },
  {
    title: "Medication management",
    description: "Track meds, dosages, and refills with gentle nudges and check-ins.",
    icon: Pill,
  },
  {
    title: "Appointment coordination",
    description: "Keep providers aligned with summaries, questions, and next steps.",
    icon: Stethoscope,
  },
];

const proofItems = [
  "Trusted by caregiving families across 20+ states",
  "HIPAA-adjacent privacy practices and secure data handling",
  "Built with clinicians and experienced caregivers",
];

const howItWorksSteps = [
  {
    step: 1,
    title: "Share Your Context",
    description: "Tell CarePilot about your loved one's needs and your schedule through a simple WhatsApp conversation.",
    icon: MessageSquare,
  },
  {
    step: 2,
    title: "AI Creates Your Plan",
    description: "CarePilot analyzes your situation and generates a personalized 7-day care plan with actionable tasks.",
    icon: Bot,
  },
  {
    step: 3,
    title: "Approve & Execute",
    description: "Review proposed actions in your dashboard and approve with one tap. We handle the rest.",
    icon: CheckCircle,
  },
  {
    step: 4,
    title: "Ongoing Support",
    description: "Get 24/7 WhatsApp assistance, continuous plan adjustments, and weekly care summaries.",
    icon: Smartphone,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.22),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(14,116,144,0.18),_transparent_60%)]" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="mb-6">
              <Image
                src="/images/logos/CarePilot.jpg"
                alt="CarePilot Logo"
                width={120}
                height={120}
                priority
                className="rounded-xl shadow-lg"
              />
            </div>
            <Badge variant="secondary" className="mb-6">
              Compassionate AI support for caregivers
            </Badge>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground">
              CarePilot: Your AI Care Assistant
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
              CarePilot keeps caregiving organized through WhatsApp. Share your schedule and your loved
              one&apos;s needs, then let the agent coordinate reminders, appointments, and daily tasks so you
              can stay present.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="px-8">
                  Start Your Free Trial
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="px-8">
                  Sign in
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Privacy-first, caregiver-safe
              </span>
              <span>Subscription: ~$30/mo after trial</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {valueProps.map((item) => (
              <Card key={item.title} className="bg-card/60 border-border/40">
                <CardContent className="p-6">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple 4-step process. No complex setup, no new apps to learn.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((item) => (
              <div key={item.step} className="text-center space-y-4">
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 bg-primary/10 rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/signup">
              <Button size="lg" className="px-8">
                Start Your Free Trial
              </Button>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Set up in minutes • No credit card required
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">Subscription that respects your time</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                For about $30/month, CarePilot handles scheduling, reminders, and coordination so you stay
                on top of care without chasing every detail. Cancel anytime. No surprise fees.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge variant="outline">Free trial available</Badge>
                <Badge variant="outline">WhatsApp-native</Badge>
                <Badge variant="outline">Caregiver-friendly setup</Badge>
              </div>
            </div>
            <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-border/50">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-muted-foreground">CarePilot Plus</p>
                    <p className="text-3xl font-semibold">$30/mo</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-primary" />
                    4.9 caregiver rating
                  </div>
                </div>
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li>Unlimited WhatsApp check-ins</li>
                  <li>Medication reminders and refill tracking</li>
                  <li>Appointment coordination assistance</li>
                  <li>Weekly care summaries and insights</li>
                </ul>
                <Link href="/signup" className="block mt-8">
                  <Button className="w-full">Start Your Free Trial</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
            <Card className="bg-card/60 border-border/40">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Caregiver trust signals</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We design CarePilot to follow HIPAA-adjacent practices, limit data access, and give you
                  control over what is shared.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">Encrypted data</Badge>
                  <Badge variant="secondary">Consent-first workflows</Badge>
                  <Badge variant="secondary">Audit-ready logging</Badge>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-4">
              {proofItems.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold">Ready to lighten the load?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start your free trial and meet your CarePilot on WhatsApp in minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="px-10">
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-10">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-border/50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>CarePilot · AI Care Assistant for caregivers</span>
          <span>Not a substitute for professional medical or legal advice.</span>
        </div>
      </footer>
    </div>
  );
}
