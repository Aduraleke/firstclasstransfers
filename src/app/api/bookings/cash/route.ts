import { NextResponse } from "next/server";
import { computePriceOrThrow } from "@/lib/payments/pricing";

export async function POST(req: Request) {
  const body = await req.json();

  const amount = computePriceOrThrow({
    routeId: body.routeId,
    vehicleTypeId: body.vehicleTypeId,
    tripType: body.tripType,
  });

  return NextResponse.json({
    ok: true,
    amount,
    message: "Cash booking received",
  });
}
