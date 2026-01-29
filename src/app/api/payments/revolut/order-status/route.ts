import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongo";
import { Booking } from "@/lib/db/models/Booking";

// Production-only Revolut API base URL
const BASE_URL = "https://merchant.revolut.com";
const API_VERSION = "2025-12-04";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

type Params = {
  searchParams: { orderId?: string };
};

/**
 * GET /api/payments/revolut/order-status?orderId=BKG-xxx
 * 
 * Fetches the current payment status for a booking from both:
 * 1. Local database
 * 2. Revolut API (if Revolut order ID is available)
 * 
 * Used for admin reconciliation and manual status checks.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId query parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const booking = await Booking.findOne({ orderId }).lean();

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const response: {
      orderId: string;
      paymentStatus: string;
      paymentMethod: string;
      expectedAmount: number;
      currency: string;
      revolutOrderId?: string;
      revolutStatus?: string;
      revolutPublicId?: string;
    } = {
      orderId: booking.orderId,
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      expectedAmount: booking.expectedAmount,
      currency: booking.currency,
    };

    // If we have a Revolut order ID, fetch the status from Revolut
    if (booking.revolutOrderId) {
      try {
        const revolutRes = await fetch(
          `${BASE_URL}/api/orders/${booking.revolutOrderId}`,
          {
            headers: {
              Authorization: `Bearer ${requireEnv("REVOLUT_SECRET_KEY")}`,
              "Revolut-Api-Version": API_VERSION,
            },
          }
        );

        if (revolutRes.ok) {
          const revolutOrder = await revolutRes.json();
          response.revolutOrderId = booking.revolutOrderId;
          response.revolutStatus = revolutOrder.state;
          response.revolutPublicId = revolutOrder.public_id;
        } else {
          console.error(
            `[ORDER STATUS] Failed to fetch Revolut order: ${revolutRes.status}`
          );
        }
      } catch (error) {
        console.error("[ORDER STATUS] Error fetching from Revolut:", error);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("[ORDER STATUS] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
