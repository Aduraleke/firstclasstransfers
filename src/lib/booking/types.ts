// lib/booking/types.ts

export type TimePeriod = "day" | "night";
export type TripType = "one-way" | "return";
export type PaymentMethod = "cash" | "card";

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
  baggageType: string; // id from BAGGAGE_OPTIONS

  // contact
  name: string;
  phone: string;
  email: string;
  notes: string;

  // payment
  paymentMethod: PaymentMethod;
};
