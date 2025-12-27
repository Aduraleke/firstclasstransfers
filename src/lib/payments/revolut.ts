import crypto from "crypto";

const BASE_URL =
  process.env.REVOLUT_ENV === "sandbox"
    ? "https://sandbox.merchant.revolut.com"
    : "https://merchant.revolut.com";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function createRevolutOrder(params: {
  amount: number;
  currency: "EUR";
  orderId: string;
  email: string;
}) {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireEnv("REVOLUT_SECRET_KEY")}`,
      "Content-Type": "application/json",
            "Revolut-Api-Version": "2025-12-04",

    },
    body: JSON.stringify({
      amount: params.amount * 100, // minor units
      currency: params.currency,
      merchant_order_ext_ref: params.orderId,
      capture_mode: "automatic",
      customer: {
        email: params.email,
      },
    }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Revolut order failed: ${text}`);
    console.log("Error")
  }

  return JSON.parse(text);
}

/* ---------------- WEBHOOK VERIFICATION ---------------- */

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
