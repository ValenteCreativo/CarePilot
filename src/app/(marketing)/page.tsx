"use client";

import { useState, useEffect } from "react";
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
  Sparkles,
  Lock,
  FileText,
  HeartHandshake,
  Activity,
  Briefcase,
  ClipboardList,
  Clock,
  Shield,
} from "lucide-react";

import crossImage from "@/assets/cross.png";
import ottersImage from "@/assets/otters.png";

function ScrollRotatingLogo() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 0.5 degrees per pixel of scroll
      setRotation(window.scrollY * 0.5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-48 h-48 md:w-56 md:h-56">
      {/* STATIC LAYER: Medical Cross */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <Image
          src={crossImage}
          alt="Medical cross"
          width={120}
          height={120}
          className="object-contain"
          style={{ width: "55%", height: "55%" }}
        />
      </div>
      {/* DYNAMIC LAYER: Otters Ring */}
      <div
        className="absolute inset-0 pointer-events-none logo-rotate"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <Image
          src={ottersImage}
          fill
          alt="Otters"
          className="object-contain"
        />
      </div>
    </div>
  );
}

const caregiverPersonas = [
  {
    title: "The Double Shift",
    description: "You balance a high-performance career with the demanding reality of full-time caregiving.",
    icon: Briefcase,
  },
  {
    title: "The Logistics Lead",
    description: "You manage the complex web of medications, appointments, and health records.",
    icon: ClipboardList,
  },
  {
    title: "The 24/7 Mindset",
    description: "You feel like you're permanently 'on call,' even when you're officially off the clock.",
    icon: Clock,
  },
];

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

const differentiators = [
  {
    title: "Not just reminders. A care agent that thinks ahead.",
    description: "Unlike simple alarm apps, CarePilot anticipates needs before they become crises. It tracks patterns, predicts conflicts, and surfaces what matters—before you even ask.",
    icon: Sparkles,
  },
  {
    title: "Understands context, not just commands",
    description: "Tell it 'Mom seems agitated after lunch' and it connects the dots: medication timing, sleep quality, recent appointments. No need to spell everything out.",
    icon: Bot,
  },
  {
    title: "Proposes actions — you stay in control",
    description: "CarePilot suggests: 'Shall I reschedule pharmacy pickup to Thursday?' You approve with a tap. It executes. You're always the decision-maker, never a task-juggler.",
    icon: CheckCircle,
  },
  {
    title: "Learns from your feedback",
    description: "Every 'yes', 'no', or 'not now' refines how it helps you. The more you use it, the more it feels like a partner who actually knows your routine.",
    icon: ShieldCheck,
  },
];

