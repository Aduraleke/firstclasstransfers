import type { Metadata } from "next";
import Booking from "./Booking";

/* =========================================================
   SEO
========================================================= */
export const metadata: Metadata = {
  title: "Book Your Cyprus Airport Transfer",
  description:
    "Get an instant quote and book your Cyprus airport transfer in seconds. Fixed prices, private vehicles, and 24/7 availability.",
  alternates: {
    canonical: "https://firstclasstransfers.eu/booking",
  },
};

/* =========================================================
   TYPES
========================================================= */
type RawSearchParams = Record<string, string | string[] | undefined>;

/* =========================================================
   PAGE
========================================================= */
export default async function BookingPage({
  searchParams,
}: {
  searchParams?: Promise<RawSearchParams>;
}) {
  const sp = (await searchParams) ?? {};

  const rawRouteId = sp.routeId;
  const rawVehicleTypeId = sp.vehicleTypeId;

  const initialRouteId =
    typeof rawRouteId === "string"
      ? decodeURIComponent(rawRouteId)
      : Array.isArray(rawRouteId)
      ? decodeURIComponent(rawRouteId[0] ?? "")
      : "";

  const initialVehicleTypeId =
    typeof rawVehicleTypeId === "string"
      ? decodeURIComponent(rawVehicleTypeId)
      : Array.isArray(rawVehicleTypeId)
      ? decodeURIComponent(rawVehicleTypeId[0] ?? "")
      : "";

  return (
    <Booking
      initialRouteId={initialRouteId}
      initialVehicleTypeId={initialVehicleTypeId}
    />
  );
}
