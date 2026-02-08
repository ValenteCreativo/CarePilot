import { WhatsAppConfig } from "@/components/dashboard/whatsapp-config";

function maskAccountSid(value?: string | null) {
  if (!value) return null;
  if (value.length <= 8) return value;
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export default function WhatsAppPage() {
  const masked = maskAccountSid(process.env.TWILIO_ACCOUNT_SID ?? null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">WhatsApp configuration</h1>
        <p className="text-muted-foreground mt-2">
          Connect Twilio sandbox, personalize the bot, and test message delivery.
        </p>
      </div>
      <WhatsAppConfig accountSidMasked={masked} />
    </div>
  );
}
