// lib/booking/schema.ts
import { z } from "zod";

export const BookingBaseSchema = z.object({
  routeId: z.string().min(1),
  vehicleTypeId: z.string().min(1),
  tripType: z.enum(["one-way", "return"]).default("one-way"),
  date: z.string().min(1), // ISO date expected
  time: z.string().min(1), // "HH:MM"
  returnDate: z.string().optional().nullable().or(z.literal("")),
  returnTime: z.string().optional().nullable().or(z.literal("")),
  timePeriod: z.enum(["day", "night"]).default("day"),
  returnTimePeriod: z.enum(["day", "night"]).default("day"),

  // pax / baggage
  flightNumber: z.string().optional().nullable().or(z.literal("")),
  adults: z.number().int().min(1),
  children: z.number().int().min(0).optional().default(0),
  baggageType: z.enum(["hand", "medium", "large", "extra_large"]),

  // contact
  name: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email(),
  notes: z.string().optional().nullable().or(z.literal("")),

  // payment
  paymentMethod: z.enum(["cash", "card"]).default("cash"),
});

export type BookingBase = z.infer<typeof BookingBaseSchema>;
