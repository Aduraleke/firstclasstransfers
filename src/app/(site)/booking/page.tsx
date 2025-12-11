// app/(site)/booking/page.tsx

import type { Metadata } from "next";
import Booking from "./Booking";

export const metadata: Metadata = {
  title: "Book Your Cyprus Airport Transfer",
  description:
    "Get an instant quote and book your Cyprus airport transfer in seconds. Fixed prices from Larnaca and Paphos Airports with sedans and Mercedes V-Class minivans.",
  alternates: {
    canonical: "https://firstclasstransfers.eu/booking",
  },
};

type BookingPageProps = {
  searchParams?: {
    routeId?: string | string[];
  };
};

export default function BookingPage({ searchParams }: BookingPageProps) {
  const rawRoute = searchParams?.routeId;

  const initialRouteId =
    typeof rawRoute === "string"
      ? decodeURIComponent(rawRoute)
      : Array.isArray(rawRoute)
      ? decodeURIComponent(rawRoute[0] ?? "")
      : "";

  return <Booking initialRouteId={initialRouteId} />;
}
