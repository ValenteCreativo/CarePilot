// Twilio service for sending SMS reminders
export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export interface SendSmsResult {
  success: boolean;
  sid?: string;
  error?: string;
}

class TwilioService {
  private config: TwilioConfig | null = null;

  initialize(config: TwilioConfig) {
    this.config = config;
  }

  async sendSms(to: string, message: string): Promise<SendSmsResult> {
    if (!this.config) {
      return {
        success: false,
        error: "Twilio not configured",
      };
    }

    try {
      const params = new URLSearchParams();
      params.append("To", to);
      params.append("From", this.config.fromNumber);
      params.append("Body", message);

      const auth = Buffer.from(
        `${this.config.accountSid}:${this.config.authToken}`
      ).toString("base64");

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Twilio API error: ${response.status} ${errorText}`,
        };
      }

      const result = await response.json();
      return {
        success: true,
        sid: result.sid,
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
      };
    }
  }

  async sendWhatsAppMessage(
    config: TwilioConfig,
    to: string,
    body: string
  ): Promise<{ success: boolean; sid?: string; error?: string }> {
    if (!config) {
      return {
        success: false,
        error: "WhatsApp service not configured",
      };
    }

    try {
      const params = new URLSearchParams();
      params.append("To", to);
      params.append("From", config.fromNumber);
      params.append("Body", body);

      const auth = Buffer.from(
        `${config.accountSid}:${config.authToken}`
      ).toString("base64");

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Failed to send WhatsApp message: ${errorText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        sid: data.sid,
      };
    } catch (error) {
      console.error("WhatsApp send error:", error);
      return {
        success: false,
        error: "Failed to send WhatsApp message",
      };
    }
  }
}

export const twilioService = new TwilioService();

// Initialize with environment variables
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER) {
  twilioService.initialize({
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_FROM_NUMBER,
  });
}
