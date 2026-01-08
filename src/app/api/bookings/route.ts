import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BookingBaseSchema, type BookingBase } from "@/lib/booking/schema";
import { createBooking } from "@/lib/booking/createBooking";

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

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    const recent = cleanUpIp(ip);
    if (recent.length >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
    recent.push(Date.now());

    const raw = await req.json();

    let parsed: BookingBase;
    try {
      parsed = BookingBaseSchema.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Invalid booking payload" },
        { status: 400 }
      );
    }

    const payByCard = raw.paymentMethod === "card";
    await createBooking(parsed, payByCard);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Booking route failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
