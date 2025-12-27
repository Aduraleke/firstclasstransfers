// lib/booking/types.ts

export type TimePeriod = "day" | "night";
export type TripType = "one-way" | "return";
export type PaymentMethod = "cash" | "card";
export type BaggageType = "hand" | "medium" | "large" | "extra_large";

export const VEHICLE_TYPES = ["sedan", "vclass"] as const;
export type VehicleTypeId = (typeof VEHICLE_TYPES)[number];


export type BookingDraft = {
  // main route
  routeId: string;
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

  // payment
  paymentMethod: PaymentMethod;
};

