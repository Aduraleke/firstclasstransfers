export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BookingBaseSchema, type BookingBase } from "@/lib/booking/schema";
import { createBooking } from "@/lib/booking/createBooking";

// myPOS helpers
import { buildMyPOSFormHTML } from "@/lib/payments/mypos-form";
import { signOrder } from "@/lib/payments/order-token";

/* ---------- rate limiting ---------- */
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

/* ---------- POST ---------- */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    // 1️⃣ Rate limit
    const recent = cleanUpIp(ip);
    if (recent.length >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
    recent.push(Date.now());

    // 2️⃣ Parse body
    const raw = await req.json();

    // 3️⃣ Validate booking (FULL booking only)
    let parsed: BookingBase;
    try {
      parsed = BookingBaseSchema.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Invalid booking payload" },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    const payByCard = url.searchParams.get("pay") === "true";

    // 4️⃣ CREATE BOOKING + SEND EMAILS (ALWAYS)
    const { amount } = await createBooking(parsed, payByCard);

    // 5️⃣ CASH FLOW — DONE
    if (!payByCard) {
      return NextResponse.json({ ok: true, amount });
    }

    // 6️⃣ CARD FLOW — REDIRECT AFTER EMAILS
    const orderId = `BKG-${Date.now()}`;

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
