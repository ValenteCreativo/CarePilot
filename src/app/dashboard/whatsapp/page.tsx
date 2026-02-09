import { WhatsAppConfig } from "@/components/dashboard/whatsapp-config";

export default function WhatsAppPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-[#004d6d]">WhatsApp Bot Setup</h1>
        <p className="text-[#004d6d]/90 text-lg">
          Follow the steps below to (simulate) linking your WhatsApp account to the CarePilot bot.
        </p>
      </div>
      <div className="bg-white border-2 border-[#0097b2]/30 rounded-xl shadow-xl p-6">
        <WhatsAppConfig accountSidMasked={null} />
      </div>
    </div>
  );
}
