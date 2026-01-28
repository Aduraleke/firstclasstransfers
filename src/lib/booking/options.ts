// lib/booking/options.ts

import { ROUTE_DETAILS, type RouteDetail } from "@/lib/routes";
import { BaggageType } from "./types";

export type TransferRouteCategory =
  | "Larnaka"
  | "Ayia Napa"
  | "Limassol"
  | "Paphos"
  | "Special";

export type TransferRoute = {
  id: string; // matches RouteDetail.bookingRouteId or slug
  label: string; // what appears in the select
  category: TransferRouteCategory;
  origin: string; // e.g. "Nicosia"
  destination: string; // e.g. "Larnaka Airport (LCA)"
};

function getCategory(route: RouteDetail): TransferRouteCategory {
  const from = route.from.toLowerCase();
  const to = route.to.toLowerCase();

  if (from.includes("Larnaka") || to.includes("Larnaka")) return "Larnaka";
  if (from.includes("ayia napa") || to.includes("ayia napa")) return "Ayia Napa";
  if (from.includes("limassol") || to.includes("limassol")) return "Limassol";
  if (from.includes("paphos") || to.includes("paphos")) return "Paphos";

  return "Special";
}

export const TRANSFER_ROUTES: TransferRoute[] = ROUTE_DETAILS.map((route) => ({
  id: route.bookingRouteId ?? route.slug,
  label: `${route.from} → ${route.to}`,
  category: getCategory(route),
  origin: route.from,
  destination: route.to,
}));

export const VEHICLE_TYPES = [
  {
    id: "sedan",
    name: "Standard Sedan",
    subtitle: "Up to 4 passengers",
    luggage: "2 large + 2 hand luggage",
    recommendedFor: "Couples, solo travellers, business trips",
  },
  {
    id: "vclass",
    name: "Mercedes V-Class / Minivan",
    subtitle: "Up to 6 passengers",
    luggage: "4 large + 4 hand luggage",
    recommendedFor: "Families, groups, extra luggage",
  },
] as const;

export const TIME_PERIODS = [
  {
    id: "Day Tariff" as const,
    label: "Day Tariff",
    range: "06:00 – 22:00",
  },
  {
    id: "Night Tariff" as const,
    label: "Night Tariff",
    range: "22:00 – 06:00",
  },
];

export const BAGGAGE_OPTIONS: {
  id: BaggageType;
  label: string;
  description: string;
}[] = [
  {
    id: "Hand",
    label: "Hand luggage only",
    description: "Cabin bags & backpacks only",
  },
  {
    id: "Medium",
    label: "Medium (1–2 suitcases)",
    description: "Ideal for light trips",
  },
  {
    id: "Large",
    label: "Large (3–4 suitcases)",
    description: "Perfect for families",
  },
  {
    id: "Extra Large",
    label: "Extra large (5+ suitcases)",
    description: "Group or long-stay luggage",
  },
];
