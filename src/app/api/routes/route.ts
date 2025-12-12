import type { RoutePricing, VehiclePrice } from "@/lib/pricing";
import { ROUTE_PRICING } from "@/lib/pricing";
import { NextResponse } from "next/server";

type RouteSummary = {
  id: string;
  title: string;
  description?: string;
  vehicleOptions?: Array<{ vehicleId: string; label?: string; seats?: number }>;
};

export async function GET() {
  try {
    const list: RouteSummary[] = ROUTE_PRICING.map((r: RoutePricing) => ({
      id: r.id,
      title: r.id, // ROUTE_PRICING does not contain title/name fields
      description: undefined, // ROUTE_PRICING does not contain descriptions
      vehicleOptions: r.vehicleOptions.map((vo: VehiclePrice) => ({
        vehicleId: vo.vehicleId,
        label: vo.vehicleId,
        seats: undefined, // your pricing file doesn't define seat counts
      })),
    }));

    return NextResponse.json({ ok: true, routes: list });
  } catch (err) {
    console.error("Failed to return routes list:", err);
    return NextResponse.json({ ok: false, error: "Failed to fetch routes" }, { status: 500 });
  }
}
