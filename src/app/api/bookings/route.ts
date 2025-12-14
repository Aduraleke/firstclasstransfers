export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BookingBaseSchema, type BookingBase } from "@/lib/booking/schema";
import { computePrice } from "@/lib/pricing";

// Email sender
import { sendEmail } from "@/lib/email/nodemailer";

// Email templates
import {
  customerCashConfirmed,
  customerCardPending,
  officeCashBooking,
  officeCardPending,
} from "@/lib/email/templates";

/* ---------- myPOS helper types (unchanged) ---------- */
type MyPOSCartItem = { name: string; quantity: number; price: number };
type MyPOSCustomer = {
  email?: string;
  firstNames?: string;
  familyName?: string;
  phone?: string;
  country?: string;
};
type ComputePriceRouteId = Parameters<typeof computePrice>[0];
type ComputePriceVehicleTypeId = Parameters<typeof computePrice>[1];

type MyPOSPurchaseParams = {
  orderId: string;
  amount: number;
  cartItems: MyPOSCartItem[];
  customer?: MyPOSCustomer;
  note?: string;
  [k: string]: unknown;
};

type MyPOSFakeResponse = {
  write: (chunk: string | Buffer) => void;
  end: (chunk?: string | Buffer) => void;
  setHeader?: (name: string, value: string) => void;
  getHeader?: (name: string) => string | undefined;
};

type MyPOSInstance = {
  checkout: {
    purchase: (params: MyPOSPurchaseParams, res: MyPOSFakeResponse) => void;
  };
};

type MyPOSFactoryFn = (cfg: { [k: string]: unknown }) => MyPOSInstance;

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
    // Rate limiting
    const recent = cleanUpIp(ip);
    if (recent.length >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
    recent.push(Date.now());

    // Read request
    const contentType = (req.headers.get("content-type") || "").toLowerCase();
    const raw = contentType.includes("application/json")
      ? await req.json()
      : Object.fromEntries((await req.formData()).entries());

    // Validate booking
    let parsed: BookingBase;
    try {
      parsed = BookingBaseSchema.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Invalid booking payload" },
        { status: 400 }
      );
    }

    // Compute price
    let price;
    try {
      const routeId = parsed.routeId as unknown as ComputePriceRouteId;
      const vehicleTypeId =
        parsed.vehicleTypeId as unknown as ComputePriceVehicleTypeId;

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
    const pay = url.searchParams.get("pay") === "true";

    /* ============================
       EMAILS (ALWAYS SENT)
    ============================ */

    if (!pay) {
      // CASH BOOKING
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

    // CARD BOOKING (PAYMENT PENDING)
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
       myPOS REDIRECT
    ============================ */

    const mod = await import("@mypos-ltd/mypos");
    const myposFactory = (mod.default ?? mod) as MyPOSFactoryFn;

    const mypos = myposFactory({
      checkout: {
        sid: process.env.MYPOS_SID,
        currency: "EUR",
        clientNumber: process.env.MYPOS_CLIENT_NUMBER,
        privateKey: process.env.MYPOS_PRIVATE_KEY,
      },
    });

    const orderId = `BKG-${Date.now()}`;
    const amount = Number(price.total);

    const chunks: Buffer[] = [];
    mypos.checkout.purchase(
      {
        orderId,
        amount,
        cartItems: [
          { name: `${parsed.routeId} transfer`, quantity: 1, price: amount },
        ],
        customer: {
          email: parsed.email,
          firstNames: parsed.name.split(" ")[0],
          familyName: parsed.name.split(" ").slice(1).join(" "),
          phone: parsed.phone,
          country: "CYP",
        },
      },
      {
        write(chunk) {
          chunks.push(Buffer.from(chunk));
        },
        end(chunk) {
          if (chunk) chunks.push(Buffer.from(chunk));
        },
      }
    );

    return new NextResponse(Buffer.concat(chunks).toString("utf8"), {
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
