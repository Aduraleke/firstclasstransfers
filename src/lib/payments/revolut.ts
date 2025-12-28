import crypto from "crypto";

// Production-only Revolut API base URL
const BASE_URL = "https://merchant.revolut.com";

// Consistent API version across all Revolut endpoints
const API_VERSION = "2025-12-04";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function createRevolutOrder(params: {
  amount: number; // Amount in euros (will be converted to cents for Revolut API)
  currency: "EUR";
  orderId: string;
  email: string;
  successUrl?: string;
  failureUrl?: string;
  cancelUrl?: string;
}) {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireEnv("REVOLUT_SECRET_KEY")}`,
      "Content-Type": "application/json",
      "Revolut-Api-Version": API_VERSION,
    },
    body: JSON.stringify({
      amount: params.amount * 100, // Convert to minor units (cents)
      currency: params.currency,
      merchant_order_ext_ref: params.orderId,
      capture_mode: "automatic",
      customer: { email: params.email },
      ...(params.successUrl && { success_url: params.successUrl }),
      ...(params.failureUrl && { failure_url: params.failureUrl }),
      ...(params.cancelUrl && { cancel_url: params.cancelUrl }),
    }),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text);

  return JSON.parse(text);
}

export function verifyRevolutWebhook(
  payload: string,
  signature: string
): boolean {
  const secret = requireEnv("REVOLUT_WEBHOOK_SECRET");

  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
