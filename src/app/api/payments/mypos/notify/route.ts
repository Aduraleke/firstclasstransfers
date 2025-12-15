import { NextResponse } from "next/server";
import { verifyMyPOSSignature } from "@/lib/payments/mypos-signature";
import { verifyOrder } from "@/lib/payments/order-token";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const data = Object.fromEntries(form.entries()) as Record<string, string>;

    // 1️⃣ Verify myPOS signature
    if (!verifyMyPOSSignature(data)) {
      console.error("❌ Invalid myPOS signature");
      return new NextResponse("INVALID SIGNATURE", { status: 400 });
    }

    // 2️⃣ Check success (IPC standard)
    if (data.Status !== "0") {
      console.warn("⚠️ Payment not successful:", data.Status);
      return new NextResponse("OK", { status: 200 });
    }

    // 3️⃣ Verify order token
    const token = data.UDF1;
    if (!token) {
      console.error("❌ Missing UDF1");
      return new NextResponse("MISSING ORDER", { status: 400 });
    }

    const order = verifyOrder(token);
    if (!order) {
      console.error("❌ Invalid order token");
      return new NextResponse("INVALID ORDER", { status: 400 });
    }

    // 4️⃣ Amount check
    const paidAmount = Number(data.Amount);
    if (paidAmount !== order.amount) {
      console.error("❌ Amount mismatch", paidAmount, order.amount);
      return new NextResponse("AMOUNT MISMATCH", { status: 400 });
    }

    // ✅ CONFIRMED PAYMENT
    console.log("✅ PAYMENT CONFIRMED");
    console.log("Order:", order.orderId);
    console.log("Txn:", data.IPC_Trnref);

    /**
     * Do your business logic here:
     * - save booking
     * - send email
     * - notify admin
     */

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("🔥 myPOS notify error:", err);
    return new NextResponse("ERROR", { status: 500 });
  }
}
