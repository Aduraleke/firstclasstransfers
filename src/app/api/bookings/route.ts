export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BookingBaseSchema, type BookingBase } from "@/lib/booking/schema";
import { computePrice } from "@/lib/pricing";
// nodemailer implementation
import { sendBookingEmail } from "@/lib/email/nodemailer";

/* ---------- myPOS helper types (unchanged) ---------- */
type MyPOSCartItem = { name: string; quantity: number; price: number };
type MyPOSCustomer = {
  email?: string;
  firstNames?: string;
  familyName?: string;
  phone?: string;
  country?: string;
};

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
  headers?: Record<string, string>;
};

type MyPOSInstance = {
  checkout: {
    purchase: (params: MyPOSPurchaseParams, res: MyPOSFakeResponse) => void;
  };
  [k: string]: unknown;
};

type MyPOSFactoryFn = (cfg: { [k: string]: unknown }) => MyPOSInstance;

async function loadMyPOSFactoryDynamic(): Promise<unknown> {
  try {
    const mod = await import("@mypos-ltd/mypos");
    return (mod && (mod.default ?? mod)) as unknown;
  } catch (err) {
    throw new Error(`Failed to load myPOS SDK: ${(err as Error).message}`);
  }
}

function buildMyPOSConfigFromEnv(): { [k: string]: unknown } {
  const sid = process.env.MYPOS_SID;
  const clientNumber = process.env.MYPOS_CLIENT_NUMBER;
  const privateKey = process.env.MYPOS_PRIVATE_KEY;

  const missing: string[] = [];
  if (!sid) missing.push("MYPOS_SID");
  if (!clientNumber) missing.push("MYPOS_CLIENT_NUMBER");
  if (!privateKey) missing.push("MYPOS_PRIVATE_KEY");

  if (missing.length) {
    throw new Error(`Missing myPOS config env vars: ${missing.join(", ")}`);
  }

  return {
    isSandbox: (process.env.MYPOS_IS_SANDBOX ?? "true") === "true",
    logLevel: "error",
    checkout: {
      sid,
      lang: "EN",
      currency: process.env.MYPOS_CURRENCY ?? "EUR",
      clientNumber,
      okUrl: process.env.MYPOS_OK_URL ?? "",
      cancelUrl: process.env.MYPOS_CANCEL_URL ?? "",
      notifyUtr: process.env.MYPOS_NOTIFY_URL ?? "",
      keyIndex: Number(process.env.MYPOS_KEY_INDEX ?? 1),
      privateKey,
    },
  };
}

/* ---------- helpers ---------- */
function escapeHtml(s: unknown) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

type ComputePriceRouteId = Parameters<typeof computePrice>[0];
type ComputePriceVehicleTypeId = Parameters<typeof computePrice>[1];

function devOnly(obj: unknown) {
  return process.env.NODE_ENV === "development" ? obj : undefined;
}


