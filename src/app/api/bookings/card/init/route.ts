// app/api/bookings/card/init/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

import { computePriceOrThrow } from "@/lib/payments/pricing";
import { sendBookingEmail } from "@/lib/email/nodemailer"; // your email sender
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

    // 📩 EMAIL MUST BE SENT BEFORE REDIRECTING
    await sendBookingEmail({
      to: body.email,
      subject: "Booking Received – Payment Pending",
      text: `Dear ${body.name}, we received your booking. Please complete your card payment now.`,
      html: `
        <p>Dear ${body.name},</p>
        <p>Your booking has been received. <strong>Your payment is still pending.</strong></p>
        <p>Please complete your card payment in the secure checkout page you are about to be redirected to.</p>
        <p><strong>Amount:</strong> €${amount}</p>
      `
    });

    // Now build the redirect form to myPOS
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
