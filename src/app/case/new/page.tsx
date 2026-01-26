"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Loader2,
  Heart,
  Brain,
  Pill,
  Scale,
  Gavel,
  HelpCircle,
  Activity,
  Home,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Zap,
  Ban,
  Check,
} from "lucide-react";
import { toast } from "sonner";

const situationTypes = [
  { value: "recovery", label: "Recovery", description: "Post-surgery, illness, or injury recovery", icon: Activity },
  { value: "elder_care", label: "Elder Care", description: "Supporting aging family members", icon: Heart },
  { value: "mental_health", label: "Mental Health", description: "Managing mental health conditions", icon: Brain },
  { value: "addiction", label: "Addiction", description: "Supporting recovery from addiction", icon: Pill },
  { value: "debt", label: "Debt", description: "Financial stress and debt management", icon: DollarSign },
  { value: "legal", label: "Legal", description: "Legal matters and proceedings", icon: Gavel },
  { value: "other", label: "Other", description: "Other care situations", icon: HelpCircle },
];

const distanceOptions = [
  { value: "same_home", label: "Same Home", description: "Living together", icon: Home },
  { value: "same_city", label: "Same City", description: "Within driving distance", icon: MapPin },
  { value: "remote", label: "Remote", description: "Different city or long distance", icon: MapPin },
];

const supportOptions = [
  { value: "alone", label: "Alone", description: "No other helpers available" },
  { value: "some_help", label: "Some Help", description: "Occasional support from others" },
  { value: "team", label: "Team", description: "Regular coordinated support" },
];

const constraintItems = [
  { key: "mobility" as const, label: "Mobility assistance needed", icon: Activity },
  { key: "medsChecklist" as const, label: "Medication tracking needed", icon: Pill },
  { key: "dietNeeded" as const, label: "Special diet requirements", icon: Heart },
  { key: "appointments" as const, label: "Appointment coordination", icon: Clock },
];

const riskItems = [
  { key: "selfHarm" as const, label: "Self-harm concerns" },
  { key: "violence" as const, label: "Violence concerns" },
  { key: "urgentMedical" as const, label: "Urgent medical needs" },
  { key: "abuse" as const, label: "Abuse concerns" },
];

type FormData = {
  title: string;
  situationType: string;
  summary: string;
  constraints: {
    mobility: boolean;
    medsChecklist: boolean;
    dietNeeded: boolean;
    appointments: boolean;
  };
  riskSignals: {
    selfHarm: boolean;
    violence: boolean;
    urgentMedical: boolean;
    abuse: boolean;
  };
  timePerWeek: number;
  budgetPerWeekUsd: number;
  distance: string;
  energyLevel: number;
  supportNetwork: string;
  hardLimits: string;
};

const initialFormData: FormData = {
  title: "",
  situationType: "",
  summary: "",
  constraints: {
    mobility: false,
    medsChecklist: false,
    dietNeeded: false,
    appointments: false,
  },
  riskSignals: {
    selfHarm: false,
    violence: false,
    urgentMedical: false,
    abuse: false,
  },
  timePerWeek: 10,
  budgetPerWeekUsd: 100,
  distance: "",
  energyLevel: 3,
  supportNetwork: "",
  hardLimits: "",
};

