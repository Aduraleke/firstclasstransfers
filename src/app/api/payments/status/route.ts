import { NextResponse } from "next/server";
import { Booking } from "@/lib/db/models/Booking";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const booking = await Booking.findOne({ orderId });
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: booking.paymentStatus,
    amount: booking.expectedAmount,
    currency: booking.currency,
  });
}
