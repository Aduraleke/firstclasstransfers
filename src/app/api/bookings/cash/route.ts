import { NextResponse } from "next/server";
import { computePriceOrThrow } from "@/lib/payments/pricing";
import { sendEmail } from "@/lib/email/nodemailer";
import {
  customerCashConfirmed,
  officeCashBooking,
} from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = computePriceOrThrow({
      routeId: body.routeId,
      vehicleTypeId: body.vehicleTypeId,
      tripType: body.tripType,
    });

    const officeEmail =
      process.env.BOOKING_EMAIL || "booking@firstclasstransfers.eu";

  const bookingData = {
  name: body.name,
  email: body.email,
  phone: body.phone,
  route: body.routeId,
  vehicle: body.vehicleTypeId,
  tripType: body.tripType,

  date: body.date,
  time: body.time,

  returnDate: body.returnDate,
  returnTime: body.returnTime,

  adults: body.adults,
  children: body.children,
  baggage: body.baggageType,
  amount,
};


    // Customer email
    const customerMail = customerCashConfirmed(bookingData);
    await sendEmail({
      to: body.email,
      subject: customerMail.subject,
      html: customerMail.html,
    });

    // Office email
    const officeMail = officeCashBooking(bookingData);
    await sendEmail({
      to: officeEmail,
      subject: officeMail.subject,
      html: officeMail.html,
    });

    return NextResponse.json({ ok: true, amount });
  } catch (err) {
    console.error("Cash booking failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
