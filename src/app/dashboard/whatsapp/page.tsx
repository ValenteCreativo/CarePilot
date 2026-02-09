import { WhatsAppConfig } from "@/components/dashboard/whatsapp-config";

function maskAccountSid(value?: string | null) {
  if (!value) return null;
  if (value.length <= 8) return value;
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export default function WhatsAppPage() {
  const masked = maskAccountSid(process.env.TWILIO_ACCOUNT_SID ?? null);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-[#004d6d]">WhatsApp Configuration</h1>
        <p className="text-[#004d6d]/90 text-lg">
          Connect Twilio sandbox, personalize the bot, and test message delivery.
        </p>
      </div>
      <div className="bg-white border-2 border-[#0097b2]/30 rounded-xl shadow-xl p-6">
        <WhatsAppConfig accountSidMasked={masked} />
      </div>
    </div>
  );
}
