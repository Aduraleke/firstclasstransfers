import { verifyOrderToken } from "@/lib/payments/order-token";
import { notFound } from "next/navigation";
import SuccessClient from "./SuccessClient";

type Props = {
  searchParams?: { token?: string };
};

export default async function SuccessPage({ searchParams }: Props) {
  const token = searchParams?.token;
  if (!token) notFound();

  const payload = verifyOrderToken(token);
  if (!payload) notFound();

  // ⛔ OPTIONAL BUT STRONGLY RECOMMENDED
  // Verify orderId with payment provider / database here

  return (
    <SuccessClient
      orderId={payload.orderId}
      amount={payload.amount}
      currency={payload.currency}
    />
  );
}
