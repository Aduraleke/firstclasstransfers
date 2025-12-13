"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import mapMarkerIcon from "@iconify/icons-mdi/map-marker";
import carIcon from "@iconify/icons-mdi/car-sports";
import arrowRightIcon from "@iconify/icons-mdi/arrow-right";
import airplaneTakeoff from "@iconify/icons-mdi/airplane-takeoff";

// 🔑 Import your shared route data
import { ROUTE_DETAILS, RouteDetailSlug, RouteDetail } from "@/lib/routes";

const BRAND = {
  primary: "#162c4b",
  accent: "#b07208",
};

type RouteCard = {
  id: RouteDetailSlug;
  from: string;
  to: string;
  sedanPrice: string;
  vanPrice: string;
  description: string;
  href: string;
  tag?: string;
  image: string;
};

// Pick which detailed routes to feature in the slider
const POPULAR_ROUTE_SLUGS: RouteDetailSlug[] = [
  "larnaca-airport-nicosia",
  "larnaca-airport-limassol",
  "larnaca-airport-paphos",
  "paphos-airport-nicosia",
  "paphos-airport-limassol",
  "paphos-airport-larnaca",
  "limassol-nicosia",
  "limassol-paphos",
  "nicosia-larnaca-airport",
  "nicosia-limassol",
  "nicosia-paphos-airport",
  "larnaca-airport-famagusta",
];


const POPULAR_ROUTE_TAGS: Partial<Record<RouteDetailSlug, string>> = {
  "larnaca-airport-nicosia": "Most booked",
  "larnaca-airport-limassol": "Business favourite",
  "limassol-paphos": "Coastal favourite",
};

// Small helper for card text
function buildDescription(route: RouteDetail): string {
  const base =
    route.metaDescription ||
    route.body.split("\n\n")[0] ||
    `${route.from} to ${route.to} – fixed-price private transfer.`;

  return base.length <= 180 ? base : base.slice(0, 177) + "…";
}

// ✅ Build POPULAR_ROUTES without nulls
const POPULAR_ROUTES: RouteCard[] = POPULAR_ROUTE_SLUGS.reduce<RouteCard[]>(
  (acc, slug) => {
    const route = ROUTE_DETAILS.find((r) => r.slug === slug);
    if (!route) return acc;

    acc.push({
      id: route.slug,
      from: route.from,
      to: route.to,
      sedanPrice: route.sedanPrice,
      vanPrice: route.vanPrice,
      description: buildDescription(route),
      href: `/routes/${route.slug}`,
      tag: POPULAR_ROUTE_TAGS[route.slug],
      image: route.image,
    });

    return acc;
  },
  []
);

