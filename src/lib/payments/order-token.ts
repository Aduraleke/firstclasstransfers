import crypto from "crypto";

const SECRET = process.env.ORDER_TOKEN_SECRET!;
if (!SECRET) throw new Error("Missing ORDER_TOKEN_SECRET");

export type OrderPayload = {
  orderId: string;
  amount: number;
  currency: "EUR";
  createdAt: number;
};

export function signOrder(payload: OrderPayload): string {
  const json = JSON.stringify(payload);
  const sig = crypto.createHmac("sha256", SECRET).update(json).digest("hex");
  return Buffer.from(`${json}.${sig}`).toString("base64url");
}

export function verifyOrder(token: string) {
  if (!process.env.ORDER_TOKEN_SECRET) {
    console.warn("ORDER_TOKEN_SECRET missing — skipping verification");
    return null;
  }

  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const [json, sig] = decoded.split(".");
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(json)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null;
    }

    return JSON.parse(json) as OrderPayload;
  } catch {
    return null;
  }
}
