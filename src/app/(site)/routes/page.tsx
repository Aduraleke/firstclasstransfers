// app/routes/page.tsx

import Link from "next/link";
import Image from "next/image";
import { ROUTE_DETAILS } from "@/lib/routes";

type Route = (typeof ROUTE_DETAILS)[number];

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
            cities and resorts. Every fare is per vehicle, with no surprise
            extras — day and night.
          </p>
        </header>

        {/* SECTIONS BY ORIGIN */}
        <div className="space-y-12">
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

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  route: Route;
};

function RouteCard({ route }: RouteCardProps) {
  const description = route.metaDescription || route.body;

  return (
    <Link
      href={`/routes/${route.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.16)]"
    >
      {/* IMAGE SECTION */}
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
          <span className="inline-flex rounded-full bg-black/55 px-2 py-0.5 backdrop-blur-sm">
            From {route.from}
          </span>
          <span className="inline-flex rounded-full bg-black/45 px-2 py-0.5 text-[10px] capitalize">
            To {route.to}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
        {/* TITLE ROW */}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-slate-900 sm:text-[17px]">
            {route.from} → {route.to}
          </h2>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Private airport transfer · Fixed fare
          </p>
        </div>

        

        {/* DESCRIPTION */}
        <p className="mt-4 line-clamp-3 text-[13px] text-slate-600">
          {description}
        </p>

        {/* PRICE RIBBON – MAIN HERO */}
        <div className="relative mt-3">
          <div className="flex flex-col gap-1 rounded-2xl bg-linear-to-r from-[#b07208] via-[#e0b15a] to-[#b07208] px-4 py-3 shadow-lg shadow-black/15">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#162c4b]">
              Fixed fare · Per vehicle
            </p>

            <div className="flex flex-wrap items-baseline justify-between gap-3 text-[#162c4b]">
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] opacity-80">
                  Sedan
                </span>
                <span className="text-[18px] font-extrabold sm:text-[20px]">
                  {route.sedanPrice}
                </span>
              </div>

              <span className="hidden h-5 w-px bg-white/40 sm:block" />

              <div className="flex items-baseline gap-1">
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] opacity-80">
                  Mercedes V-Class
                </span>
                <span className="text-[18px] font-extrabold sm:text-[20px]">
                  {route.vanPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Subtle "tail" shadow to feel like a ribbon */}
          <div className="absolute inset-x-6 -bottom-2 h-2 rounded-b-2xl bg-[#8b5a03]/70 blur-[3px]" />
        </div>

        {/* FOOTER ROW */}
        <div className="mt-4 flex items-center justify-between text-[12px] text-slate-500">
          <span className="inline-flex items-center gap-1 capitalize">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Private transfer · no hidden fees
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
