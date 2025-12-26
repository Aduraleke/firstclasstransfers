import { z } from "zod";
import { VEHICLE_TYPES } from "@/lib/booking/types";

export const BookingBaseSchema = z
  .object({
    routeId: z.string().min(1),
    vehicleTypeId: z.enum(VEHICLE_TYPES),

    tripType: z.enum(["one-way", "return"]).default("one-way"),

    // outbound
    date: z.string().min(1),
    time: z.string().min(1),
    timePeriod: z.enum(["day", "night"]).default("day"),

    // return
    returnDate: z.string().optional().nullable().or(z.literal("")),
    returnTime: z.string().optional().nullable().or(z.literal("")),
    returnTimePeriod: z.enum(["day", "night"]).optional(),

    // pax / baggage
    flightNumber: z.string().min(1, "Flight number is required"),
    adults: z.number().int().min(1),
    children: z.number().int().min(0).default(0),
    baggageType: z.enum(["hand", "medium", "large", "extra_large"]),

    // contact
    name: z.string().min(1),
    phone: z.string().min(6),
    email: z.string().email(),
    notes: z.string().optional().nullable().or(z.literal("")),

    // payment
    paymentMethod: z.enum(["cash", "card"]).default("cash"),
  })
  .refine(
    (data) =>
      data.tripType === "one-way" ||
      (Boolean(data.returnDate) &&
        Boolean(data.returnTime) &&
        Boolean(data.returnTimePeriod)),
    {
      message: "Return date, time and time period are required for return trips",
      path: ["returnDate"],
    }
  );

export type BookingBase = z.infer<typeof BookingBaseSchema>;
