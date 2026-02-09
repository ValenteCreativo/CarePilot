"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type WhatsAppConfigProps = {
  accountSidMasked: string | null;
};

export function WhatsAppConfig({ accountSidMasked }: WhatsAppConfigProps) {
  const [isPending, startTransition] = useTransition();
  const [tone, setTone] = useState("Warm and calm");
  const [language, setLanguage] = useState("English + Spanish");
  const [responseStyle, setResponseStyle] = useState("Short, actionable steps");

  const handleTest = () => {
    startTransition(async () => {
      const response = await fetch("/api/whatsapp/test", { method: "POST" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: "Test failed" }));
        toast.error(data.message ?? "Test failed");
        return;
      }
      toast.success("Test message queued");
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg text-[#004d6d] flex items-center gap-2">
            <span className="text-[#0097b2]">📱</span> Connect WhatsApp (Twilio Sandbox)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <ol className="list-decimal list-inside space-y-3 text-[#004d6d]">
            <li className="font-medium">
              Open WhatsApp and send the message:{" "}
              <span className="font-bold text-[#0097b2] bg-[#aee4ff]/30 px-2 py-1 rounded">join four-mission</span>
            </li>
            <li className="font-medium">Send to the Twilio sandbox number listed in your Twilio console.</li>
            <li className="font-medium">Once connected, CarePilot will start logging messages here.</li>
          </ol>
          <div className="rounded-lg border-2 border-[#0097b2]/20 bg-[#aee4ff]/20 p-4 text-xs">
            <p className="text-[#004d6d] font-semibold">
              TWILIO_ACCOUNT_SID:{" "}
              <span className="font-bold text-[#0097b2]">{accountSidMasked ?? "Not configured"}</span>
            </p>
          </div>
          <Button onClick={handleTest} disabled={isPending} className="bg-[#f66] hover:bg-[#f66]/90">
            Test Webhook
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg text-[#004d6d] flex items-center gap-2">
            <span className="text-[#0097b2]">🤖</span> Bot Personality
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tone" className="text-[#004d6d] font-semibold">Tone</Label>
            <Input
              id="tone"
              value={tone}
              onChange={(event) => setTone(event.target.value)}
              className="border-[#0097b2]/30 text-[#004d6d] placeholder:text-[#004d6d]/60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language" className="text-[#004d6d] font-semibold">Language</Label>
            <Input
              id="language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="border-[#0097b2]/30 text-[#004d6d] placeholder:text-[#004d6d]/60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="style" className="text-[#004d6d] font-semibold">Response Style</Label>
            <Input
              id="style"
              value={responseStyle}
              onChange={(event) => setResponseStyle(event.target.value)}
              className="border-[#0097b2]/30 text-[#004d6d] placeholder:text-[#004d6d]/60"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#0097b2]/30 shadow-xl hover:shadow-2xl hover:border-[#fff8d7] transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg text-[#004d6d] flex items-center gap-2">
            <span className="text-[#0097b2]">🔔</span> Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notify-window" className="text-[#004d6d] font-semibold">Quiet Hours</Label>
            <Input
              id="notify-window"
              placeholder="9pm - 7am"
              className="border-[#0097b2]/30 text-[#004d6d] placeholder:text-[#004d6d]/60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alerts" className="text-[#004d6d] font-semibold">High Priority Alerts</Label>
            <Textarea
              id="alerts"
              placeholder="Example: urgent medical issues, missed medications"
              rows={3}
              className="border-[#0097b2]/30 text-[#004d6d] placeholder:text-[#004d6d]/60"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
