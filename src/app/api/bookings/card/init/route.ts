import { NextResponse } from "next/server";
import crypto from "crypto";

import { computePriceOrThrow } from "@/lib/payments/pricing";
import { sendEmail } from "@/lib/email/nodemailer";
import {
  customerCardPending,
  officeCardPending,
} from "@/lib/email/templates";
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
    const officeEmail =
      process.env.BOOKING_EMAIL || "booking@firstclasstransfers.eu";

    const bookingData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      route: body.routeId,
      vehicle: body.vehicleTypeId,
      tripType: body.tripType,
      amount,
    };

    // Customer email
    const customerMail = customerCardPending(bookingData);
    await sendEmail({
      to: body.email,
      subject: customerMail.subject,
      html: customerMail.html,
    });

    // Office email
    const officeMail = officeCardPending(bookingData);
    await sendEmail({
      to: officeEmail,
      subject: officeMail.subject,
      html: officeMail.html,
    });

    // Redirect to myPOS
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
    console.error("Card init failed:", err);
    return NextResponse.json({ error: "Payment init failed" }, { status: 500 });
  }
}