export default function PopularRoutesShowcase() {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setActiveIndex(0), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeIndex < 0) return;
    const interval = setInterval(
      () => setActiveIndex((prev) => (prev + 1) % POPULAR_ROUTES.length),
      7000
    );
    return () => clearInterval(interval);
  }, [activeIndex]);

  const active = activeIndex >= 0 ? POPULAR_ROUTES[activeIndex] : null;

  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 mb-4 border border-slate-200 shadow-sm">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              <Icon
                icon={airplaneTakeoff}
                width={16}
                height={16}
                className="text-slate-500"
              />
              Popular airport taxi routes
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-3 capitalize">
            Fixed-price transfers with{" "}
            <span style={{ color: BRAND.accent }}>no surprises</span>
          </h2>
          <p className="text-sm sm:text-[15px] max-w-2xl mx-auto text-slate-600">
            Our most-booked routes between Larnaca, Paphos, Limassol and
            Nicosia. Prices are{" "}
            <span className="font-semibold text-slate-900">per vehicle</span>,
            day and night, for modern sedans (up to 4 passengers) and minivans
            (up to 6 passengers).
          </p>
        </div>

        {/* Hero / Image card */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/70 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
          {/* ⬇️ TALLER ON MOBILE SO PRICE RIBBON FITS FULLY */}
          <div className="relative h-[520px] sm:h-[560px] md:h-auto md:aspect-video">
            <AnimatePresence mode="wait">
              {activeIndex === -1 ? (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-tr from-slate-900 via-slate-800 to-slate-600"
                >
                  <Icon
                    icon={airplaneTakeoff}
                    width={42}
                    height={42}
                    className="mb-4 text-slate-100"
                  />
                  <h3 className="text-2xl md:text-3xl font-semibold text-slate-50 mb-2">
                    Browse our most popular routes
                  </h3>
                  <p className="text-sm md:text-base text-slate-200 max-w-md text-center">
                    From coastal resorts to capital city stays – choose a
                    destination below to preview fares and details.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={active?.id}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  {/* Background image */}
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.04 }}
                    transition={{
                      duration: 7,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={active?.image || ""}
                      alt={`${active?.from} to ${active?.to}`}
                      fill
                      priority
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/55 to-black/20" />

                  {/* Content overlay */}
                  <div className="relative z-10 h-full flex flex-col justify-between px-5 sm:px-7 md:px-9 py-4 sm:py-6 md:py-8">
                    {/* top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 border border-white/15">
                          <Icon
                            icon={mapMarkerIcon}
                            width={16}
                            height={16}
                            className="text-slate-100"
                          />
                          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-100">
                            From {active?.from}
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                          {active?.to}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {active?.tag && (
                          <span
                            className="rounded-full px-3 py-1 text-[11px] font-semibold text-amber-900 shadow-lg"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(250,204,21,0.98), rgba(180,126,8,0.98))",
                              boxShadow: "0 10px 30px rgba(15,23,42,0.55)",
                            }}
                          >
                            {active.tag}
                          </span>
                        )}
                        <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] text-slate-100 border border-white/10">
                          Private transfer · Fixed fare
                        </span>
                      </div>
                    </div>

                    {/* middle: description & prices */}
                    <div className="grid gap-4 mt-4 md:mt-2 md:grid-cols-[minmax(0,2.1fr)_minmax(0,1.4fr)]">
                      <div className="space-y-2 max-w-xl">
                        {/* 🔻 HIDE DESCRIPTION ON MOBILE TO GIVE ROOM TO PRICE */}
                        <p className="hidden sm:block text-[13px] md:text-sm text-slate-100 leading-relaxed">
                          {active?.description}
                        </p>
                        {/* 🔻 HIDE BADGES ON MOBILE */}
                        <div className="hidden sm:flex flex-wrap gap-2">
                          {[
                            "Meet & greet or door pickup",
                            "Flight-safe planning",
                            "24/7 local support",
                          ].map((badge) => (
                            <span
                              key={badge}
                              className="text-[11px] font-medium rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-slate-100"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 🔶 PRICE BLOCK – BOTH PRICES EQUAL, BRAND COLOURS */}
                      <div className="justify-self-end max-w-xs w-full">
                        <div className="rounded-3xl border border-white/18 bg-black/65 px-4 py-4 backdrop-blur-md shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-200 text-center mb-2">
                            Fixed price per vehicle
                          </p>

                          <div className="space-y-2.5">
                            {/* Sedan ribbon */}
                            <div className="relative overflow-hidden rounded-2xl border border-slate-900/60">
                              <div
                                className="absolute inset-0 opacity-95"
                                style={{
                                  background: `linear-gradient(135deg, ${BRAND.accent}, #facc6b)`,
                                }}
                              />
                              {/* subtle navy edge */}
                              <div className="relative px-3.5 py-3 flex items-center justify-between gap-3">
                                <div className="flex flex-col">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-900/90">
                                    <Icon
                                      icon={carIcon}
                                      width={13}
                                      height={13}
                                      className="text-slate-900/90"
                                    />
                                    Sedan · up to 4
                                  </span>
                                  <span className="mt-0.5 text-[11px] text-slate-900/80">
                                    from
                                  </span>
                                </div>
                                <div className="text-right leading-none">
                                  <div className="text-2xl md:text-[26px] font-extrabold text-slate-900">
                                    {active?.sedanPrice}
                                  </div>
                                  <div className="mt-0.5 text-[11px] text-slate-900/85">
                                    per trip
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* V-Class ribbon */}
                            <div className="relative overflow-hidden rounded-2xl border border-slate-900/60">
                              <div
                                className="absolute inset-0 opacity-95"
                                style={{
                                  background: `linear-gradient(135deg, ${BRAND.primary}, #1f3b6b)`,
                                }}
                              />
                              <div className="relative px-3.5 py-3 flex items-center justify-between gap-3">
                                <div className="flex flex-col">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-50">
                                    <Icon
                                      icon={carIcon}
                                      width={13}
                                      height={13}
                                      className="text-slate-50"
                                    />
                                    V-Class · up to 6
                                  </span>
                                  <span className="mt-0.5 text-[11px] text-slate-100/90">
                                    from
                                  </span>
                                </div>
                                <div className="text-right leading-none">
                                  <div className="text-2xl md:text-[26px] font-extrabold text-slate-50">
                                    {active?.vanPrice}
                                  </div>
                                  <div className="mt-0.5 text-[11px] text-slate-100/90">
                                    per trip
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Link
                            href={active?.href || "#"}
                            className="mt-3 inline-flex items-center justify-center gap-1.5 w-full rounded-full px-4 py-2.5 text-[12px] font-semibold text-slate-900 bg-white hover:bg-slate-100 transition"
                          >
                            <span>View full route &amp; book</span>
                            <Icon
                              icon={arrowRightIcon}
                              width={14}
                              height={14}
                            />
                          </Link>

                          <p className="mt-1.5 text-[10px] text-slate-200/90 text-center">
                            All fares are per vehicle and include airport
                            charges, VAT and normal waiting time.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* bottom note */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-200">
                      <p>
                        From{" "}
                        <span className="font-semibold text-slate-50">
                          {active?.from}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold text-slate-50">
                          {active?.to}
                        </span>{" "}
                        — your fare is confirmed before pick-up.
                      </p>
                      <p className="hidden sm:block opacity-85">
                        Don&apos;t see your exact hotel? Add it in the booking
                        form and we&apos;ll confirm the route.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-7 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <p className="text-xs sm:text-sm text-slate-600">
              Hover a destination to preview, click to open the full route page.
            </p>
            <Link
              href="/routes"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-slate-900"
            >
              <span>View all routes</span>
              <Icon icon={arrowRightIcon} width={14} height={14} />
            </Link>
          </div>

          {/* Equal-width responsive tabs: grid auto-fit gives balanced columns that wrap */}
          <div
            className="w-full grid gap-3"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            }}
          >
            {POPULAR_ROUTES.map((route, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={route.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onFocus={() => setActiveIndex(idx)}
                  onClick={() => router.push(route.href)}
                  className={[
                    // ensure each button fills its grid cell and has consistent height
                    "relative w-full h-full flex flex-col justify-between rounded-2xl px-3 py-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400",
                  ].join(" ")}
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.primary})`
                      : "white",
                    border: isActive
                      ? "1px solid rgba(15,23,42,0.12)"
                      : "1px solid rgba(148,163,184,0.55)",
                    boxShadow: isActive
                      ? "0 10px 30px rgba(15,23,42,0.19)"
                      : "0 4px 18px rgba(15,23,42,0.08)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      icon={mapMarkerIcon}
                      width={14}
                      height={14}
                      className={isActive ? "text-slate-50" : "text-slate-500"}
                    />
                    <span
                      className="text-[11px] font-semibold uppercase tracking-[0.14em] truncate"
                      style={{
                        color: isActive ? "#f9fafb" : "#475569",
                      }}
                    >
                      {route.from}
                    </span>
                  </div>

                  <div
                    className="text-[13px] font-semibold leading-snug wrap-break-word"
                    style={{ color: isActive ? "#f9fafb" : "#0f172a" }}
                  >
                    {route.to}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span
                      className="truncate"
                      style={{ color: isActive ? "#fefce8" : "#64748b" }}
                    >
                      Sedan {route.sedanPrice}
                    </span>
                    <span
                      className="truncate"
                      style={{ color: isActive ? "#fefce8" : "#64748b" }}
                    >
                      V-Class {route.vanPrice}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