/* ---------- POST handler ---------- */
export async function POST(req: NextRequest) {
  const start = Date.now();
  const ip = getClientIp(req);
  try {
    const recent = cleanUpIp(ip);
    if (recent.length >= RATE_LIMIT_MAX) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
    recent.push(Date.now());
    ipMap.set(ip, recent);

    // Accept JSON or form POST
    const contentType = (req.headers.get("content-type") || "").toLowerCase();
    let raw: unknown;
    if (contentType.includes("application/json")) {
      raw = await req.json();
    } else {
      const fd = await req.formData();
      raw = Object.fromEntries(fd.entries());
      const maybe = raw as Record<string, unknown>;
      if (typeof maybe.adults === "string") maybe.adults = Number(maybe.adults);
      if (typeof maybe.children === "string") maybe.children = Number(maybe.children);
      raw = maybe;
    }


    // Validate request — return 400 with zod errors if invalid
    let parsed: BookingBase;
    try {
      parsed = BookingBaseSchema.parse(raw) as BookingBase;
    } catch (zerr) {
      console.error("Validation failed for booking:", zerr);
      return NextResponse.json(
        { error: "Invalid booking payload", },
        { status: 400 },
      );
    }

    // compute price server-side — wrap this so we return 400 on unknown route/vehicle instead of 500
    const routeIdStr = String(parsed.routeId);
    const vehicleTypeIdStr = String(parsed.vehicleTypeId);

    let price;
    try {
      price = computePrice(
        routeIdStr as unknown as ComputePriceRouteId,
        vehicleTypeIdStr as unknown as ComputePriceVehicleTypeId,
        parsed.tripType,
      );
    } catch (priceErr) {
      // If computePrice throws (e.g. Unknown route or vehicle), treat it as a bad request.
      console.error("Price computation failed:", priceErr);
      return NextResponse.json(
        {
          error: "Invalid route or vehicle selection",
          message: (priceErr instanceof Error) ? priceErr.message : String(priceErr),
          details: devOnly(priceErr instanceof Error ? priceErr.stack : String(priceErr)),
        },
        { status: 400 },
      );
    }

    // build email content
    const subject = `Booking request ${routeIdStr} — ${parsed.date}`;
    const html = `<h2>New booking</h2>
      <p><strong>Name:</strong> ${escapeHtml(parsed.name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(parsed.phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(parsed.email)}</p>
      <p><strong>Route:</strong> ${escapeHtml(routeIdStr)}</p>
      <p><strong>Vehicle:</strong> ${escapeHtml(vehicleTypeIdStr)}</p>
      <p><strong>Date/Time:</strong> ${escapeHtml(parsed.date)} ${escapeHtml(parsed.time)}</p>
      <p><strong>Trip type:</strong> ${escapeHtml(parsed.tripType)}</p>
      <p><strong>Passengers:</strong> Adults ${escapeHtml(String(parsed.adults))} Children ${escapeHtml(String(parsed.children || 0))}</p>
      <p><strong>Price (EUR):</strong> ${escapeHtml(String(price.total))}</p>
      <p><strong>Notes:</strong> ${escapeHtml(parsed.notes || "")}</p>
    `;
    const text = `New booking
Name: ${parsed.name}
Phone: ${parsed.phone}
Email: ${parsed.email}
Route: ${routeIdStr}
Vehicle: ${vehicleTypeIdStr}
Date/Time: ${parsed.date} ${parsed.time}
Trip type: ${parsed.tripType}
Passengers: Adults ${parsed.adults} Children ${parsed.children || 0}
Price (EUR): ${price.total}
Notes: ${parsed.notes || ""}
IP: ${ip}
`;

    // ---- Before sending email: explicit guard for SMTP env presence ----
    const smtpMissing = !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS;
    if (smtpMissing) {
      console.error("SMTP env missing; cannot send booking email. Env presence:", {
        SMTP_HOST: !!process.env.SMTP_HOST,
        SMTP_USER: !!process.env.SMTP_USER,
        SMTP_PASS: !!process.env.SMTP_PASS,
      });
      // Return a 502 and a clear message in development — don't leak secrets
      return NextResponse.json(
        {
          error: "Email delivery unavailable",
          details: devOnly("Missing SMTP env variables (SMTP_HOST/SMTP_USER/SMTP_PASS)"),
        },
        { status: 502 },
      );
    }

    try {
      const bookingEmail = process.env.BOOKING_EMAIL || "booking@firstclasstransfers.eu";
      const info = await sendBookingEmail({
        to: bookingEmail,
        subject,
        text,
        html,
      });

      const messageId = (info as { messageId?: string } | null)?.messageId ?? null;

      // If pay handoff is NOT requested, return JSON success
      const url = new URL(req.url);
      const pay = url.searchParams.get("pay") === "true";
      if (!pay) {
        console.info(`Booking accepted route=${routeIdStr} ip=${ip} ms=${Date.now() - start}`);
        return NextResponse.json({ ok: true, price, messageId });
      }

      // pay requested -> myPOS flow
      let maybeFactory: unknown;
      try {
        maybeFactory = await loadMyPOSFactoryDynamic();
      } catch (err) {
        console.error("myPOS dynamic load error:", err);
        return NextResponse.json(
          { error: "Payment gateway load failed", details: devOnly((err as Error).message) },
          { status: 500 },
        );
      }

      if (typeof maybeFactory !== "function") {
        console.error("myPOS factory not found or not a function", maybeFactory);
        return NextResponse.json({ error: "Payment gateway unavailable" }, { status: 500 });
      }
      const myposFactory = maybeFactory as MyPOSFactoryFn;

      const cfg = buildMyPOSConfigFromEnv();
      const mypos = myposFactory(cfg);

      const amount = Number(price.total);
      const orderId = `BKG-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

      const purchaseParams: MyPOSPurchaseParams = {
        orderId,
        amount,
        cartItems: [{ name: `${routeIdStr} transfer`, quantity: 1, price: amount }],
        customer: {
          email: parsed.email,
          firstNames: parsed.name.split(" ")[0] || parsed.name,
          familyName: parsed.name.split(" ").slice(1).join(" ") || "",
          phone: parsed.phone,
          country: "CYP",
        },
        note: `Booking ${orderId}`,
      };

      const chunks: Buffer[] = [];
      const fakeRes: MyPOSFakeResponse = {
        write(chunk: string | Buffer) {
          if (typeof chunk === "string") chunks.push(Buffer.from(chunk, "utf8"));
          else chunks.push(chunk);
        },
        end(chunk?: string | Buffer) {
          if (chunk) this.write(chunk);
        },
        setHeader() {
          /* no-op */
        },
        getHeader() {
          return undefined;
        },
      };

      await new Promise<void>((resolve, reject) => {
        try {
          mypos.checkout.purchase(purchaseParams, fakeRes);
          setTimeout(() => resolve(), 10);
        } catch (err) {
          reject(err);
        }
      });

      const htmlOut = Buffer.concat(chunks).toString("utf8");
      return new NextResponse(htmlOut, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (mailErr) {
      console.error("Failed to send booking email:", mailErr);
      // Provide a developer-visible detail when in dev, otherwise a simple message
      return NextResponse.json(
        {
          error: "Failed to send booking notification email",
        },
        { status: 502 },
      );
    }
  } catch (err: unknown) {
    // Top-level error handler: log full stack and return 500 with dev-only details
    console.error("booking route error (full):", err);
    
    if (err instanceof Error) {
      console.error(err.stack);
    }
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
