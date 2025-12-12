import { NextResponse } from "next/server";
import { verifyMyPOSSignature } from "@/lib/payments/mypos-signature";
import { verifyOrder } from "@/lib/payments/order-token";

export async function POST(req: Request) {
  const form = await req.formData();
  const data = Object.fromEntries(form.entries()) as Record<string, string>;

  if (!verifyMyPOSSignature(data)) {
    return new NextResponse("INVALID SIGNATURE", { status: 400 });
  }

  const token = data.udf1;
  const order = token ? verifyOrder(token) : null;
  if (!order) {
    return new NextResponse("INVALID ORDER", { status: 400 });
  }

  if (Number(data.amount) !== order.amount) {
    return new NextResponse("AMOUNT MISMATCH", { status: 400 });
  }

  console.log("✅ PAYMENT CONFIRMED:", order.orderId);

  return NextResponse.json({ ok: true });
}
