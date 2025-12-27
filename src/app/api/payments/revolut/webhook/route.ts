import { NextResponse } from "next/server";
import { verifyRevolutWebhook } from "@/lib/payments/revolut";

export async function POST(req: Request) {
  const signature = req.headers.get("revolut-signature");
  const body = await req.text();

  if (!signature || !verifyRevolutWebhook(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "ORDER_COMPLETED") {

    // 🔒 TODO:
    // - mark booking as PAID
    // - update DB
    // - send confirmation email
  }

  return NextResponse.json({ received: true });
}
