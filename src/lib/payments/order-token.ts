// src/lib/payments/order-token.ts
import crypto from "crypto";

type OrderPayload = {
  orderId: string;
  amount: number;
  currency: string;
  createdAt: number;
};

export function signOrder(payload: OrderPayload): string | null {
  const secret = process.env.ORDER_TOKEN_SECRET;
  if (!secret) {
    console.warn("ORDER_TOKEN_SECRET missing — order token disabled");
    return null;
  }

  const data = JSON.stringify(payload);
  const sig = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64");

  return Buffer.from(`${data}.${sig}`).toString("base64");
}

export function verifyOrder(token: string): OrderPayload | null {
  const secret = process.env.ORDER_TOKEN_SECRET;
  if (!secret) {
    console.warn("ORDER_TOKEN_SECRET missing — skipping verification");
    return null;
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [data, sig] = decoded.split(".");
    if (!data || !sig) return null;

    const expected = crypto
      .createHmac("sha256", secret)
      .update(data)
      .digest("base64");

    if (sig !== expected) return null;

    return JSON.parse(data);
  } catch {
    return null;
  }
}
