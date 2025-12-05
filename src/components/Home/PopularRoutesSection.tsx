"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import mapMarkerIcon from "@iconify/icons-mdi/map-marker";
import carIcon from "@iconify/icons-mdi/car-sports";
import arrowRightIcon from "@iconify/icons-mdi/arrow-right";
import airplaneTakeoff from "@iconify/icons-mdi/airplane-takeoff";

const BRAND = {
  primary: "#162c4b",
  accent: "#b07208",
};

type RouteCard = {
  id: string;
  from: "Larnaca Airport" | "Paphos Airport";
  to: string;
  sedanPrice: string;
  vanPrice: string;
  description: string;
  href: string;
  tag?: string;
};

const POPULAR_ROUTES: RouteCard[] = [
  {
    id: "lca-ayia-napa",
    from: "Larnaca Airport",
    to: "Ayia Napa",
    sedanPrice: "€54",
    vanPrice: "€80",
    description:
      "Beach hotels, villas and family resorts across Ayia Napa. No shared shuttles and no meter surprises.",
    href: "/routes/ayia-napa",
    tag: "Most booked",
  },
  {
    id: "lca-protaras",
    from: "Larnaca Airport",
    to: "Protaras",
    sedanPrice: "€59",
    vanPrice: "€90",
    description:
      "Fig Tree Bay, Pernera and all Protaras seafront hotels and apartments.",
    href: "/routes/protaras",
  },
  {
    id: "lca-nicosia",
    from: "Larnaca Airport",
    to: "Nicosia",
    sedanPrice: "€65",
    vanPrice: "€95",
    description:
      "Capital city hotels, embassies, universities and long-stay apartments.",
    href: "/routes/nicosia",
  },
  {
    id: "lca-limassol",
    from: "Larnaca Airport",
    to: "Limassol",
    sedanPrice: "€64",
    vanPrice: "€90",
    description:
      "Limassol Marina, seafront hotels and business district transfers.",
    href: "/routes/limassol",
  },
  {
    id: "lca-paphos",
    from: "Larnaca Airport",
    to: "Paphos",
    sedanPrice: "€110",
    vanPrice: "€140",
    description:
      "Comfortable long-distance transfers to Paphos and Kato Paphos.",
    href: "/routes/paphos",
  },
  {
    id: "pfo-nicosia",
    from: "Paphos Airport",
    to: "Nicosia",
    sedanPrice: "€110",
    vanPrice: "€140",
    description:
      "Direct transfer from PFO to the capital – ideal for business and student stays.",
    href: "/routes/paphos-to-nicosia",
  },
  {
    id: "lca-famagusta",
    from: "Larnaca Airport",
    to: "Famagusta (North Cyprus)",
    sedanPrice: "€95",
    vanPrice: "€125",
    description:
      "Cross-border transfer with checkpoint assistance to Famagusta resorts.",
    href: "/routes/famagusta",
  },
  {
    id: "pfo-limassol",
    from: "Paphos Airport",
    to: "Limassol",
    sedanPrice: "€60",
    vanPrice: "€85",
    description:
      "Fast, fixed-price connection to Limassol city, marina and seafront hotels.",
    href: "/routes/paphos-to-limassol",
  },
];

