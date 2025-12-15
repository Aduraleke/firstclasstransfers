export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { buildMyPOSFormHTML } from "@/lib/payments/mypos-form";
import { signOrder } from "@/lib/payments/order-token";
import { computePriceOrThrow } from "@/lib/pricing";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      routeId,
      vehicleTypeId,
      tripType,
      customerEmail,
      customerPhone,
    } = body;

    if (!routeId || !vehicleTypeId || !tripType || !customerEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1️⃣ Server-side trusted price
    const amount = computePriceOrThrow({
      routeId,
      vehicleTypeId,
      tripType,
    });

    const orderId = `ORD-${Date.now()}`;

    // 2️⃣ Sign order (UDF1)
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

    // 3️⃣ Build myPOS HTML
    const html = buildMyPOSFormHTML({
      orderId,
      amount,
      currency: "EUR",
      customerEmail,
      customerPhone,
      udf1: token,
    });

    // 4️⃣ Return HTML
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
