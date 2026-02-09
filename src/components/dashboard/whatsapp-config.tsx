"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type WhatsAppConfigProps = {
  /** Legacy prop (Twilio) — kept to avoid breaking callers. */
  accountSidMasked: string | null;
};

function hashToBits(input: string) {
  // Lightweight deterministic hash → bitstream (no deps)
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function FakeQr({ value }: { value: string }) {
  const size = 210;
  const cells = 21;
  const cell = Math.floor(size / cells);

  const bits = useMemo(() => {
    const seed = hashToBits(value);
    const out: boolean[] = [];
    let x = seed;
    for (let i = 0; i < cells * cells; i += 1) {
      // xorshift32
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      out.push((x & 1) === 1);
    }
    return out;
  }, [value]);

  const isFinder = (r: number, c: number) => {
    const inTopLeft = r < 7 && c < 7;
    const inTopRight = r < 7 && c >= cells - 7;
    const inBottomLeft = r >= cells - 7 && c < 7;
    return inTopLeft || inTopRight || inBottomLeft;
  };

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="rounded-xl border-2 border-[#0097b2]/30 bg-white p-3 shadow-lg">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="WhatsApp linking QR (simulated)">
          <rect x={0} y={0} width={size} height={size} fill="#ffffff" />
          {Array.from({ length: cells }).map((_, r) =>
            Array.from({ length: cells }).map((__, c) => {
              const i = r * cells + c;
              const on = isFinder(r, c)
                ? // finder patterns
                  (r % 6 === 0 || c % 6 === 0 || (r >= 2 && r <= 4 && c >= 2 && c <= 4))
                : bits[i];

              if (!on) return null;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={c * cell}
                  y={r * cell}
                  width={cell}
                  height={cell}
                  fill="#004d6d"
                  opacity={isFinder(r, c) ? 1 : 0.9}
                />
              );
            })
          )}
        </svg>
      </div>
      <p className="text-xs text-[#004d6d]/80 font-semibold text-center max-w-[240px]">
        Demo QR • not a real WhatsApp link
      </p>
    </div>
  );
}

export function WhatsAppConfig({ accountSidMasked }: WhatsAppConfigProps) {
  const [isPending, startTransition] = useTransition();
  const [tone, setTone] = useState("Warm and calm");
  const [language, setLanguage] = useState("English + Spanish");
  const [responseStyle, setResponseStyle] = useState("Short, actionable steps");
  const [qrValue, setQrValue] = useState(() => `carepilot-demo:${Date.now()}`);
  const [isLinked, setIsLinked] = useState(false);

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
            <span className="text-[#0097b2]">📱</span> Link WhatsApp to CarePilot (Simulated)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <div className="grid md:grid-cols-[240px_1fr] gap-6 items-start">
            <div className="flex flex-col items-center">
              <FakeQr value={qrValue} />
              <Button
                type="button"
                variant="outline"
                className="mt-3 border-[#0097b2] text-[#0097b2] hover:bg-[#0097b2]/10"
                onClick={() => setQrValue(`carepilot-demo:${Date.now()}`)}
              >
                Refresh QR
              </Button>
            </div>

            <div className="space-y-3">
              <ol className="list-decimal list-inside space-y-2 text-[#004d6d]">
                <li className="font-medium">
                  Open WhatsApp → <span className="font-bold">Settings</span> → <span className="font-bold">Linked devices</span>.
                </li>
                <li className="font-medium">Tap <span className="font-bold">Link a device</span>.</li>
                <li className="font-medium">Scan this QR code to connect the CarePilot bot.</li>
                <li className="font-medium">Once linked, CarePilot will start logging messages and actions.</li>
              </ol>

              <div className="rounded-lg border-2 border-[#fff8d7] bg-[#fff8d7]/25 p-4">
                <p className="text-[#004d6d] font-semibold">
                  Note: This is a UI simulation for demo purposes.
                </p>
                <p className="text-[#004d6d]/90 mt-1">
                  When we switch to a real WhatsApp provider (Cloud API / BSP), this section will become the real onboarding flow.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className={isLinked ? "bg-[#0097b2] hover:bg-[#0097b2]/90" : "bg-[#f66] hover:bg-[#f66]/90"}
                  onClick={() => {
                    setIsLinked(true);
                    toast.success("WhatsApp linked (simulated)");
                  }}
                >
                  {isLinked ? "Linked ✓" : "Mark as linked"}
                </Button>

                <Button onClick={handleTest} disabled={isPending || !isLinked} className="bg-[#004d6d] hover:bg-[#004d6d]/90">
                  Send test message
                </Button>
              </div>

              {accountSidMasked ? (
                <p className="text-xs text-[#004d6d]/70">
                  Legacy Twilio config detected: <span className="font-semibold">{accountSidMasked}</span>
                </p>
              ) : null}
            </div>
          </div>
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
