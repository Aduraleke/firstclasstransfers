// app/routes/page.tsx

import type { Metadata } from "next";
import { fetchAllRoutes } from "@/lib/api/routes";
import RouteCard from "./RouteCard";

export const metadata: Metadata = {
  title: "Cyprus Taxi Routes | Fixed-Price Airport & City Transfers",
  description:
    "Browse all fixed-price private taxi routes across Cyprus. Airport, city and resort transfers with no hidden fees, per-vehicle pricing and 24/7 availability.",
  alternates: {
    canonical: "https://firstclasstransfers.eu/routes",
  },
};

export default async function RoutesIndexPage() {
  // ✅ FETCH FROM BACKEND (SERVER-SIDE, ISR)
  const routes = await fetchAllRoutes();

  // ✅ GROUP BY ORIGIN (fromLocation)
  const origins = Array.from(
    new Set(routes.map((r) => r.fromLocation))
  );

  return (
    <main className="bg-[#f5f7fb]">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* HEADER */}
        <header className="mb-10 mt-24 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
            <span>Taxi Routes</span>
            <span className="h-px w-6 bg-slate-300" />
            <span className="font-extrabold text-slate-700">
              Airports · Cities · Resorts
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Fixed-Price Taxi Routes Across Cyprus
          </h1>

          <p className="max-w-2xl text-sm text-slate-600 sm:text-[15px]">
            Browse all our fixed-price private transfers between airports,
            cities and resorts. Every fare is per vehicle, with no surprise
            extras — day and night.
          </p>
        </header>

        {/* SECTIONS BY ORIGIN */}
        <div className="space-y-12">
          {origins.map((origin) => {
            const routesFromOrigin = routes.filter(
              (route) => route.fromLocation === origin
            );

            if (routesFromOrigin.length === 0) return null;

            const isAirport = origin
              .toLowerCase()
              .includes("airport");

            return (
              <section key={origin} className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      From {origin}
                    </p>
                    <p className="text-[13px] text-slate-600">
                      {isAirport
                        ? "Private transfers from this airport to key cities, resorts and cross-island destinations."
                        : "Direct, fixed-price transfers from this location to major airports, cities and resorts in Cyprus."}
                    </p>
                  </div>
                  <p className="text-[12px] text-slate-500">
                    Prices shown are per vehicle, not per person.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {routesFromOrigin.map((route) => (
                    <RouteCard
                      key={route.slug}
                      route={route}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
