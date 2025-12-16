import crypto from "crypto";

type OrderPayload = {
  orderId: string;
  amount: number;
  currency: string;
  createdAt: number;
};

export function signOrder(payload: OrderPayload): string | null {
  const secret = process.env.ORDER_TOKEN_SECRET;
  if (!secret) return null;

  const data = JSON.stringify(payload);
  const sig = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64");

  return Buffer.from(`${data}.${sig}`).toString("base64");
}
