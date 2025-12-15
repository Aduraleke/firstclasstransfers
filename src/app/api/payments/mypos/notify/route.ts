export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyOrder } from "@/lib/payments/order-token";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const entries = Array.from(form.entries());

    if (entries.length === 0) {
      return new NextResponse("OK", { status: 200 });
    }

    const sig = entries.find(([k]) => k === "Signature")?.[1] as string;
    if (!sig) return new NextResponse("OK", { status: 200 });

    const raw = entries
      .filter(([k]) => k !== "Signature")
      .map(([, v]) => String(v))
      .join("-");

    const base64 = Buffer.from(raw).toString("base64");

    const valid = crypto.verify(
      "RSA-SHA256",
      Buffer.from(base64),
      process.env.MYPOS_PUBLIC_CERT!,
      Buffer.from(sig, "base64")
    );

    if (!valid) return new NextResponse("OK", { status: 200 });

    const data = Object.fromEntries(entries) as Record<string, string>;

    if (data.Status !== "0") return new NextResponse("OK", { status: 200 });

    const order = verifyOrder(data.UDF1);
    if (!order) return new NextResponse("OK", { status: 200 });

    if (Number(data.Amount) !== order.amount)
      return new NextResponse("OK", { status: 200 });

    // ✅ PAYMENT CONFIRMED
    console.log("✅ PAYMENT CONFIRMED:", order.orderId);

    return new NextResponse("OK", { status: 200 });
  } catch {
    return new NextResponse("OK", { status: 200 });
  }
}
