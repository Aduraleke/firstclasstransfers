export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyOrder } from "@/lib/payments/order-token";


export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const entries = Array.from(form.entries());

    // 🟡 If empty notify (manual test, retries, etc)
    if (entries.length === 0) {
      console.warn("⚠️ Empty myPOS notify payload");
      return new NextResponse("OK", { status: 200 });
    }

    // Extract signature
    const sigEntry = entries.find(([k]) => k === "Signature");
    if (!sigEntry) {
      console.error("❌ Missing Signature");
      return new NextResponse("OK", { status: 200 });
    }

    const signature = sigEntry[1] as string;

    // Remove Signature
    const signedFields = entries.filter(([k]) => k !== "Signature");

    // Build raw string in RECEIVED ORDER
    const raw = signedFields.map(([, v]) => String(v)).join("-");
    const base64 = Buffer.from(raw).toString("base64");

    const isValid = crypto.verify(
      "RSA-SHA256",
      Buffer.from(base64),
      process.env.MYPOS_PUBLIC_CERT!,
      Buffer.from(signature, "base64")
    );

    if (!isValid) {
      console.error("❌ Invalid myPOS signature");
      return new NextResponse("OK", { status: 200 });
    }

    const data = Object.fromEntries(entries) as Record<string, string>;

    // IPC success = Status === "0"
    if (data.Status !== "0") {
      console.warn("⚠️ Payment not successful:", data.Status);
      return new NextResponse("OK", { status: 200 });
    }

    // Verify merchant order token
    const token = data.UDF1;
    if (!token) {
      console.error("❌ Missing UDF1");
      return new NextResponse("OK", { status: 200 });
    }

    const order = verifyOrder(token);
    if (!order) {
      console.error("❌ Invalid order token");
      return new NextResponse("OK", { status: 200 });
    }

    const paidAmount = Number(data.Amount);
    if (paidAmount !== order.amount) {
      console.error("❌ Amount mismatch", paidAmount, order.amount);
      return new NextResponse("OK", { status: 200 });
    }

    // ✅ CONFIRMED PAYMENT
    console.log("✅ PAYMENT CONFIRMED");
    console.log("Order:", order.orderId);
    console.log("Txn:", data.IPC_Trnref);

    // Do async work AFTER responding (queue, webhook, etc)

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("🔥 myPOS notify error:", err);
    // 🚨 NEVER return error to myPOS
    return new NextResponse("OK", { status: 200 });
  }
}
