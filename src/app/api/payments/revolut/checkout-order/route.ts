// app/api/payments/revolut/checkout-order/route.ts
import { NextResponse } from "next/server"
import { BookingBaseSchema } from "@/lib/booking/schema"
import { computePriceOrThrow } from "@/lib/payments/pricing"

const BASE_URL =
  process.env.REVOLUT_ENV === "sandbox"
    ? "https://sandbox-merchant.revolut.com"
    : "https://merchant.revolut.com"

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env var: ${name}`)
  return v
}

export async function POST(req: Request) {
  try {
    const raw = await req.json()
    console.log("[REVOLUT] Raw booking payload:", raw)

    const booking = BookingBaseSchema.parse(raw)
    console.log("[REVOLUT] Parsed booking:", booking)

    const amount = computePriceOrThrow({
      routeId: booking.routeId,
      vehicleTypeId: booking.vehicleTypeId,
      tripType: booking.tripType,
    })

    console.log("[REVOLUT] Computed amount (EUR):", amount)


    // 1️⃣ Create order
    const orderPayload = {
      amount: amount,
      currency: "EUR",
      capture_mode: "automatic",
      customer: { email: booking.email },
      merchant_order_ext_ref: `BKG-${Date.now()}`,
      success_url: "../../../../(site)/payment/success",
      cancel_url: "../../../../(site)/payment/cancelled",
    }

    console.log("[REVOLUT] Order payload:", orderPayload)
    console.log("[REVOLUT ENV CHECK]", {
  REVOLUT_ENV: process.env.REVOLUT_ENV,
  SECRET_KEY_PRESENT: !!process.env.REVOLUT_SECRET_KEY,
  SECRET_KEY_PREFIX: process.env.REVOLUT_SECRET_KEY?.slice(0, 10),
});


    const orderRes = await fetch(`${BASE_URL}/api/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${requireEnv("REVOLUT_SECRET_KEY")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Revolut-Api-Version": "2023-09-01",
      },
      body: JSON.stringify(orderPayload),
    })

    const orderText = await orderRes.text()
    console.log("[REVOLUT] Order response:", orderText)

    if (!orderRes.ok) {
      return NextResponse.json({ error: orderText }, { status: 500 })
    }

    const order = JSON.parse(orderText)

    // 2️⃣ Exchange for token
    const tokenRes = await fetch(
      `${BASE_URL}/api/checkout/orders/${order.id}/token`,
      {
        headers: {
          Authorization: `Bearer ${requireEnv("REVOLUT_SECRET_KEY")}`,
          Accept: "application/json",
          "Revolut-Api-Version": "2023-09-01",
        },
      }
    )

    const tokenText = await tokenRes.text()
    console.log("[REVOLUT] Token response:", tokenText)

    if (!tokenRes.ok) {
      return NextResponse.json({ error: tokenText }, { status: 500 })
    }

    const token = JSON.parse(tokenText)

    if (!token?.token) {
      throw new Error("Missing token in Revolut response")
    }

    console.log("[REVOLUT] Final public token:", token.token)

    return NextResponse.json({ token: token.token })
  } catch (err) {
    console.error("[REVOLUT] Checkout failed:", err)
    return NextResponse.json({ error: "Invalid order request" }, { status: 400 })
  }
}
