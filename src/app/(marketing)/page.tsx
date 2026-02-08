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
    title: "24/7 Support in your pocket",
    description: "Ask questions anytime. Get clear, calm guidance in minutes, not hours.",
    icon: MessageSquare,
  },
  {
    title: "Your schedule, under control",
    description: "Forget the back-and-forth of calls. We manage your appointments and prep without you losing track.",
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
    title: "Tell Us Your Story",
    description: "Share your loved one's context and your routine through WhatsApp. It's the beginning of our support network.",
    icon: MessageSquare,
  },
  {
    step: 2,
    title: "Your Guide Prepares the Plan",
    description: "Your Otter Guide designs a 7-day plan tailored to your work and their specific needs.",
    icon: Bot,
  },
  {
    step: 3,
    title: "You Decide, We Act",
    description: "With one tap, you authorize tasks. We handle reminders, scheduling, and coordination.",
    icon: CheckCircle,
  },
  {
    step: 4,
    title: "Rest with Peace of Mind",
    description: "24/7 WhatsApp assistance. You'll never care alone again; reclaim your time and peace.",
    icon: Smartphone,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,151,178,0.22),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,151,178,0.18),_transparent_60%)]" />
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
              CarePilot: Caring is hard. Don't do it alone.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
              CarePilot organizes the chaos of care through WhatsApp. Share your routine and your loved one&apos;s needs; we handle the reminders, appointments, and daily tasks so you can simply be present.
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

      <section className="py-24 border-t border-border/50 bg-[#aee4ff]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-primary mb-6">How It Works</h2>
            <p className="text-lg text-primary/80 max-w-2xl mx-auto font-sans">
              Get started in minutes with a process designed to give you peace. No complex setups, everything happens where you already are: WhatsApp.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            {/* Decorative Connection Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-primary/20 -translate-y-8" />

            {howItWorksSteps.map((item) => (
              <div key={item.step} className="relative group">
                <div className="bg-[#fff8d7] p-8 rounded-[2.5rem] border-2 border-primary/10 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,151,178,0.08)] transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,151,178,0.12)] hover:-translate-y-1 h-full z-10 relative">
                  {/* Step Badge */}
                  <span className="absolute -top-4 -left-4 w-12 h-12 bg-[#FF0000] text-white rounded-full flex items-center justify-center font-display text-xl shadow-lg z-20">
                    {item.step}
                  </span>

                  {/* Icon Container */}
                  <div className="mb-8 p-5 bg-[#aee4ff] rounded-2xl text-primary shadow-inner">
                    <item.icon className="h-8 w-8" />
                  </div>

                  <h3 className="text-xl font-display text-primary mb-4 leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-primary/70 font-sans leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link href="/signup">
              <Button size="lg" className="px-10 py-7 text-lg rounded-2xl shadow-xl hover:scale-105 transition-transform">
                Start Your Free Trial
              </Button>
            </Link>
            <p className="mt-4 text-sm text-primary/60 font-sans">
              Set up in 3 minutes • No credit card required
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-display text-primary leading-tight">
                A plan that respects your peace of mind
              </h2>
              <p className="text-primary/80 text-lg leading-relaxed font-sans max-w-xl">
                For about $30/month, CarePilot handles the complexity of coordination so you can focus on what matters most: being present for your loved one.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 px-4 py-1 rounded-full">Free trial included</Badge>
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 px-4 py-1 rounded-full">WhatsApp-native</Badge>
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 px-4 py-1 rounded-full">Human-centered AI</Badge>
              </div>
            </div>

            <Card className="bg-[#fff8d7] border-2 border-primary/10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,151,178,0.08)] overflow-hidden">
              <CardContent className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-primary/60 font-semibold mb-1">CarePilot Plus</p>
                    <p className="text-4xl font-display text-primary">$30<span className="text-xl">/mo</span></p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="h-4 w-4 fill-primary" />
                      <span className="font-bold">4.9</span>
                    </div>
                    <span className="text-[10px] text-primary/60 uppercase font-bold">Caregiver rating</span>
                  </div>
                </div>

                <ul className="text-sm text-primary/80 space-y-4 font-sans list-none">
                  {["Unlimited WhatsApp coordination", "Medication tracking & proactive refills", "Appointment organization assistance", "Weekly insights & care summaries"].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="block mt-10">
                  <Button className="w-full py-7 text-lg rounded-2xl shadow-lg hover:scale-[1.02] transition-transform">
                    Start Your Free Trial
                  </Button>
                </Link>
                <p className="text-center mt-4 text-xs text-primary/50">Cancel anytime. No hidden fees.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-border/50 bg-[#fff8d7]/20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-16 items-start">
            <div className="bg-[#fff8d7] p-10 rounded-[2.5rem] border-2 border-primary/10 shadow-sm">
              <h3 className="text-2xl font-display text-primary mb-4">Built on trust</h3>
              <p className="text-primary/70 font-sans leading-relaxed mb-6">
                We design CarePilot with privacy at the core. Your data is encrypted, access is limited, and you always maintain full control.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Encrypted data</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Consent-first</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Audit-ready</Badge>
              </div>
            </div>

            <div className="grid gap-6">
              {proofItems.map((item) => (
                <div key={item} className="flex items-start gap-4 p-4 rounded-2xl transition-colors hover:bg-primary/5">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-primary/80 font-sans leading-relaxed pt-1">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-border/50 bg-[#aee4ff]/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-display text-primary mb-6">Ready to lighten the load?</h2>
          <p className="mt-4 text-xl text-primary/70 font-sans max-w-2xl mx-auto">
            Join thousands of families finding their peace with CarePilot. Meet your assistant on WhatsApp today.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup">
              <Button size="lg" className="px-12 py-8 text-xl rounded-2xl shadow-xl hover:scale-105 transition-transform">
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-12 py-8 text-xl rounded-2xl border-2 border-primary/20 text-primary hover:bg-primary/5">
                Sign in
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-sm text-primary/50">Setup takes less than 3 minutes.</p>
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
