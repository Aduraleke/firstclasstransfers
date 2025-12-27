import { NextResponse } from "next/server";
import { BookingBaseSchema } from "@/lib/booking/schema";
import { computePriceOrThrow } from "@/lib/payments/pricing";
import { createRevolutOrder } from "@/lib/payments/revolut";

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const booking = BookingBaseSchema.parse(raw);

    const amount = computePriceOrThrow({
      routeId: booking.routeId,
      vehicleTypeId: booking.vehicleTypeId, 
      tripType: booking.tripType,
    });

    const orderId = `BKG-${Date.now()}`;

    const order = await createRevolutOrder({
      amount,
      currency: "EUR",
      orderId,
      email: booking.email,
    });

    return NextResponse.json({
      publicId: order.id,
      orderId,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
