import { createHmac, timingSafeEqual } from "crypto";

export interface TwilioMessageConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export interface SendMessageResult {
  success: boolean;
  sid?: string;
  error?: string;
}

export async function sendWhatsAppMessage(
  config: TwilioMessageConfig,
  to: string,
  body: string
): Promise<SendMessageResult> {
  try {
    const params = new URLSearchParams();
    params.append("To", to);
    params.append("From", config.fromNumber);
    params.append("Body", body);

    const auth = Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64");

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

export function verifyTwilioSignature(options: {
  url: string;
  params: URLSearchParams;
  signature: string | null;
  authToken: string | undefined;
}): boolean {
  const { url, params, signature, authToken } = options;
  if (!signature || !authToken) {
    return false;
  }

  const sortedParams = Array.from(params.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  let data = url;
  for (const [key, value] of sortedParams) {
    data += key + value;
  }

  const expected = createHmac("sha1", authToken)
    .update(Buffer.from(data, "utf-8"))
    .digest("base64");

  const expectedBuffer = Buffer.from(expected, "utf-8");
  const signatureBuffer = Buffer.from(signature, "utf-8");

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export function buildTwimlMessage(message: string): string {
  const escaped = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>` +
    `<Response><Message>${escaped}</Message></Response>`;
}

export function getTwilioWhatsAppConfig(): TwilioMessageConfig | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber =
    process.env.TWILIO_WHATSAPP_NUMBER ||
    process.env.TWILIO_WHATSAPP_FROM ||
    process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return null;
  }

  return { accountSid, authToken, fromNumber };
}
