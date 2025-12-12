import { NextResponse } from "next/server";
import crypto from "crypto";

import { computePriceOrThrow } from "@/lib/payments/pricing";
import { signOrder } from "@/lib/payments/order-token";
import { buildMyPOSFormHTML } from "@/lib/payments/mypos-form";

export async function POST(req: Request) {
  try {


    const body = await req.json();

    const amount = computePriceOrThrow({
      routeId: body.routeId,
      vehicleTypeId: body.vehicleTypeId,
      tripType: body.tripType,
    });

    const orderId = crypto.randomUUID();

    signOrder({
      orderId,
      amount,
      currency: "EUR",
      createdAt: Date.now(),
    });

    const html = buildMyPOSFormHTML({
      orderId,
      amount,
      currency: "EUR",
      customerEmail: body.email,
      customerPhone: body.phone,
    });

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    console.error("🔥 CARD INIT ERROR:", err);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
