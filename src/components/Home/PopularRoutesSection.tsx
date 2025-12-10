"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import mapMarkerIcon from "@iconify/icons-mdi/map-marker";
import carIcon from "@iconify/icons-mdi/car-sports";
import arrowRightIcon from "@iconify/icons-mdi/arrow-right";
import airplaneTakeoff from "@iconify/icons-mdi/airplane-takeoff";

// 🔑 Import your shared route data
import {
  ROUTE_DETAILS,
  RouteDetailSlug,
  RouteDetail,
} from "@/lib/routes";

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

// Build POPULAR_ROUTES without nulls
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
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-white">
      {/* soft subtle background accents */}
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
            day and night, for modern sedans and minivans.
          </p>
        </div>

        {/* Hero / Image card */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/70 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
          {/* 👇 This wrapper controls height: flexible on mobile, fixed on desktop */}
          <div className="relative min-h-[480px] sm:min-h-[500px] md:h-[520px]">
            <AnimatePresence mode="wait">
              {activeIndex === -1 ? (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.7 }}
                  className="relative flex items-center justify-center min-h-[480px] sm:min-h-[500px] md:h-[520px]"
                >
                  <div className="absolute inset-0 bg-linear-to-tr from-slate-900 via-slate-800 to-slate-600" />
                  <div className="relative z-10 flex flex-col items-center text-center px-6">
                    <Icon
                      icon={airplaneTakeoff}
                      width={42}
                      height={42}
                      className="mb-4 text-slate-100"
                    />
                    <h3 className="text-2xl md:text-3xl font-semibold text-slate-50 mb-2">
                      Browse our most popular routes
                    </h3>
                    <p className="text-sm md:text-base text-slate-200 max-w-md">
                      From coastal resorts to capital city stays – choose a
                      destination below to preview fares and details.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={active?.id}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  className="relative min-h-[480px] sm:min-h-[500px] md:h-[520px]"
                >
                  {/* Background image + gradient */}
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
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/65 to-black/20" />

                  {/* CONTENT – flex, fills height on desktop, can grow on mobile */}
                  <div className="relative z-10 flex flex-col gap-5 md:gap-6 px-5 sm:px-7 md:px-9 py-5 sm:py-6 md:py-8 h-full">
                    <div className="flex-1 flex flex-col md:flex-row gap-5 md:gap-8">
                      {/* LEFT: Route info */}
                      <div className="flex-1 flex flex-col gap-4 justify-between">
                        <div className="space-y-3">
                          <div className="inline-flex flex-wrap items-center gap-2">
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
                            {active?.tag && (
                              <span
                                className="rounded-full px-3 py-1 text-[11px] font-semibold text-amber-900 shadow-lg"
                                style={{
                                  background:
                                    "linear-gradient(135deg, rgba(251,191,36,0.98), rgba(245,158,11,0.96))",
                                  boxShadow:
                                    "0 10px 30px rgba(245,158,11,0.6)",
                                }}
                              >
                                {active.tag}
                              </span>
                            )}
                          </div>

                          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                            {active?.to}
                          </h3>
                        </div>

                        <div className="space-y-2 max-w-xl">
                          <p className="text-[13px] sm:text-sm text-slate-100 leading-relaxed line-clamp-3 md:line-clamp-none">
                            {active?.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {[
                              "Private transfer · no meter",
                              "Flight tracking & pickup",
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
                      </div>

                      {/* RIGHT: Prices – BOTH equal importance */}
                      <div className="w-full md:max-w-sm">
                        <div className="rounded-2xl border border-white/18 bg-black/80 px-4 py-4 sm:py-5 shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-md flex flex-col gap-4">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
                              Fixed fare · Airport taxi
                            </span>
                            <span className="rounded-full bg-emerald-500/15 border border-emerald-400/40 text-[10px] font-medium text-emerald-100 px-2 py-0.5">
                              Price per vehicle
                            </span>
                          </div>

                          {/* Two equal price columns */}
                          <div className="grid grid-cols-2 gap-3">
                            {/* Sedan */}
                            <div className="rounded-xl border border-white/15 bg-black/60 px-3 py-3 flex flex-col gap-1">
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-200">
                                <Icon
                                  icon={carIcon}
                                  width={15}
                                  height={15}
                                  className="text-slate-100"
                                />
                                Sedan · up to 4
                              </span>
                              <motion.div
                                key={active?.id + "-sedan"}
                                className="text-xl sm:text-2xl font-semibold text-slate-50 leading-none"
                                animate={{ scale: [1, 1.06, 1] }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              >
                                {active?.sedanPrice}
                              </motion.div>
                            </div>

                            {/* V-Class */}
                            <div className="rounded-xl border border-white/15 bg-black/60 px-3 py-3 flex flex-col gap-1">
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-200">
                                <Icon
                                  icon={carIcon}
                                  width={15}
                                  height={15}
                                  className="text-slate-100"
                                />
                                V-Class · up to 6
                              </span>
                              <motion.div
                                key={active?.id + "-van"}
                                className="text-xl sm:text-2xl font-semibold text-slate-50 leading-none"
                                animate={{ scale: [1, 1.06, 1] }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 0.2,
                                }}
                              >
                                {active?.vanPrice}
                              </motion.div>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-200">
                            Day &amp; night · airport charges and taxes
                            included.
                          </p>

                          <Link
                            href={active?.href || "#"}
                            className="inline-flex items-center justify-center gap-1.5 w-full rounded-full px-4 py-2.5 text-[12px] font-semibold text-slate-900 bg-white hover:bg-slate-100 transition"
                          >
                            <span>View route details &amp; book</span>
                            <Icon
                              icon={arrowRightIcon}
                              width={14}
                              height={14}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Bottom note */}
                    <div className="text-[11px] text-slate-200 flex flex-wrap items-center gap-2">
                      <p>
                        From{" "}
                        <span className="font-semibold text-slate-50">
                          {active?.from}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold text-slate-50">
                          {active?.to}
                        </span>{" "}
                        — fare confirmed before pick-up.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tabs: compact strip, only locations */}
        <div className="mt-7 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <p className="text-xs sm:text-sm text-slate-600">
              Choose a route to preview and go to the booking page.
            </p>
            <Link
              href="/routes"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-slate-900"
            >
              <span>View all routes</span>
              <Icon icon={arrowRightIcon} width={14} height={14} />
            </Link>
          </div>

          <div className="relative">
            {/* Soft gradient edges on mobile */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden pointer-events-none">
              <div className="w-6 h-10 bg-linear-to-r from-white via-white/80 to-transparent" />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center sm:hidden pointer-events-none">
              <div className="w-6 h-10 bg-linear-to-l from-white via-white/80 to-transparent" />
            </div>

            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1.5 -mx-1 px-1 sm:px-7">
              {POPULAR_ROUTES.map((route, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <Link
                    key={route.id}
                    href={route.href}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onFocus={() => setActiveIndex(idx)}
                    className="relative min-w-[130px] sm:min-w-[150px] rounded-2xl px-3 py-2 text-left transition-all focus:outline-none no-underline"
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.primary})`
                        : "white",
                      border: isActive
                        ? "1px solid rgba(15,23,42,0.12)"
                        : "1px solid rgba(148,163,184,0.45)",
                      boxShadow: isActive
                        ? "0 8px 24px rgba(15,23,42,0.16)"
                        : "0 3px 12px rgba(15,23,42,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Icon
                        icon={mapMarkerIcon}
                        width={13}
                        height={13}
                        className={
                          isActive ? "text-slate-50" : "text-slate-500"
                        }
                      />
                      <span
                        className="text-[10px] font-semibold uppercase tracking-[0.16em]"
                        style={{
                          color: isActive ? "#f9fafb" : "#64748b",
                        }}
                      >
                        {route.from}
                      </span>
                    </div>
                    <div
                      className="text-[12px] font-semibold line-clamp-1"
                      style={{ color: isActive ? "#f9fafb" : "#0f172a" }}
                    >
                      {route.to}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
