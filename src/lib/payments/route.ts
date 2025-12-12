// app/api/payments/mypos/notify/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * This endpoint should be configured as your myPOS notify / callback URL.
 * Validate incoming parameters as described in myPOS docs and mark the booking
 * as paid/failed in your DB.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    // Pull fields myPOS sends (names per their docs)
    const data = Object.fromEntries(body.entries());

    // TODO: validate signature / verify payload per myPOS docs
    console.log("myPOS notify payload:", data);

    // TODO: reconcile with your orders/bookings (store orderId, update status)
    // e.g. find booking by orderId and mark paid

    // myPOS expects a simple text response in many cases:
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("notify error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
