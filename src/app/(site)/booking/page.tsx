import type { Metadata } from "next";
import Booking from "./Booking";

export const metadata: Metadata = {
  title: "Book Your Cyprus Airport Transfer",
  description:
    "Get an instant quote and book your Cyprus airport transfer in seconds.",
  alternates: {
    canonical: "https://firstclasstransfers.eu/booking",
  },
};

type RawSearchParams = Record<string, string | string[] | undefined>;

export default async function BookingPage({ searchParams }: { searchParams?: RawSearchParams | Promise<RawSearchParams>; }) {
  const sp = (await searchParams) ?? {};
  const rawRoute = sp.routeId;
  const rawVehicle = sp.vehicleTypeId;

  const initialRouteId =
    typeof rawRoute === "string"
      ? decodeURIComponent(rawRoute)
      : Array.isArray(rawRoute)
      ? decodeURIComponent(rawRoute[0] ?? "")
      : "";

  const initialVehicleTypeId =
    typeof rawVehicle === "string"
      ? decodeURIComponent(rawVehicle)
      : Array.isArray(rawVehicle)
      ? decodeURIComponent(rawVehicle[0] ?? "")
      : "";

  return (
    <Booking
      initialRouteId={initialRouteId}
      initialVehicleTypeId={initialVehicleTypeId}
    />
  );
}
