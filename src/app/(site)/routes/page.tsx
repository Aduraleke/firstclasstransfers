// app/routes/page.tsx

import Link from "next/link";
import Image from "next/image";
import { ROUTE_DETAILS } from "@/lib/routes";

export default function RoutesIndexPage() {
  // Group by `from` so every origin (airport/city) gets its own section
  const origins = Array.from(new Set(ROUTE_DETAILS.map((r) => r.from)));

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
            cities and resorts. Every fare is per vehicle, with no meter and no
            surprise extras — day and night.
          </p>
        </header>

        {/* SECTIONS BY ORIGIN */}
        <div className="space-y-10">
          {origins.map((origin) => {
            const routesFromOrigin = ROUTE_DETAILS.filter(
              (route) => route.from === origin
            );

            if (routesFromOrigin.length === 0) return null;

            const isAirport = origin.toLowerCase().includes("airport");

            return (
              <section key={origin} className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      From {origin}
                    </p>
                    <p className="text-[13px] text-slate-600">
                      {isAirport
                        ? "Private transfers from this airport to key cities, resorts and cross-border destinations."
                        : "Direct, fixed-price transfers from this location to major airports, cities and resorts in Cyprus."}
                    </p>
                  </div>
                  <p className="text-[12px] text-slate-500">
                    Prices shown are per vehicle, not per person.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {routesFromOrigin.map((route) => (
                    <RouteCard key={route.slug} route={route} />
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

type RouteCardProps = {
  route: (typeof ROUTE_DETAILS)[number];
};

function RouteCard({ route }: RouteCardProps) {
  const description = route.metaDescription || route.body;

  return (
    <Link
      href={`/routes/${route.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-transform hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]"
    >
      {/* IMAGE STRIP */}
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={route.image}
          alt={`${route.from} to ${route.to} transfer`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />

        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-[11px] text-white">
          <span className="inline-flex rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm">
            From {route.from}
          </span>
          <span className="inline-flex rounded-full bg-black/45 px-2 py-0.5 text-[10px] capitalize">
            To {route.to}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
        <h2 className="text-base font-semibold text-slate-900 sm:text-[17px]">
          {route.from} → {route.to}
        </h2>

        <p className="mt-2 line-clamp-3 text-[13px] text-slate-600">
          {description}
        </p>

        {/* PRICES */}
        <div className="mt-4 flex items-center justify-between text-[12px] text-slate-800">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
              Sedan
            </span>
            <span className="font-semibold">{route.sedanPrice}</span>
          </div>
          <div className="h-9 w-px bg-slate-200" />
          <div className="flex flex-col items-end">
            <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
              Mercedes V-Class
            </span>
            <span className="font-semibold">{route.vanPrice}</span>
          </div>
        </div>

        {/* FOOTER ROW */}
        <div className="mt-4 flex items-center justify-between text-[12px] text-slate-500">
          <span className="inline-flex items-center gap-1 capitalize">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Fixed price · private transfer
          </span>
          <span className="inline-flex items-center gap-1 text-slate-600 group-hover:text-slate-900">
            View route
            <span aria-hidden>↗</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