export default function PopularRoutesSection() {
  return (
    <section className="relative bg-slate-50 py-14 sm:py-16 lg:py-20">
      {/* soft background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(circle at 0% 0%, rgba(22,44,75,0.06), transparent 60%), radial-gradient(circle at 100% 100%, rgba(176,114,8,0.1), transparent 55%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* HEADER */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-2.5 py-1 border border-slate-200 text-[11px] uppercase tracking-[0.2em] text-slate-600">
            <span>Popular airport taxi routes</span>
            <span className="h-0.5 w-5 rounded-full bg-slate-300" />
            <span className="inline-flex items-center gap-1 font-medium text-[10px] text-slate-700">
              <Icon icon={airplaneTakeoff} width={14} height={14} />
              Larnaca &amp; Paphos
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Fixed-price transfers with{" "}
            <span style={{ color: BRAND.accent }}>
              no meter and no surprises
            </span>
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600">
            These are some of our most-booked routes from Larnaca (LCA) and
            Paphos (PFO) Airports. Prices are{" "}
            <span className="font-semibold">per vehicle</span>, day and night,
            for modern sedans (up to 4 passengers) and Mercedes V-Class minivans
            (up to 6 passengers).
          </p>
        </div>

        {/* GRID */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {POPULAR_ROUTES.map((route) => (
            <article
              key={route.id}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.14)] transition-transform"
            >
              {/* top row: from/to + tag */}
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200">
                    <Icon icon={mapMarkerIcon} width={13} height={13} />
                    <span>{route.from}</span>
                  </div>
                  <p className="text-[13px] font-semibold text-slate-900">
                    {route.to}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {route.tag && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-amber-900/90"
                      style={{
                        backgroundColor: "rgba(251,191,36,0.2)",
                        border: "1px solid rgba(245,158,11,0.6)",
                      }}
                    >
                      {route.tag}
                    </span>
                  )}
                  {route.from === "Paphos Airport" && (
                    <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600 border border-slate-200">
                      From Paphos (PFO)
                    </span>
                  )}
                </div>
              </div>

              {/* prices */}
              <div className="mb-3 space-y-1.5 rounded-2xl bg-slate-50 px-3 py-2.5 border border-slate-200">
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 text-slate-700">
                    <Icon icon={carIcon} width={14} height={14} />
                    Sedan · up to 4
                  </span>
                  <span className="font-semibold text-slate-900">
                    {route.sedanPrice}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 text-slate-700">
                    <Icon icon={carIcon} width={14} height={14} />
                    V-Class · up to 6
                  </span>
                  <span className="font-semibold text-slate-900">
                    {route.vanPrice}
                  </span>
                </div>
              </div>

              {/* description */}
              <p className="mb-3 flex-1 text-[12px] leading-relaxed text-slate-600">
                {route.description}
              </p>

              {/* CTA */}
              <Link
                href={route.href}
                className="mt-auto inline-flex items-center gap-1 text-[13px] font-semibold text-slate-900 hover:text-[rgb(22,44,75)]"
              >
                <span>View route details</span>
                <Icon icon={arrowRightIcon} width={15} height={15} />
              </Link>
            </article>
          ))}
        </motion.div>

        {/* LOWER STRIP + PAPHOS/CITIES MINI-BLOCK */}
        <div className="space-y-4 pt-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
            <p className="text-slate-600">
              See all car and minivan fares on our{" "}
              <Link
                href="/pricing"
                className="font-semibold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-[rgba(176,114,8,0.9)]"
              >
                Prices page
              </Link>
              .
            </p>
            <p className="text-[11px] text-slate-500">
              If you don&apos;t see your exact route, you can still request it
              in our booking form.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.10)] px-4 py-5 sm:px-6 sm:py-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl space-y-2">
                {/* headline with icon */}
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:map"
                    className="text-slate-600"
                    width={18}
                    height={18}
                  />
                  <p className="text-base font-semibold text-slate-900">
                    Also operating from Paphos Airport &amp; major cities
                  </p>
                </div>

                {/* supporting text */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  We provide private taxi transfers from Paphos Airport (PFO)
                  and between popular city destinations — including Nicosia,
                  Larnaca, Limassol, Troodos and more.
                </p>

                {/* small trust badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Fixed-price fares",
                    "Cross-city transfers",
                    "24/7 availability",
                  ].map((badge) => (
                    <span
                      key={badge}
                      className="text-[11px] font-medium rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-600"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA button */}
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:-translate-y-px"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.primary})`,
                  boxShadow: "0px 8px 25px rgba(22,44,75,0.22)",
                }}
              >
                <span>View all routes &amp; prices</span>
                <Icon icon={arrowRightIcon} width={16} height={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
