// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BookingBaseSchema, type BookingBase } from "@/lib/booking/schema";
import { computePrice } from "@/lib/pricing";
import { sendBookingEmail } from "./nodemailer";

/**
 * Local, minimal types for the myPOS SDK surface we use.
 * We define them here to avoid importing types from an untyped external module.
 */
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

/**
 * Rename the factory type to avoid collisions with potential ambient namespaces
 * from the SDK. Keep the config shape loosely typed so we don't tightly couple.
 */
type MyPOSFactoryFn = (cfg: { [k: string]: unknown }) => MyPOSInstance;

/**
 * Dynamically import myPOS SDK and return the factory (unknown at compile time).
 * We intentionally keep the import result as unknown and assert to MyPOSFactoryFn
 * only after a runtime check that it's a function.
 */
async function loadMyPOSFactoryDynamic(): Promise<unknown> {
  const mod = await import("@mypos-ltd/mypos");
  // prefer default export, else module itself
  return (mod && (mod.default ?? mod)) as unknown;
}

/**
 * Build the minimal checkout config object shape expected by the SDK.
 * Keep it typed loosely (unknown properties allowed), but ensure required fields exist.
 */
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

/* ---------- booking route implementation ---------- */

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

/**
 * Derive the parameter types expected by computePrice so we can satisfy the
 * compiler without importing internal types from the pricing module.
 */
type ComputePriceRouteId = Parameters<typeof computePrice>[0];
type ComputePriceVehicleTypeId = Parameters<typeof computePrice>[1];

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
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

    // Validate request (zod will throw if invalid)
    const parsed = BookingBaseSchema.parse(raw) as BookingBase;

    // compute price server-side (important!)
    // convert to strings (or numbers if your computePrice expects numeric IDs),
    // then cast to the parameter types derived above so TypeScript is happy.
    const routeIdStr = String(parsed.routeId);
    const vehicleTypeIdStr = String(parsed.vehicleTypeId);

    const price = computePrice(
      routeIdStr as unknown as ComputePriceRouteId,
      vehicleTypeIdStr as unknown as ComputePriceVehicleTypeId,
      parsed.tripType,
    );

    // send booking email to dispatch
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

    await sendBookingEmail({
      to: process.env.BOOKING_EMAIL || "booking@firstclasstransfers.eu",
      subject,
      text,
      html,
    });

    // If pay handoff is requested (form submit or client asked redirect), perform myPOS flow
    const url = new URL(req.url);
    const pay = url.searchParams.get("pay") === "true";

    if (!pay) {
      return NextResponse.json({ ok: true, price });
    }

    // Load dynamic SDK and assert factory to our local typed MyPOSFactoryFn
    const maybeFactory = await loadMyPOSFactoryDynamic();
    if (typeof maybeFactory !== "function") {
      console.error("myPOS factory not found or not a function", maybeFactory);
      return NextResponse.json({ error: "Payment gateway unavailable" }, { status: 500 });
    }
    const myposFactory = maybeFactory as MyPOSFactoryFn;

    // build config from env and instantiate SDK
    const cfg = buildMyPOSConfigFromEnv();
    const mypos = myposFactory(cfg);

    const amount = Number(price.total); // ensure numeric
    const orderId = `BKG-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

    const purchaseParams: MyPOSPurchaseParams = {
      orderId,
      amount,
      cartItems: [
        {
          name: `${routeIdStr} transfer`,
          quantity: 1,
          price: amount,
        },
      ],
      customer: {
        email: parsed.email,
        firstNames: parsed.name.split(" ")[0] || parsed.name,
        familyName: parsed.name.split(" ").slice(1).join(" ") || "",
        phone: parsed.phone,
        country: "CYP",
      },
      note: `Booking ${orderId}`,
    };

    // capture HTML the SDK writes by giving it a fake response object
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
        // no-op, but kept for SDK compatibility
      },
      getHeader() {
        return undefined;
      },
    };

    // Call the SDK purchase (the SDK writes HTML into the fake response)
    await new Promise<void>((resolve, reject) => {
      try {
        mypos.checkout.purchase(purchaseParams, fakeRes);
        // small delay to let writes finish (SDKs sometimes write asynchronously)
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
  } catch (err: unknown) {
    console.error("booking route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
