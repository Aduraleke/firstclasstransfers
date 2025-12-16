"use client";

import { useEffect } from "react";

type Props = {
  orderId: string;
  amount: number;
  currency: string;
};

export default function SuccessClient({ orderId, amount, currency }: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const key = `meta_purchase_${orderId}`;
    if (sessionStorage.getItem(key)) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "purchase",
      bookingValue: amount,
      currency,
      paymentMethod: "card",
      orderId,
    });

    sessionStorage.setItem(key, "1");
  }, [orderId, amount, currency]);

  return (
    <div className="pt-32 text-center">
      <h1 className="text-2xl font-bold">Payment Successful 🎉</h1>
      <p className="mt-2">
        Thank you. Your transfer is confirmed.
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Order reference: {orderId}
      </p>
    </div>
  );
}
