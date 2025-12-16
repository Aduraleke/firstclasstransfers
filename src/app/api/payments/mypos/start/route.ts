import { NextResponse } from "next/server";
import { BookingBaseSchema } from "@/lib/booking/schema";
import { createBooking } from "@/lib/booking/createBooking";
import { buildMyPOSFormHTML } from "@/lib/payments/mypos-form";
import { signOrder } from "@/lib/payments/order-token";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const parsed = BookingBaseSchema.parse(raw);

    const { amount } = await createBooking(parsed, true);

    const orderId = `ORD-${Date.now()}`;

    const token = signOrder({
      orderId,
      amount,
      currency: "EUR",
      createdAt: Date.now(),
    });

    if (!token) {
      return NextResponse.json(
        { error: "Order signing failed" },
        { status: 500 }
      );
    }

    const html = buildMyPOSFormHTML({
      orderId,
      amount,
      currency: "EUR",
      customerEmail: parsed.email,
      customerPhone: parsed.phone,
      udf1: token,
    });

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("myPOS start error:", err);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
