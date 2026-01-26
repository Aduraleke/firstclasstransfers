import { z } from "zod";
import type { RouteId, VehicleId } from "@/lib/pricing";

/**
 * Keep these lists in sync with pricing config
 * This gives you:
 * - runtime validation
 * - compile-time safety
 */

export const ROUTE_IDS = [
  "Larnaka-airport-nicosia",
  "Larnaka-airport-limassol",
  "Larnaka-airport-paphos",
  "paphos-airport-nicosia",
  "paphos-airport-limassol",
  // add all supported routes here
] as const satisfies readonly RouteId[];

export const VEHICLE_IDS = ["sedan", "vclass"] as const satisfies readonly VehicleId[];

export const RouteIdSchema = z.enum(ROUTE_IDS);
export const VehicleIdSchema = z.enum(VEHICLE_IDS);
