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

export function verifyOrderToken(token: string): OrderPayload | null {
  const secret = process.env.ORDER_TOKEN_SECRET;
  if (!secret) return null;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [data, sig] = decoded.split(".");

    if (!data || !sig) return null;

    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(data)
      .digest("base64");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(sig),
        Buffer.from(expectedSig)
      )
    ) {
      return null;
    }

    return JSON.parse(data) as OrderPayload;
  } catch {
    return null;
  }
}
