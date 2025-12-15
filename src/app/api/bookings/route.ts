export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BookingBaseSchema, type BookingBase } from "@/lib/booking/schema";
import { computePrice, RouteId, VehicleId } from "@/lib/pricing";

// myPOS IPC helpers
import { buildMyPOSFormHTML } from "@/lib/payments/mypos-form";
import { signOrder } from "@/lib/payments/order-token";

// Email sender
import { sendEmail } from "@/lib/email/nodemailer";

// Email templates
import {
  customerCashConfirmed,
  customerCardPending,
  officeCashBooking,
  officeCardPending,
} from "@/lib/email/templates";

/* ---------- helpers ---------- */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 6;
const ipMap = new Map<string, number[]>();

function cleanUpIp(ip: string) {
  const now = Date.now();
  const arr = ipMap.get(ip) ?? [];
  const kept = arr.filter((t) => now - t <= RATE_LIMIT_WINDOW_MS);
  ipMap.set(ip, kept);
  return kept;
}

function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/* ---------- POST handler ---------- */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    // 1️⃣ Rate limiting
    const recent = cleanUpIp(ip);
    if (recent.length >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
    recent.push(Date.now());

    // 2️⃣ Read request
    const contentType = (req.headers.get("content-type") || "").toLowerCase();
    const raw = contentType.includes("application/json")
      ? await req.json()
      : Object.fromEntries((await req.formData()).entries());

    // 3️⃣ Validate booking payload
    let parsed: BookingBase;
    try {
      parsed = BookingBaseSchema.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Invalid booking payload" },
        { status: 400 }
      );
    }

    // 4️⃣ Compute price (server-trusted)
    let price;
    try {
      const routeId = parsed.routeId as RouteId;
      const vehicleTypeId = parsed.vehicleTypeId as VehicleId;

      price = computePrice(routeId, vehicleTypeId, parsed.tripType);
    } catch {
      return NextResponse.json(
        { error: "Invalid route or vehicle selection" },
        { status: 400 }
      );
    }

    const officeEmail =
      process.env.BOOKING_EMAIL || "booking@firstclasstransfers.eu";

    const bookingData = {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      route: parsed.routeId,
      vehicle: parsed.vehicleTypeId,
      tripType: parsed.tripType,
      date: parsed.date,
      time: parsed.time,
      adults: parsed.adults,
      children: parsed.children,
      baggage: parsed.baggageType,
      amount: price.total,
    };

    const url = new URL(req.url);
    const payByCard = url.searchParams.get("pay") === "true";

    /* ============================
       CASH BOOKING (NO PAYMENT)
    ============================ */
    if (!payByCard) {
      const customerMail = customerCashConfirmed(bookingData);
      const officeMail = officeCashBooking(bookingData);

      await sendEmail({
        to: parsed.email,
        subject: customerMail.subject,
        html: customerMail.html,
      });

      await sendEmail({
        to: officeEmail,
        subject: officeMail.subject,
        html: officeMail.html,
      });

      return NextResponse.json({ ok: true, price });
    }

    /* ============================
       CARD BOOKING (PAYMENT PENDING)
    ============================ */
    const customerMail = customerCardPending(bookingData);
    const officeMail = officeCardPending(bookingData);

    await sendEmail({
      to: parsed.email,
      subject: customerMail.subject,
      html: customerMail.html,
    });

    await sendEmail({
      to: officeEmail,
      subject: officeMail.subject,
      html: officeMail.html,
    });

    /* ============================
       myPOS IPC CHECKOUT (HTML POST)
    ============================ */
    const orderId = `BKG-${Date.now()}`;
    const amount = Number(price.total);

    const token = signOrder({
      orderId,
      amount,
      currency: "EUR",
      createdAt: Date.now(),
    });

    if (!token) {
      return NextResponse.json(
        { error: "Failed to sign order" },
        { status: 500 }
      );
    }

    const html = buildMyPOSFormHTML({
      orderId,
      amount,
      currency: "EUR",
      customerEmail: parsed.email,
      customerPhone: parsed.phone,
      udf1: token,
    });

    // 🚀 Return HTML → browser auto-submits to myPOS
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("Booking route failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
