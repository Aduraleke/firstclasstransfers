// lib/booking/types.ts

export type TimePeriod = "day" | "night";
export type BaggageType = "hand" | "medium" | "large" | "extra_large";

export type BookingDraft = {
  routeId: string;
  vehicleTypeId: string;
  timePeriod: TimePeriod;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  flightNumber: string;
  adults: number;
  children: number;
  baggageType: BaggageType;
  name: string;
  phone: string;
  email: string;
  notes: string;
};
