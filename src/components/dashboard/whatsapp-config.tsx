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
      <Card className="bg-background/80 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Connect WhatsApp (Twilio sandbox)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-[#004d6d]/90">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Open WhatsApp and send the message:{" "}
              <span className="font-medium text-[#004d6d]">join four-mission</span>
            </li>
            <li>Send to the Twilio sandbox number listed in your Twilio console.</li>
            <li>Once connected, CarePilot will start logging messages here.</li>
          </ol>
          <div className="rounded-lg border border-border/40 p-4 text-xs">
            <p className="text-[#004d6d]/90">
              TWILIO_ACCOUNT_SID:{" "}
              <span className="font-medium text-[#004d6d]">{accountSidMasked ?? "Not configured"}</span>
            </p>
          </div>
          <Button onClick={handleTest} disabled={isPending}>
            Test webhook
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-background/80 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Bot personality</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Input id="tone" value={tone} onChange={(event) => setTone(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input id="language" value={language} onChange={(event) => setLanguage(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="style">Response style</Label>
            <Input id="style" value={responseStyle} onChange={(event) => setResponseStyle(event.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background/80 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Notification preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notify-window">Quiet hours</Label>
            <Input id="notify-window" placeholder="9pm - 7am" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alerts">High priority alerts</Label>
            <Textarea
              id="alerts"
              placeholder="Example: urgent medical issues, missed medications"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