const trustStackItems = [
  {
    title: "Built for real care situations",
    description: "Designed from actual caregiver experiences, not theoretical scenarios. Handles medication conflicts, appointment overlaps, and emergency coordination.",
    icon: HeartHandshake,
  },
  {
    title: "Human-in-the-loop approval",
    description: "AI suggests, you decide. Every action requires your explicit approval. No automatic changes without your consent.",
    icon: Users,
  },
  {
    title: "Full audit trail",
    description: "Every suggestion, reminder, and coordination is logged. Complete transparency of what was proposed, when, and your response.",
    icon: FileText,
  },
  {
    title: "Privacy-first by design",
    description: "End-to-end encryption. Minimal data collection. You control what's shared and can delete anything, anytime.",
    icon: Lock,
  },
  {
    title: "Not a medical replacement",
    description: "Augments professional care, never replaces it. Works alongside doctors, nurses, and healthcare providers.",
    icon: Activity,
  },
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
        <div className="container mx-auto px-4 py-16 md:py-32 relative">
          <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-center">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-6">
                Compassionate AI support for caregivers
              </Badge>
              <h1 className="text-3xl md:text-6xl font-semibold tracking-tight text-foreground">
                CarePilot: Caring is hard. Don't do it alone.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                CarePilot organizes the chaos of care through WhatsApp. Share your routine and your loved one&apos;s needs; we handle the reminders, appointments, and daily tasks so you can simply be present.
              </p>

              {/* Video Demo Container */}
              <div className="mt-12 mb-12 relative group">
                <div className="flex justify-center mb-4">
                  <Badge variant="outline" className="bg-[#0097b2]/5 text-[#0097b2] border-[#0097b2]/20 px-4 py-1.5 text-sm font-medium rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF0000] animate-pulse" />
                    Watch CarePilot in Action
                  </Badge>
                </div>
                <div className="max-w-4xl mx-auto">
                  <div className="relative rounded-[2rem] overflow-hidden border-4 border-[#fff8d7] shadow-[0_20px_60px_rgb(0,151,178,0.15)] hover:shadow-[0_30px_80px_rgb(0,151,178,0.25)] transition-all duration-500 bg-black/5 aspect-video group cursor-pointer">
                    {/* Video Placeholder (using existing image as cover) */}
                    <Image
                      src="/images/Whatsapp-Interfaz.png"
                      alt="CarePilot Demo Video"
                      fill
                      className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="w-20 h-20 bg-[#fff8d7]/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-[#0097b2] border-b-[12px] border-b-transparent ml-1" />
                      </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0097b2]/20 to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto px-8">
                    Start Your Free Trial
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
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

            {/* Logo Column */}
            <div className="flex justify-center lg:justify-end">
              <ScrollRotatingLogo />
            </div>
          </div>
        </div>
      </section>

      {/* CarePilot is for you if - Caregiver Personas */}
      <section className="py-16 border-t border-border/50 bg-[#aee4ff]/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">CarePilot is for you if:</h2>
            <p className="text-lg text-foreground/90 max-w-2xl mx-auto font-sans">
              Recognize yourself in these stories? You're not alone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {caregiverPersonas.map((persona, index) => (
              <div key={persona.title} className="relative group persona-card" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="bg-[#fff8d7]/90 backdrop-blur-md p-8 rounded-[2.5rem] border-2 border-primary/20 shadow-[0_8px_30px_rgb(0,151,178,0.12)] hover:backdrop-blur-xl hover:-translate-y-2 hover:shadow-[0_16px_40px_rgb(0,151,178,0.18)] hover:rotate-1 transition-all duration-500 ease-out h-full">
                  {/* Icon Container */}
                  <div className="mb-6 relative">
                    <div className="w-16 h-16 mx-auto relative">
                      <div className="absolute inset-0 bg-[#aee4ff]/60 backdrop-blur-sm rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] border border-white/30 shadow-lg" style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }} />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#aee4ff] to-[#0097b2]/30 rounded-full shadow-inner" style={{ clipPath: 'ellipse(48% 55% at 50% 45%)' }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <persona.icon className="h-7 w-7 text-[#0097b2] drop-shadow-sm" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-display text-[#0097b2] mb-4 leading-tight tracking-tight text-center">
                    {persona.title}
                  </h3>

                  <p className="text-[#0097b2]/80 font-sans leading-relaxed text-sm text-center" style={{ lineHeight: '1.75' }}>
                    {persona.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <style jsx>{`
            .persona-card {
              opacity: 0;
              transform: translateY(20px);
              animation: personaFloatIn 0.6s ease-out forwards;
            }
            
            @keyframes personaFloatIn {
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

          <div className="mt-12 text-center">
            <p className="text-sm text-primary/60 font-sans">
              If any of these resonate, you're in the right place.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {valueProps.map((item) => (
              <Card key={item.title} className="bg-card/90 backdrop-blur-md border border-primary/20 shadow-lg hover:bg-card hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="h-11 w-11 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-foreground/90 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-border/50 bg-[#aee4ff]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-foreground mb-6">How It Works</h2>
            <p className="text-lg text-foreground/90 max-w-2xl mx-auto font-sans">
              Get started in minutes with a process designed to give you peace. No complex setups, everything happens where you already are: WhatsApp.
            </p>
          </div>

          {/* Zig-Zag Layout */}
          <div className="max-w-5xl mx-auto flex flex-col gap-24 relative">
            {/* Extended Central Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#0097b2]/30 to-transparent -translate-x-1/2 hidden md:block" />

            {howItWorksSteps.map((item, index) => (
              <div key={item.step} className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 relative group ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>

                {/* Visual Side (Icon/Card) */}
                <div className="w-full md:w-1/2 flex justify-center z-10">
                  <div className="relative w-64 h-64 md:w-72 md:h-72">
                    <div className="absolute inset-0 bg-[#fff8d7]/80 backdrop-blur-xl rounded-[3rem] rotate-3 group-hover:rotate-6 transition-transform duration-500 shadow-2xl border border-[#0097b2]/10" />
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-[3rem] -rotate-3 group-hover:-rotate-6 transition-transform duration-500 shadow-lg" />

                    <div className="absolute inset-4 bg-gradient-to-br from-[#aee4ff]/30 to-[#0097b2]/5 rounded-[2.5rem] flex items-center justify-center border border-white/50">
                      <div className="relative w-32 h-32 transform group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-[#0097b2]/10 blur-2xl rounded-full" />
                        <item.icon className="w-full h-full text-[#0097b2] drop-shadow-md relative z-10 opacity-90" strokeWidth={1} />
                      </div>
                    </div>

                    {/* Step Badge */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#FF0000] text-[#fff8d7] rounded-full flex items-center justify-center font-display text-2xl font-bold shadow-lg border-4 border-[#fff8d7]">
                      {item.step}
                    </div>
                  </div>
                </div>

                {/* Text Side */}
                <div className="w-full md:w-1/2 text-center md:text-left z-10">
                  <h3 className="text-3xl md:text-4xl font-display text-[#0097b2] mb-6 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-lg text-[#0097b2]/80 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

              </div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <Link href="/signup">
              <Button size="lg" className="px-10 py-7 text-lg rounded-2xl shadow-xl hover:scale-105 transition-transform">
                Start Your Free Trial
              </Button>
            </Link>
            <p className="mt-4 text-sm text-[#0097b2]/60 font-sans">
              Set up in 3 minutes • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Why CarePilot is Different - Feature Section */}
      <section className="py-24 border-t border-[#0097b2]/10 bg-[#fff8d7]/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_0.8fr] gap-12 items-center">

            {/* Left: 3D Phone Image (Placeholder) */}
            <div className="relative h-[600px] w-full flex items-center justify-center order-2 lg:order-1 group">
              {/* Decorative background blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#aee4ff]/40 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#0097b2]/10 rounded-full blur-2xl animate-pulse" />

              {/* Phone Mockup Frame */}
              <div className="relative w-[300px] h-[580px] bg-black rounded-[3rem] border-8 border-gray-900 shadow-2xl z-10 transform lg:-rotate-6 transition-transform duration-700 hover:rotate-0 hover:scale-105">
                {/* Screen Content */}
                <div className="absolute inset-0 bg-[#aee4ff] overflow-hidden rounded-[2.5rem]">
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0097b2]/20 to-transparent z-10" />
                  {/* Chat UI Mockup */}
                  <div className="p-6 pt-16 space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0097b2] flex items-center justify-center text-white text-xs">AI</div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs text-[#0097b2]">
                        Hi, I noticed you have a meeting at 3 PM today. Should I move your dad's medication reminder to earlier?
                      </div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="bg-[#0097b2] text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-xs">
                        Yes please, move it to 2:30 PM.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0097b2] flex items-center justify-center text-white text-xs">AI</div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs text-[#0097b2]">
                        Done. Scheduled for 2:30 PM.
                      </div>
                    </div>
                  </div>
                </div>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-2xl z-20" />
              </div>
            </div>

            {/* Right: Content */}
            <div className="order-1 lg:order-2">
              <div className="mb-10">
                <Badge variant="outline" className="border-[#0097b2]/20 text-[#0097b2] bg-[#0097b2]/5 mb-4 px-4 py-1">
                  Beyond Simple Reminders
                </Badge>
                <h2 className="text-4xl md:text-5xl font-display text-[#0097b2] mb-6 leading-tight">
                  Why CarePilot is Different
                </h2>
                <p className="text-lg text-[#0097b2]/80 font-sans leading-relaxed">
                  This isn't a chatbot with a calendar. It's an AI Agent built for the chaos of real caregiving.
                </p>
              </div>

              <div className="space-y-8">
                {differentiators.map((item, index) => (
                  <div key={item.title} className="flex gap-5 group">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-2xl bg-[#fff8d7] border border-[#0097b2]/20 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="h-6 w-6 text-[#0097b2]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-display text-[#0097b2] mb-2">{item.title}</h3>
                      <p className="text-[#0097b2]/70 font-sans leading-relaxed text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#0097b2]/5 rounded-full border border-[#0097b2]/10">
                  <span className="text-sm font-semibold text-[#0097b2]">Built for Hackathon 2026</span>
                  <span className="text-[#0097b2]/20">|</span>
                  <span className="text-sm text-[#0097b2]/80">Evaluated with Opik</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Safe, Secure, and Trusted - Consolidated Section */}
      <section className="py-24 border-t border-[#0097b2]/10 bg-[#aee4ff]/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display text-[#0097b2] mb-6">
              Safe, Secure, and Trusted
            </h2>
            <p className="text-lg text-[#0097b2]/80 max-w-2xl mx-auto font-sans">
              Built on transparency, control, and real-world caregiving experience.
            </p>
          </div>

          <div className="flex flex-col items-center gap-10 mb-16">
            {/* 3D Shield Icon */}
            <div className="relative w-40 h-40 group cursor-pointer">
              <div className="absolute inset-0 bg-[#0097b2]/20 rounded-full blur-2xl transform translate-y-4 group-hover:translate-y-6 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#fff8d7] to-[#aee4ff] backdrop-blur-md rounded-[2.5rem] border-4 border-white shadow-[0_20px_50px_rgba(0,151,178,0.3)] flex items-center justify-center transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-500">
                <ShieldCheck className="h-20 w-20 text-[#0097b2] drop-shadow-md" strokeWidth={1.5} />

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white p-2 rounded-xl shadow-lg animate-bounce duration-[3000ms]">
                  <Lock className="h-6 w-6 text-[#FF0000]" />
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-6">
              <Badge variant="secondary" className="bg-white/60 backdrop-blur-sm text-[#0097b2] border border-[#0097b2]/20 px-6 py-2.5 text-base rounded-full shadow-sm hover:scale-105 transition-transform">
                <Shield className="w-4 h-4 mr-2 text-[#0097b2]" />
                HIPAA-Adjacent Privacy
              </Badge>
              <Badge variant="secondary" className="bg-white/60 backdrop-blur-sm text-[#0097b2] border border-[#0097b2]/20 px-6 py-2.5 text-base rounded-full shadow-sm hover:scale-105 transition-transform">
                <Lock className="w-4 h-4 mr-2 text-[#0097b2]" />
                End-to-End Encrypted
              </Badge>
              <Badge variant="secondary" className="bg-white/60 backdrop-blur-sm text-[#0097b2] border border-[#0097b2]/20 px-6 py-2.5 text-base rounded-full shadow-sm hover:scale-105 transition-transform">
                <HeartHandshake className="w-4 h-4 mr-2 text-[#0097b2]" />
                Built by Clinicians
              </Badge>
            </div>
          </div>

          {/* 3 Key Trust Pillars */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: "Human-in-the-loop", desc: "No AI action happens without your explicit approval.", icon: Users },
              { title: "Full Audit Trail", desc: "See everything the agent proposes and executes.", icon: FileText },
              { title: "Data Ownership", desc: "Delete your data anytime. It's yours, not ours.", icon: CheckCircle }
            ].map((item, i) => (
              <div key={i} className="bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-[#0097b2]/10 text-center hover:bg-white/80 transition-colors">
                <div className="w-12 h-12 bg-[#0097b2]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0097b2]">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-display text-[#0097b2] mb-2">{item.title}</h3>
                <p className="text-[#0097b2]/80 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Centered Card */}
      <section className="py-24 border-t border-[#0097b2]/10 bg-[#fff8d7]/20">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-display text-[#0097b2] mb-6 leading-tight">
              One plan to help you sleep peacefully again
            </h2>
            <p className="text-lg text-[#0097b2]/80 mb-10 font-sans">
              Simple pricing. No hidden fees. Cancel anytime.
            </p>

            <div className="relative transform hover:scale-105 transition-transform duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#aee4ff] via-[#0097b2] to-[#aee4ff] rounded-[2.6rem] blur opacity-30 animate-pulse" />
              <Card className="relative bg-white border-2 border-[#0097b2]/20 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-4 z-10">
                  <Badge className="bg-[#FF0000] text-white hover:bg-[#FF0000]/90 border-none px-4 py-1 text-xs font-bold uppercase tracking-wider shadow-lg transform rotate-3">
                    Popular Choice
                  </Badge>
                </div>
                <CardContent className="p-8 md:p-10">
                  <div className="text-center mb-8">
                    <p className="text-sm uppercase tracking-widest text-[#0097b2] font-bold mb-2">CarePilot Plus</p>
                    <div className="flex items-baseline justify-center gap-1 text-[#0097b2]">
                      <span className="text-6xl font-display">$30</span>
                      <span className="text-2xl font-medium text-[#0097b2]/60">/mo</span>
                    </div>
                    <p className="mt-2 text-xs text-[#0097b2]/60 font-medium">7-day free trial included</p>
                  </div>

                  <ul className="space-y-4 mb-8 text-left max-w-sm mx-auto">
                    {["Unlimited WhatsApp coordination", "Medication tracking & proactive refills", "Appointment organization assistance", "Weekly insights & care summaries"].map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-[#0097b2]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-[#0097b2]" />
                        </div>
                        <span className="text-[#0097b2]/80 text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/signup" className="block">
                    <Button className="w-full py-7 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all bg-[#0097b2] hover:bg-[#0097b2]/90 text-white hover:scale-[1.02]">
                      Start Your Free Trial
                    </Button>
                  </Link>
                  <p className="mt-4 text-xs text-[#0097b2]/50 font-medium">No credit card required for trial</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 flex justify-center gap-4 text-sm text-[#0097b2]/60">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Cancel anytime</span>
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Secure payment</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-border/50 bg-[#aee4ff]/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-display text-foreground mb-6">Ready to lighten the load?</h2>
          <p className="mt-4 text-xl text-foreground/90 font-sans max-w-2xl mx-auto">
            Join thousands of families finding their peace with CarePilot. Meet your assistant on WhatsApp today.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup">
              <Button size="lg" className="px-12 py-8 text-xl rounded-2xl shadow-xl hover:scale-105 transition-transform">
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-12 py-8 text-xl rounded-2xl border-2 border-foreground/30 text-foreground hover:bg-foreground/5">
                Sign in
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-sm text-foreground/50">Setup takes less than 3 minutes.</p>
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
