import { createHmac } from "crypto";

const webhookUrl = process.env.WEBHOOK_URL ?? "http://localhost:3000/api/whatsapp";
const authToken = process.env.TWILIO_AUTH_TOKEN ?? "";

const from = process.env.TWILIO_TEST_FROM ?? "whatsapp:+15551234567";
const to = process.env.TWILIO_TEST_TO ?? "whatsapp:+14155238886";
const body = process.env.TWILIO_TEST_BODY ?? "status";
const messageSid =
  process.env.TWILIO_TEST_SID ?? `SM${Math.random().toString(36).slice(2, 18)}`;

const params = new URLSearchParams({
  From: from,
  To: to,
  Body: body,
  MessageSid: messageSid,
});

function buildSignature(url: string, token: string, params: URLSearchParams) {
  const sorted = Array.from(params.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  let data = url;
  for (const [key, value] of sorted) {
    data += key + value;
  }
  return createHmac("sha1", token).update(Buffer.from(data, "utf-8")).digest("base64");
}

const headers: Record<string, string> = {
  "Content-Type": "application/x-www-form-urlencoded",
};

if (authToken) {
  headers["X-Twilio-Signature"] = buildSignature(webhookUrl, authToken, params);
}

const response = await fetch(webhookUrl, {
  method: "POST",
  headers,
  body: params.toString(),
});

const text = await response.text();

console.log("Status:", response.status);
console.log("Response:\n", text);
