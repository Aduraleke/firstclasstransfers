import { NextResponse } from "next/server";
import { BookingBaseSchema } from "@/lib/booking/schema";
import { computePriceOrThrow } from "@/lib/payments/pricing";

const BASE_URL =
  process.env.REVOLUT_ENV === "sandbox"
    ? "https://sandbox-merchant.revolut.com"
    : "https://merchant.revolut.com";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const booking = BookingBaseSchema.parse(raw);

    const amount = computePriceOrThrow({
      routeId: booking.routeId,
      vehicleTypeId: booking.vehicleTypeId,
      tripType: booking.tripType,
    });

    // 1️⃣ CREATE CHECKOUT ORDER
    const orderRes = await fetch(`${BASE_URL}/api/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${requireEnv("REVOLUT_SECRET_KEY")}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Revolut-Api-Version": "2023-09-01",
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency: "EUR",
        capture_mode: "automatic",
        customer: {
          email: booking.email,
        },
        merchant_order_ext_ref: `BKG-${Date.now()}`,
      }),
    });

    const orderText = await orderRes.text();
    if (!orderRes.ok) {
      console.error("Revolut order error:", orderText);
      return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
    }

    const order = JSON.parse(orderText);

    // 2️⃣ EXCHANGE ORDER → TOKEN  🔥 THIS WAS MISSING
    const tokenRes = await fetch(
      `${BASE_URL}/api/checkout/orders/${order.id}/token`,
      {
        headers: {
          Authorization: `Bearer ${requireEnv("REVOLUT_SECRET_KEY")}`,
          "Accept": "application/json",
          "Revolut-Api-Version": "2023-09-01",
        },
      }
    );

    const tokenText = await tokenRes.text();
    if (!tokenRes.ok) {
      console.error("Revolut token error:", tokenText);
      return NextResponse.json({ error: "Token creation failed" }, { status: 500 });
    }

    const token = JSON.parse(tokenText);

    // ✅ FRONTEND NEEDS *TOKEN*, NOT order.id
    return NextResponse.json({ token: token.token });
  } catch (err) {
    console.error("Checkout route failed:", err);
    return NextResponse.json({ error: "Invalid order request" }, { status: 400 });
  }
}
