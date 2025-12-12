// lib/pricing.ts
export type VehicleId = "sedan" | "vclass";
export type RouteId =
  | "larnaca_to_nicosia"
  | "paphos_to_limassol"
  | "other_example_route";

type VehiclePrice = {
  vehicleId: VehicleId;
  pricePerLegEUR: number; // integer price in € (no cents)
};

type RoutePricing = {
  id: RouteId;
  from: string;
  to: string;
  vehicleOptions: VehiclePrice[];
  category?: string;
};

export const ROUTE_PRICING: RoutePricing[] = [
  {
    id: "larnaca_to_nicosia",
    from: "Larnaca",
    to: "Nicosia",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: 60 },
      { vehicleId: "vclass", pricePerLegEUR: 90 },
    ],
  },
  {
    id: "paphos_to_limassol",
    from: "Paphos",
    to: "Limassol",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: 75 },
      { vehicleId: "vclass", pricePerLegEUR: 110 },
    ],
  },
  // add the rest...
];

export function computePrice(
  routeId: RouteId,
  vehicleId: VehicleId,
  tripType: "one-way" | "return"
) {
  const route = ROUTE_PRICING.find((r) => r.id === routeId);
  if (!route) throw new Error(`Unknown routeId: ${routeId}`);
  const v = route.vehicleOptions.find((vo) => vo.vehicleId === vehicleId);
  if (!v) throw new Error(`Unknown vehicle ${vehicleId} for route ${routeId}`);

  const legs = tripType === "return" ? 2 : 1;
  const subtotal = v.pricePerLegEUR * legs;
  const discount = tripType === "return" ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;
  return {
    perLeg: v.pricePerLegEUR,
    legs,
    subtotal,
    discount,
    total,
  };
}
