// lib/pricing.ts

export type VehicleId = "sedan" | "vclass";

/**
 * RouteId = EXACT slug from ROUTE_DETAILS
 * Example: "nicosia-Larnaka-airport"
 */
export type RouteId =
  | "nicosia-Larnaka-airport"
  | "nicosia-limassol"
  | "nicosia-test-destination"
  |"nicosia-troodos"
  | "nicosia-paphos-airport"
  | "nicosia-ercan-airport"
  | "paphos-airport-nicosia"
  | "paphos-airport-limassol"
  | "paphos-airport-Larnaka"
  | "paphos-airport-ayia-napa"
  | "paphos-airport-ercan-airport"
  | "Larnaka-airport-famagusta"
  | "Larnaka-airport-kyrenia"
  | "Larnaka-airport-limassol"
  | "Larnaka-airport-nicosia"
  | "Larnaka-airport-paphos"
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
    id: "nicosia-Larnaka-airport",
    from: "Nicosia",
    to: "Larnaka Airport",
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
    id: "nicosia-troodos",
    from: "Nicosia",
    to: "Troodos",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€80") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€110") },
    ],
  },
  {
  id: "nicosia-test-destination",
  from: "Nicosia",
  to: "Test Destination",
  vehicleOptions: [
    { vehicleId: "sedan", pricePerLegEUR: toNum("€1") },
    { vehicleId: "vclass", pricePerLegEUR: toNum("€1") },
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
    id: "paphos-airport-Larnaka",
    from: "Paphos Airport",
    to: "Larnaka",
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
    id: "Larnaka-airport-famagusta",
    from: "Larnaka Airport",
    to: "Famagusta",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€90") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€110") },
    ],
  },
  {
    id: "Larnaka-airport-kyrenia",
    from: "Larnaka Airport",
    to: "Kyrenia",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€120") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€160") },
    ],
  },
  {
    id: "Larnaka-airport-limassol",
    from: "Larnaka Airport",
    to: "Limassol",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€70") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€95") },
    ],
  },
  {
    id: "Larnaka-airport-nicosia",
    from: "Larnaka Airport",
    to: "Nicosia",
    vehicleOptions: [
      { vehicleId: "sedan", pricePerLegEUR: toNum("€55") },
      { vehicleId: "vclass", pricePerLegEUR: toNum("€80") },
    ],
  },
  {
    id: "Larnaka-airport-paphos",
    from: "Larnaka Airport",
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

// ---------------------------------------------------------
// Strict price calculator for payments (throws on error)
// ---------------------------------------------------------
export function computePriceOrThrow(params: {
  routeId: RouteId;
  vehicleTypeId: VehicleId;
  tripType: "one-way" | "return";
}): number {
  const result = computePrice(
    params.routeId,
    params.vehicleTypeId,
    params.tripType
  );

  if (!result || !Number.isFinite(result.total)) {
    throw new Error("Failed to compute price");
  }

  return result.total;
}