export default function NewCasePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasRiskSignals = Object.values(formData.riskSignals).some(Boolean);

  const validateStep1 = () => {
    if (!formData.title.trim()) {
      toast.error("Please provide a title for this case");
      return false;
    }
    if (!formData.situationType) {
      toast.error("Please select a situation type");
      return false;
    }
    if (!formData.summary.trim()) {
      toast.error("Please provide a summary");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.distance) {
      toast.error("Please select your distance from the loved one");
      return false;
    }
    if (!formData.supportNetwork) {
      toast.error("Please select your support network situation");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          lovedOneContext: {
            situationType: formData.situationType,
            summary: formData.summary,
            constraints: formData.constraints,
            riskSignals: formData.riskSignals,
          },
          caregiverContext: {
            timePerWeek: formData.timePerWeek,
            budgetPerWeekUsd: formData.budgetPerWeekUsd,
            distance: formData.distance,
            energyLevel: formData.energyLevel,
            supportNetwork: formData.supportNetwork,
            hardLimits: formData.hardLimits,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create case");
      }

      const { id } = await response.json();
      toast.success("Case created successfully");
      router.push(`/case/${id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create case");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Care Case</h1>
        <p className="text-muted-foreground mt-1">
          We&apos;ll help you build a structured plan for managing care.
        </p>
      </div>

      {/* Enhanced Stepper */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {/* Step 1 */}
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= 1
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground/30 text-muted-foreground"
              }`}
            >
              {step > 1 ? <Check className="w-5 h-5" /> : <span className="font-semibold">1</span>}
            </div>
            <div className="hidden sm:block">
              <p className={`text-sm font-medium ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
                Step 1
              </p>
              <p className="text-xs text-muted-foreground">About the situation</p>
            </div>
          </div>

          {/* Connector */}
          <div className="flex-1 mx-4">
            <div className={`h-0.5 rounded-full transition-all ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="hidden sm:block text-right">
              <p className={`text-sm font-medium ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                Step 2
              </p>
              <p className="text-xs text-muted-foreground">About you as caregiver</p>
            </div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= 2
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground/30 text-muted-foreground"
              }`}
            >
              <span className="font-semibold">2</span>
            </div>
          </div>
        </div>
      </div>

      {step === 1 ? (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Loved One Context
            </CardTitle>
            <CardDescription>
              Describe the care situation at a high level. Avoid including personally identifiable information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Case Title</Label>
              <Input
                id="title"
                placeholder="e.g., Mom's Recovery Plan, Dad's Elder Care"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-background"
              />
            </div>

            {/* Situation Type */}
            <div className="space-y-3">
              <Label>Situation Type</Label>
              <RadioGroup
                value={formData.situationType}
                onValueChange={(value) => setFormData({ ...formData, situationType: value })}
                className="grid grid-cols-2 gap-3"
              >
                {situationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.value}>
                      <RadioGroupItem
                        value={type.value}
                        id={type.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={type.value}
                        className="flex items-start gap-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                      >
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <span className="font-medium">{type.label}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                placeholder="Brief description of the situation and main challenges..."
                rows={4}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="bg-background resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Keep this general to protect privacy.
              </p>
            </div>

            <Separator />

            {/* Constraints */}
            <div className="space-y-3">
              <Label>Care Constraints (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3">
                {constraintItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.key}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                        formData.constraints[item.key]
                          ? "border-primary/50 bg-primary/5"
                          : "border-border/40 hover:border-border"
                      }`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          constraints: { ...formData.constraints, [item.key]: !formData.constraints[item.key] },
                        })
                      }
                    >
                      <Checkbox
                        id={item.key}
                        checked={formData.constraints[item.key]}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            constraints: { ...formData.constraints, [item.key]: checked === true },
                          })
                        }
                      />
                      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <Label htmlFor={item.key} className="text-sm cursor-pointer flex-1">
                        {item.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Risk Signals */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                Risk Signals (select if present)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {riskItems.map((item) => (
                  <div
                    key={item.key}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      formData.riskSignals[item.key]
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-border/40 hover:border-border"
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        riskSignals: { ...formData.riskSignals, [item.key]: !formData.riskSignals[item.key] },
                      })
                    }
                  >
                    <Checkbox
                      id={item.key}
                      checked={formData.riskSignals[item.key]}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          riskSignals: { ...formData.riskSignals, [item.key]: checked === true },
                        })
                      }
                    />
                    <Label htmlFor={item.key} className="text-sm cursor-pointer flex-1">
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
              {hasRiskSignals && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    If there&apos;s immediate danger, please contact emergency services. Our plan will include safety-focused guidance, but this tool is not a substitute for professional help.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleNext} size="lg">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Caregiver Context
            </CardTitle>
            <CardDescription>
              Tell us about your capacity and resources so we can create a realistic plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Time per week */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Time Available (hours/week)
                </Label>
                <span className="text-sm font-medium bg-muted px-3 py-1 rounded-md">
                  {formData.timePerWeek} hours
                </span>
              </div>
              <Slider
                value={[formData.timePerWeek]}
                onValueChange={([value]) => setFormData({ ...formData, timePerWeek: value })}
                min={1}
                max={60}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 hour</span>
                <span>60 hours</span>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  Budget (USD/week)
                </Label>
                <span className="text-sm font-medium bg-muted px-3 py-1 rounded-md">
                  ${formData.budgetPerWeekUsd}
                </span>
              </div>
              <Slider
                value={[formData.budgetPerWeekUsd]}
                onValueChange={([value]) => setFormData({ ...formData, budgetPerWeekUsd: value })}
                min={0}
                max={1000}
                step={25}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>$1,000</span>
              </div>
            </div>

            {/* Distance */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Distance from Loved One
              </Label>
              <RadioGroup
                value={formData.distance}
                onValueChange={(value) => setFormData({ ...formData, distance: value })}
                className="grid grid-cols-3 gap-3"
              >
                {distanceOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.value}>
                      <RadioGroupItem
                        value={option.value}
                        id={`distance-${option.value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`distance-${option.value}`}
                        className="flex flex-col items-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center transition-all"
                      >
                        <Icon className="w-5 h-5 text-muted-foreground mb-2" />
                        <span className="font-medium text-sm">{option.label}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{option.description}</span>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            {/* Energy Level */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  Your Energy Level
                </Label>
                <span className="text-sm font-medium bg-muted px-3 py-1 rounded-md">
                  {["Very Low", "Low", "Moderate", "Good", "High"][formData.energyLevel - 1]}
                </span>
              </div>
              <Slider
                value={[formData.energyLevel]}
                onValueChange={([value]) => setFormData({ ...formData, energyLevel: value })}
                min={1}
                max={5}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Exhausted</span>
                <span>Energized</span>
              </div>
            </div>

            {/* Support Network */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                Support Network
              </Label>
              <RadioGroup
                value={formData.supportNetwork}
                onValueChange={(value) => setFormData({ ...formData, supportNetwork: value })}
                className="grid grid-cols-3 gap-3"
              >
                {supportOptions.map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem
                      value={option.value}
                      id={`support-${option.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`support-${option.value}`}
                      className="flex flex-col items-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center transition-all"
                    >
                      <span className="font-medium text-sm">{option.label}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">{option.description}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Hard Limits */}
            <div className="space-y-2">
              <Label htmlFor="hardLimits" className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-muted-foreground" />
                Hard Limits (optional)
              </Label>
              <Textarea
                id="hardLimits"
                placeholder="Things you cannot or will not do, boundaries you need to maintain..."
                rows={3}
                value={formData.hardLimits}
                onChange={(e) => setFormData({ ...formData, hardLimits: e.target.value })}
                className="bg-background resize-none"
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Case"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
