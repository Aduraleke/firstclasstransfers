// lib/booking/types.ts

export type TimePeriod = "Day Tariff" | "Night Tariff";
export type TripType = "One Way" | "Return";
export type PaymentMethod = "Cash" | "Card";
export type BaggageType = "Hand" | "Medium" | "Large" | "Extra Large";

export const VEHICLE_TYPES = ["sedan", "vclass"] as const;
export type VehicleTypeId = (typeof VEHICLE_TYPES)[number];


export type BookingDraft = {
  // main route  
  routeId: string;     // slug (for UI)
  routeSlug: string;   // UI / URL → nicosia-larnaca-airport-lca

  vehicleTypeId: string;
  timePeriod: TimePeriod;
  date: string; // outbound
  time: string; // outbound

  // return trip
  tripType: TripType;
  returnDate: string;
  returnTime: string;
  returnTimePeriod: TimePeriod;

  // flight / pax / baggage
  flightNumber: string;
  adults: number;
  children: number;
  baggageType: BaggageType; // id from BAGGAGE_OPTIONS

  // contact
  name: string;
  phone: string;
  email: string;
  notes: string;
totalPrice: number
  // payment
  paymentMethod: PaymentMethod;
};

