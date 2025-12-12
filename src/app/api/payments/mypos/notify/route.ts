import { NextResponse } from "next/server";
import { verifyMyPOSSignature } from "@/lib/payments/mypos-signature";
import { verifyOrder } from "@/lib/payments/order-token";

export async function POST(req: Request) {
  try {
    // myPOS sends application/x-www-form-urlencoded
    const form = await req.formData();
    const raw = Object.fromEntries(form.entries()) as Record<string, string>;

    // 1️⃣ Verify myPOS signature (FIRST)
    const isValidSignature = verifyMyPOSSignature(raw);
    if (!isValidSignature) {
      console.error("❌ myPOS signature invalid");
      return new NextResponse("INVALID SIGNATURE", { status: 400 });
    }

    // 2️⃣ Extract signed order token (udf1)
    const token = raw.udf1 || raw.UDF1;
    if (!token) {
      console.error("❌ Missing order token");
      return new NextResponse("MISSING ORDER TOKEN", { status: 400 });
    }

    // 3️⃣ Verify order token (NO DB)
    const order = verifyOrder(token);
    if (!order) {
      console.error("❌ Invalid order token");
      return new NextResponse("INVALID ORDER", { status: 400 });
    }

    // 4️⃣ Amount check (myPOS uses Amount)
    const paidAmount = Number(raw.Amount);
    if (!Number.isFinite(paidAmount)) {
      console.error("❌ Invalid amount from myPOS");
      return new NextResponse("INVALID AMOUNT", { status: 400 });
    }

    if (paidAmount !== order.amount) {
      console.error(
        "❌ Amount mismatch",
        paidAmount,
        order.amount
      );
      return new NextResponse("AMOUNT MISMATCH", { status: 400 });
    }

    // 5️⃣ Payment status check (IMPORTANT)
    // myPOS sends IPC_TrnStatus = 1 for success
    if (raw.IPC_TrnStatus !== "1") {
      console.warn("⚠️ Payment not successful", raw.IPC_TrnStatus);
      return new NextResponse("PAYMENT NOT COMPLETED", { status: 200 });
    }

    // ✅ Payment confirmed
    console.log("✅ PAYMENT CONFIRMED");
    console.log("Order ID:", order.orderId);
    console.log("Transaction ref:", raw.IPC_Trnref);

    /**
     * At this point you can:
     * - Send confirmation email
     * - Notify admin
     * - Call external CRM
     * - Log to file / analytics
     */

    // myPOS expects simple OK
    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("🔥 myPOS notify error:", err);
    return new NextResponse("ERROR", { status: 500 });
  }
}
