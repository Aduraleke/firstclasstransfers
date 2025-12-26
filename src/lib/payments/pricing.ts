import { getRouteDetailBySlug } from "@/lib/routes";

export function computePriceOrThrow(params: {
  routeId: string;
  vehicleTypeId: "sedan" | "vclass";
  tripType: "one-way" | "return";
}): number {
  const route = getRouteDetailBySlug(params.routeId);
  if (!route) throw new Error("Invalid route");

  const idx = params.vehicleTypeId === "sedan" ? 0 : 1;
  const priceStr = route.vehicleOptions[idx]?.fixedPrice;
  if (!priceStr) throw new Error("Price not found");

  const base = Number(priceStr.replace(/[^\d.]/g, ""));
  if (Number.isNaN(base)) throw new Error("Invalid price");

  // 🔥 NO DISCOUNT — return trip = double price
  const legs = params.tripType === "return" ? 2 : 1;
  const total = base * legs;

  return Math.round(total);
}
