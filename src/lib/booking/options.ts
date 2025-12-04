// lib/booking/options.ts

import { BaggageType, TimePeriod } from "./types";

export type TransferRoute = {
  id: string;
  label: string;
  origin: string;
  destination: string;
  category: "Larnaca" | "Ayia Napa" | "Limassol" | "Paphos" | "Other" | "Special";
};

export type VehicleType = {
  id: string;
  name: string;
  subtitle: string;
  seats: number;
  luggage: string;
  recommendedFor: string;
};

export const TRANSFER_ROUTES: TransferRoute[] = [
  {
    id: "nicosia-lca",
    label: "Nicosia → Larnaca Airport",
    origin: "Nicosia",
    destination: "Larnaca Airport (LCA)",
    category: "Larnaca",
  },
  {
    id: "lca-nicosia",
    label: "Larnaca Airport → Nicosia",
    origin: "Larnaca Airport (LCA)",
    destination: "Nicosia",
    category: "Larnaca",
  },
  {
    id: "nicosia-ayia",
    label: "Nicosia → Ayia Napa",
    origin: "Nicosia",
    destination: "Ayia Napa",
    category: "Ayia Napa",
  },
  {
    id: "ayia-nicosia",
    label: "Ayia Napa → Nicosia",
    origin: "Ayia Napa",
    destination: "Nicosia",
    category: "Ayia Napa",
  },
  {
    id: "nicosia-limassol",
    label: "Nicosia → Limassol",
    origin: "Nicosia",
    destination: "Limassol",
    category: "Limassol",
  },
  {
    id: "nicosia-pfo",
    label: "Nicosia → Paphos Airport",
    origin: "Nicosia",
    destination: "Paphos Airport (PFO)",
    category: "Paphos",
  },
  {
    id: "daily-booking",
    label: "Daily booking · Chauffeur at disposal",
    origin: "Custom",
    destination: "Custom",
    category: "Special",
  },
];

export const VEHICLE_TYPES: VehicleType[] = [
  {
    id: "sedan",
    name: "Premium Sedan",
    subtitle: "Up to 4 passengers",
    seats: 4,
    luggage: "2–3 suitcases + hand luggage",
    recommendedFor: "Couples, solo travellers, business guests",
  },
  {
    id: "minivan",
    name: "Premium Minivan",
    subtitle: "Up to 6 passengers",
    seats: 6,
    luggage: "4–6 suitcases + hand luggage",
    recommendedFor: "Families, small groups, extra luggage",
  },
];

export const TIME_PERIODS: { id: TimePeriod; label: string; range: string }[] = [
  { id: "day", label: "Day", range: "06:00 – 20:30" },
  { id: "night", label: "Night", range: "20:30 – 06:00" },
];

export const BAGGAGE_OPTIONS: { id: BaggageType; label: string; description: string }[] = [
  {
    id: "hand",
    label: "Hand luggage only",
    description: "Cabin bags & backpacks only",
  },
  {
    id: "medium",
    label: "Medium (1–2 suitcases)",
    description: "Ideal for light trips",
  },
  {
    id: "large",
    label: "Large (3–4 suitcases)",
    description: "Perfect for families",
  },
  {
    id: "extra_large",
    label: "Extra large (5+ suitcases)",
    description: "Group or long-stay luggage",
  },
];
