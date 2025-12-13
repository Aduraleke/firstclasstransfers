// app/api/bookings/cash/route.ts
import { NextResponse } from "next/server";
import { computePriceOrThrow } from "@/lib/payments/pricing";
import { sendBookingEmail } from "@/lib/email/nodemailer"; // YOUR EMAIL FILE

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const amount = computePriceOrThrow({
      routeId: body.routeId,
      vehicleTypeId: body.vehicleTypeId,
      tripType: body.tripType,
    });

    // 📩 Send confirmation email immediately
    await sendBookingEmail({
      to: body.email,
      subject: "Your Airport Transfer Booking is Confirmed ✔",
      text: `Dear ${body.name}, your booking is confirmed.\nRoute: ${body.routeId}\nAmount: €${amount}`,
      html: `
        <p>Dear ${body.name},</p>
        <p>Your booking has been <strong>confirmed</strong>.</p>
        <p><strong>Route:</strong> ${body.routeId}<br/>
        <strong>Total Fare:</strong> €${amount}</p>
      `
    });

    return NextResponse.json({
      ok: true,
      amount,
      message: "Cash booking received",
    });

  } catch (err) {
    console.error("Cash booking failed:", err);
    return NextResponse.json(
      { ok: false, error: "Cash booking failed" },
      { status: 500 }
    );
  }
}
