// app/api/payments/revolut/checkout-order/route.ts
import { NextResponse } from "next/server"
import { BookingBaseSchema } from "@/lib/booking/schema"
import { computePriceOrThrow } from "@/lib/payments/pricing"
import { connectDB } from "@/lib/db/mongo"
import { Booking } from "@/lib/db/models/Booking"

// Production-only Revolut API base URL
const BASE_URL = "https://merchant.revolut.com"

// Consistent API version across all Revolut endpoints
const API_VERSION = "2025-12-04"

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env var: ${name}`)
  return v
}

function getBaseUrl(): string {
  // Prefer explicit base URL from environment
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }

  // In production, fail fast if misconfigured instead of using a hardcoded fallback
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_BASE_URL must be set in production")
  }

  // Fallback for development / non-production
  console.warn(
    "[REVOLUT] NEXT_PUBLIC_BASE_URL not set; using development fallback http://localhost:3000",
  )
  return "http://localhost:3000"
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

    // Revolut expects amount in minor units (cents)
    const amountMinor = Math.round(amount * 100)
    console.log("[REVOLUT] Computed amount (cents):", amountMinor)

    const baseUrl = getBaseUrl()
    const orderId = `BKG-${Date.now()}`

    // Create booking record in database
    await connectDB()
    await Booking.create({
      orderId,
      routeId: booking.routeId,
      vehicleTypeId: booking.vehicleTypeId,
      tripType: booking.tripType,
      expectedAmount: amount,
      currency: "EUR",
      paymentMethod: "card",
      paymentStatus: "pending_payment",
      customer: {
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
      },
    })

    console.log(`[REVOLUT] Created booking record: ${orderId}`)

    // 1️⃣ Create order with redirect URLs
    const orderPayload = {
      amount: amountMinor,
      currency: "EUR",
      capture_mode: "automatic",
      customer: { email: booking.email },
      merchant_order_ext_ref: orderId,
      success_url: `${baseUrl}/payment/success?orderId=${orderId}`,
      failure_url: `${baseUrl}/payment/failed?orderId=${orderId}`,
      cancel_url: `${baseUrl}/payment/cancelled?orderId=${orderId}`,
    }

    console.log("[REVOLUT] Order payload:", orderPayload)

    const orderRes = await fetch(`${BASE_URL}/api/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${requireEnv("REVOLUT_SECRET_KEY")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Revolut-Api-Version": API_VERSION,
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
          "Revolut-Api-Version": API_VERSION,
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

    return NextResponse.json({ 
      token: token.token,
      orderId: orderId,
      revolutOrderId: order.id
    })
  } catch (err) {
    console.error("[REVOLUT] Checkout failed:", err)
    return NextResponse.json({ error: "Invalid order request" }, { status: 400 })
  }
}
