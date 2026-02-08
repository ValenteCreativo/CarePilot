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
} from "lucide-react";

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
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      {/* STATIC LAYER: Medical Cross */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <Image
          src="/images/logos/cross.png"
          alt="Medical cross"
          width={80}
          height={80}
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
          src="/images/logos/otters.png"
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
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="mb-6">
              <ScrollRotatingLogo />
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
            
            {/* WhatsApp Interface Demo */}
            <div className="mt-12 mb-12 relative group">
              <div className="max-w-2xl mx-auto">
                <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgb(0,151,178,0.15)] hover:shadow-[0_25px_70px_rgb(0,151,178,0.2)] transition-all duration-500">
                  <Image
                    src="/images/Whatsapp-Interfaz.png"
                    alt="CarePilot WhatsApp interface showing AI assistant interaction"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                  {/* Glass overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#aee4ff]/10 to-transparent pointer-events-none rounded-[2rem]" />
                </div>
              </div>
            </div>
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
                      <div className="absolute inset-0 bg-[#aee4ff]/60 backdrop-blur-sm rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] border border-white/30 shadow-lg" style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}/>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#aee4ff] to-[#7dd3fc] rounded-full shadow-inner" style={{ clipPath: 'ellipse(48% 55% at 50% 45%)' }}/>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <persona.icon className="h-7 w-7 text-[#0097b2] drop-shadow-sm" strokeWidth={1.5}/>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-display text-[#007a8f] mb-4 leading-tight tracking-tight text-center">
                    {persona.title}
                  </h3>

                  <p className="text-[#006b7d] font-sans leading-relaxed text-sm text-center" style={{ lineHeight: '1.75' }}>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative" id="how-it-works-grid">
            {/* Curved Connection Lines - Cadena de Apoyo */}
            <svg className="hidden lg:block absolute top-1/2 left-0 w-full h-32 -translate-y-16 pointer-events-none" style={{ zIndex: 1 }}>
              {/* Curved line from card 1 to card 2 */}
              <path d="M 22% 50% Q 30% 20%, 38% 50%" fill="none" stroke="#0097b2" strokeWidth="2" strokeDasharray="8,6" opacity="0.2" strokeLinecap="round"/>
              {/* Curved line from card 2 to card 3 */}
              <path d="M 47% 50% Q 55% 80%, 63% 50%" fill="none" stroke="#0097b2" strokeWidth="2" strokeDasharray="8,6" opacity="0.2" strokeLinecap="round"/>
              {/* Curved line from card 3 to card 4 */}
              <path d="M 72% 50% Q 80% 20%, 88% 50%" fill="none" stroke="#0097b2" strokeWidth="2" strokeDasharray="8,6" opacity="0.2" strokeLinecap="round"/>
            </svg>

            {howItWorksSteps.map((item, index) => (
              <div key={item.step} className="relative group how-it-works-card" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="bg-[#fff8d7]/90 backdrop-blur-md p-8 rounded-[2.5rem] border-2 border-primary/20 shadow-[0_8px_30px_rgb(0,151,178,0.12)] hover:backdrop-blur-xl hover:-translate-y-3 hover:shadow-[0_16px_50px_rgb(0,151,178,0.2)] transition-all duration-500 ease-out h-full z-10 relative">
                  {/* Organic Step Badge - Mancha de agua/piedra de río */}
                  <span className="absolute -top-3 -left-3 w-11 h-11 flex items-center justify-center font-display text-lg z-20 how-it-works-badge">
                    <svg viewBox="0 0 44 44" className="absolute inset-0 w-full h-full">
                      <path d="M22 2C28 2 38 8 38 22C38 36 28 42 22 42C16 42 6 36 6 22C6 8 16 2 22 2Z" fill="#FF0000" fillOpacity="0.9"/>
                      <path d="M22 5C27 5 35 10 35 22C35 34 27 39 22 39C17 39 9 34 9 22C9 10 17 5 22 5Z" fill="#FF3333" fillOpacity="0.6"/>
                    </svg>
                    <span className="relative z-10 text-white font-bold">{item.step}</span>
                  </span>

                  {/* Icon Container - Forma de gota con glassmorphism */}
                  <div className="mb-8 relative">
                    <div className="w-20 h-20 mx-auto relative">
                      {/* Glassmorphism background */}
                      <div className="absolute inset-0 bg-[#aee4ff]/60 backdrop-blur-sm rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] border border-white/30 shadow-lg" style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}/>
                      {/* Drop shape overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#aee4ff] to-[#7dd3fc] rounded-full shadow-inner" style={{ clipPath: 'ellipse(48% 55% at 50% 45%)' }}/>
                      {/* Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <item.icon className="h-8 w-8 text-[#0097b2] drop-shadow-sm" strokeWidth={1.5}/>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-display text-[#007a8f] mb-4 leading-tight tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-[#006b7d] font-sans leading-relaxed text-sm" style={{ lineHeight: '1.75' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <style jsx>{`
            .how-it-works-card {
              opacity: 0;
              transform: translateY(20px);
              animation: otterFloatIn 0.6s ease-out forwards;
            }
            
            @keyframes otterFloatIn {
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .how-it-works-badge {
              filter: drop-shadow(0 2px 4px rgba(255, 0, 0, 0.3));
              transition: transform 0.3s ease;
            }
            
            .how-it-works-card:hover .how-it-works-badge {
              transform: scale(1.05) rotate(-3deg);
            }
          `}</style>

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

      {/* Why CarePilot is Different - AI Agent Differentiators */}
      <section className="py-24 border-t border-border/50 bg-[#aee4ff]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-foreground mb-6">
              Why CarePilot is Different
            </h2>
            <p className="text-lg text-foreground/90 max-w-2xl mx-auto font-sans">
              This isn't a chatbot with a calendar. It's an AI Agent built for the chaos of real caregiving.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {differentiators.map((item, index) => (
              <div key={item.title} className="relative group differentiator-card" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="bg-[#fff8d7]/90 backdrop-blur-md p-8 rounded-[2.5rem] border-2 border-primary/20 shadow-[0_8px_30px_rgb(0,151,178,0.12)] hover:backdrop-blur-xl hover:-translate-y-2 hover:shadow-[0_16px_40px_rgb(0,151,178,0.18)] hover:rotate-1 transition-all duration-500 ease-out h-full">
                  {/* Icon Container - Teardrop with glassmorphism */}
                  <div className="mb-6 relative">
                    <div className="w-16 h-16 relative">
                      <div className="absolute inset-0 bg-[#aee4ff]/60 backdrop-blur-sm rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] border border-white/30 shadow-lg" style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}/>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#aee4ff] to-[#7dd3fc] rounded-full shadow-inner" style={{ clipPath: 'ellipse(48% 55% at 50% 45%)' }}/>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-[#0097b2] drop-shadow-sm" strokeWidth={1.5}/>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-display text-[#007a8f] mb-3 leading-tight tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-[#006b7d] font-sans leading-relaxed text-sm" style={{ lineHeight: '1.7' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <style jsx>{`
            .differentiator-card {
              opacity: 0;
              transform: translateY(20px);
              animation: differentiatorFloatIn 0.6s ease-out forwards;
            }
            
            @keyframes differentiatorFloatIn {
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#007a8f]/10 rounded-full border border-[#007a8f]/20">
              <span className="text-sm font-semibold text-[#007a8f]">Built for Hackathon 2026</span>
              <span className="text-[#007a8f]/40">|</span>
              <span className="text-sm text-[#006b7d]">Evaluated with Opik</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stack - 5 Pillars of Trust */}
      <section className="py-24 border-t border-border/50 bg-[#fff8d7]/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-foreground mb-6">
              Trust Stack
            </h2>
            <p className="text-lg text-foreground/90 max-w-2xl mx-auto font-sans">
              Built on transparency, control, and real-world caregiving experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {trustStackItems.map((item, index) => (
              <div key={item.title} className="relative group trust-card" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="bg-[#fff8d7]/90 backdrop-blur-md p-8 rounded-[2.5rem] border-2 border-primary/20 shadow-[0_8px_30px_rgb(0,151,178,0.12)] hover:backdrop-blur-xl hover:-translate-y-2 hover:shadow-[0_16px_40px_rgb(0,151,178,0.18)] hover:rotate-1 transition-all duration-500 ease-out h-full">
                  {/* Icon Container - Teardrop with glassmorphism */}
                  <div className="mb-6 relative">
                    <div className="w-16 h-16 relative">
                      <div className="absolute inset-0 bg-[#aee4ff]/60 backdrop-blur-sm border border-white/30 shadow-lg" style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}/>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#aee4ff] to-[#7dd3fc] shadow-inner" style={{ clipPath: 'ellipse(48% 55% at 50% 45%)' }}/>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-[#0097b2] drop-shadow-sm" strokeWidth={1.5}/>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-display text-[#007a8f] mb-3 leading-tight tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-[#006b7d] font-sans leading-relaxed text-sm" style={{ lineHeight: '1.7' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <style jsx>{`
            .trust-card {
              opacity: 0;
              transform: translateY(20px);
              animation: trustFloatIn 0.6s ease-out forwards;
            }
            
            @keyframes trustFloatIn {
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      </section>

      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-display text-foreground leading-tight">
                A plan that respects your peace of mind
              </h2>
              <p className="text-foreground/90 text-lg leading-relaxed font-sans max-w-xl">
                For about $30/month, CarePilot handles the complexity of coordination so you can focus on what matters most: being present for your loved one.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="border-foreground/30 text-foreground bg-foreground/5 px-4 py-1 rounded-full">Free trial included</Badge>
                <Badge variant="outline" className="border-foreground/30 text-foreground bg-foreground/5 px-4 py-1 rounded-full">WhatsApp-native</Badge>
                <Badge variant="outline" className="border-foreground/30 text-foreground bg-foreground/5 px-4 py-1 rounded-full">Human-centered AI</Badge>
              </div>
            </div>

            <Card className="bg-[#fff8d7]/90 backdrop-blur-lg border-2 border-primary/30 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,151,178,0.12)] overflow-hidden hover:backdrop-blur-xl hover:shadow-[0_12px_40px_rgb(0,151,178,0.16)] transition-all duration-300">
              <CardContent className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#007a8f] font-semibold mb-1">CarePilot Plus</p>
                    <p className="text-4xl font-display text-[#007a8f]">$30<span className="text-xl">/mo</span></p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-[#007a8f]">
                      <Star className="h-4 w-4 fill-[#007a8f]" />
                      <span className="font-bold">4.9</span>
                    </div>
                    <span className="text-[10px] text-[#006b7d] uppercase font-bold">Caregiver rating</span>
                  </div>
                </div>

                <ul className="text-sm text-[#006b7d] space-y-4 font-sans list-none">
                  {["Unlimited WhatsApp coordination", "Medication tracking & proactive refills", "Appointment organization assistance", "Weekly insights & care summaries"].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-[#007a8f]/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-3 w-3 text-[#007a8f]" />
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
                <p className="text-center mt-4 text-xs text-[#006b7d]">Cancel anytime. No hidden fees.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-border/50 bg-[#fff8d7]/20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-16 items-start">
            <div className="bg-[#fff8d7] p-10 rounded-[2.5rem] border-2 border-[#007a8f]/20 shadow-sm">
              <h3 className="text-2xl font-display text-[#007a8f] mb-4">Built on trust</h3>
              <p className="text-[#006b7d] font-sans leading-relaxed mb-6">
                We design CarePilot with privacy at the core. Your data is encrypted, access is limited, and you always maintain full control.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-[#007a8f]/10 text-[#007a8f] border-none">Encrypted data</Badge>
                <Badge variant="secondary" className="bg-[#007a8f]/10 text-[#007a8f] border-none">Consent-first</Badge>
                <Badge variant="secondary" className="bg-[#007a8f]/10 text-[#007a8f] border-none">Audit-ready</Badge>
              </div>
            </div>

            <div className="grid gap-6">
              {proofItems.map((item) => (
                <div key={item} className="flex items-start gap-4 p-4 rounded-2xl transition-colors hover:bg-white/10">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-white/90 font-sans leading-relaxed pt-1">{item}</p>
                </div>
              ))}
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
