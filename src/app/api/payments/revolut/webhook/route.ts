import { NextResponse } from "next/server";
import { verifyRevolutWebhook } from "@/lib/payments/revolut";
import { connectDB } from "@/lib/db/mongo";
import { Booking } from "@/lib/db/models/Booking";

// Track processed webhook events to ensure idempotency
const processedEvents = new Set<string>();

export async function POST(req: Request) {
  const signature = req.headers.get("revolut-signature");
  const body = await req.text();

  // Validate webhook signature
  if (!signature || !verifyRevolutWebhook(body, signature)) {
    console.error("[REVOLUT WEBHOOK] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch (error) {
    console.error("[REVOLUT WEBHOOK] Invalid JSON:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventId = event.id || `${event.event}-${event.timestamp || Date.now()}`;
  
  // Idempotency check - prevent duplicate processing
  if (processedEvents.has(eventId)) {
    console.log(`[REVOLUT WEBHOOK] Event ${eventId} already processed`);
    return NextResponse.json({ received: true, note: "Already processed" });
  }

  console.log("[REVOLUT WEBHOOK] Received event:", event.event, "ID:", eventId);

  // Handle ORDER_COMPLETED event
  if (event.event === "ORDER_COMPLETED") {
    try {
      await connectDB();

      const orderId = event.order?.merchant_order_ext_ref;
      const revolutOrderId = event.order?.id;
      const revolutPublicId = event.order?.public_id;

      if (!orderId) {
        console.error("[REVOLUT WEBHOOK] Missing merchant_order_ext_ref");
        return NextResponse.json({ error: "Missing order reference" }, { status: 400 });
      }

      console.log(`[REVOLUT WEBHOOK] Processing payment for orderId: ${orderId}`);

      // Find and update the booking
      const booking = await Booking.findOneAndUpdate(
        { orderId },
        {
          $set: {
            paymentStatus: "paid",
            revolutOrderId,
            revolutPublicId,
          },
        },
        { new: true }
      );

      if (!booking) {
        console.error(`[REVOLUT WEBHOOK] Booking not found for orderId: ${orderId}`);
        // Still return 200 to acknowledge receipt, but log the error
        return NextResponse.json({ 
          received: true, 
          warning: "Booking not found" 
        });
      }

      console.log(`[REVOLUT WEBHOOK] Successfully marked booking ${orderId} as paid`);

      // Mark event as processed
      processedEvents.add(eventId);

      // TODO: Send confirmation email to customer
      // TODO: Send notification to admin

      return NextResponse.json({ 
        received: true,
        bookingId: booking.orderId,
        status: "updated"
      });

    } catch (error) {
      console.error("[REVOLUT WEBHOOK] Database error:", error);
      // Return 500 so Revolut retries the webhook
      return NextResponse.json({ 
        error: "Internal server error" 
      }, { status: 500 });
    }
  }

  // Handle other events (ORDER_CANCELLED, ORDER_AUTHORISED, etc.)
  console.log(`[REVOLUT WEBHOOK] Event ${event.event} received but not processed`);
  
  return NextResponse.json({ received: true });
}
