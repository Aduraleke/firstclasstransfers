// lib/pricing.ts

export type VehicleId = "sedan" | "vclass";

/**
 * RouteId = EXACT slug from ROUTE_DETAILS
 * Example: "nicosia-larnaca-airport"
 */
export type RouteId =
  | "nicosia-larnaca-airport"
  | "nicosia-limassol"
  | "nicosia-paphos-airport"
  | "nicosia-ercan-airport"
  | "paphos-airport-nicosia"
  | "paphos-airport-limassol"
  | "paphos-airport-larnaca"
  | "paphos-airport-ayia-napa"
  | "paphos-airport-ercan-airport"
  | "larnaca-airport-famagusta"
  | "larnaca-airport-kyrenia"
  | "larnaca-airport-limassol"
  | "larnaca-airport-nicosia"
  | "larnaca-airport-paphos"
  | "limassol-ercan-airport"
  | "limassol-nicosia"
  | "limassol-paphos-airport"
  | "limassol-paphos"
  | "limassol-troodos";

export type VehiclePrice = {
  vehicleId: VehicleId;
  pricePerLegEUR: number; // integer €
};

export type RoutePricing = {
  id: RouteId;
  from: string;
  to: string;
  vehicleOptions: VehiclePrice[];
  category?: string;
};

// Helper to strip "€" and convert to number
const toNum = (price: string) => Number(price.replace("€", "").trim());

// ---------------------------------------------------------
// ROUTE_PRICING (generated from ROUTE_DETAILS — Option A)
// ---------------------------------------------------------
export const ROUTE_PRICING: RoutePricing[] = [
  {
    id: "nicosia-larnaca-airport",
    from: "Nicosia",
    to: "Larnaca Airport",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€55") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€80") },
    ],
  },
  {
    id: "nicosia-limassol",
    from: "Nicosia",
    to: "Limassol",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€75") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€100") },
    ],
  },
  {
    id: "nicosia-paphos-airport",
    from: "Nicosia",
    to: "Paphos Airport",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€135") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€190") },
    ],
  },
  {
    id: "nicosia-ercan-airport",
    from: "Nicosia",
    to: "Ercan Airport",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€80") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€110") },
    ],
  },
  {
    id: "paphos-airport-nicosia",
    from: "Paphos Airport",
    to: "Nicosia",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€135") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€190") },
    ],
  },
  {
    id: "paphos-airport-limassol",
    from: "Paphos Airport",
    to: "Limassol",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€70") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€95") },
    ],
  },
  {
    id: "paphos-airport-larnaca",
    from: "Paphos Airport",
    to: "Larnaca",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€135") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€175") },
    ],
  },
  {
    id: "paphos-airport-ayia-napa",
    from: "Paphos Airport",
    to: "Ayia Napa",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€170") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€200") },
    ],
  },
  {
    id: "paphos-airport-ercan-airport",
    from: "Paphos Airport",
    to: "Ercan Airport",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€190") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€230") },
    ],
  },
  {
    id: "larnaca-airport-famagusta",
    from: "Larnaca Airport",
    to: "Famagusta",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€90") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€110") },
    ],
  },
  {
    id: "larnaca-airport-kyrenia",
    from: "Larnaca Airport",
    to: "Kyrenia",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€120") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€160") },
    ],
  },
  {
    id: "larnaca-airport-limassol",
    from: "Larnaca Airport",
    to: "Limassol",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€70") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€95") },
    ],
  },
  {
    id: "larnaca-airport-nicosia",
    from: "Larnaca Airport",
    to: "Nicosia",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€55") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€80") },
    ],
  },
  {
    id: "larnaca-airport-paphos",
    from: "Larnaca Airport",
    to: "Paphos",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€130") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€175") },
    ],
  },
  {
    id: "limassol-ercan-airport",
    from: "Limassol",
    to: "Ercan Airport",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€130") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€170") },
    ],
  },
  {
    id: "limassol-nicosia",
    from: "Limassol",
    to: "Nicosia",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€75") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€100") },
    ],
  },
  {
    id: "limassol-paphos-airport",
    from: "Limassol",
    to: "Paphos Airport",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€70") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€95") },
    ],
  },
  {
    id: "limassol-paphos",
    from: "Limassol",
    to: "Paphos",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€85") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€100") },
    ],
  },
  {
    id: "limassol-troodos",
    from: "Limassol",
    to: "Troodos",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€45") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€95") },
    ],
  },
];

// ---------------------------------------------------------
// Price calculator (unchanged)
// ---------------------------------------------------------
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
