"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import airplaneIcon from "@iconify/icons-mdi/airplane";
import mapMarkerIcon from "@iconify/icons-mdi/map-marker";

const BRAND = {
  primary: "#162c4b",
  accent: "#b07208",
};

type DestLink = {
  label: string;
  href: string;
};

const LARNACA_DESTINATIONS: DestLink[] = [
  { label: "Larnaca City & Mackenzie Beach", href: "/routes/larnaca" },
  { label: "Ayia Napa, Nissi Beach & Makronissos", href: "/routes/ayia-napa" },
  { label: "Protaras, Pernera, Paralimni & Kapparis", href: "/routes/protaras" },
  { label: "Nicosia (Lefkosia)", href: "/routes/nicosia" },
  { label: "Limassol & Limassol Marina", href: "/routes/limassol" },
  { label: "Pissouri, Paphos, Coral Bay, Polis & Latchi", href: "/routes/paphos" },
  {
    label: "Kyrenia & Famagusta (selected cross-border routes)",
    href: "/routes/famagusta",
  },
];

const PAPHOS_DESTINATIONS: DestLink[] = [
  { label: "Limassol & Amathus seafront", href: "/routes/limassus" },
  { label: "Nicosia (capital)", href: "/routes/paphos-to-nicosia" },
  { label: "Larnaca City & Larnaca Airport", href: "/routes/larnaca" },
  {
    label: "Ayia Napa, Protaras & Famagusta (long-distance)",
    href: "/routes/ayia-napa",
  },
];

type RegionId = "east" | "west" | "inland" | "crossborder";

type RegionConfig = {
  id: RegionId;
  name: string;
  tag: string;
  description: string;
  image: string;
};

const REGIONS: RegionConfig[] = [
  {
    id: "east",
    name: "East Coast",
    tag: "Ayia Napa · Protaras",
    description:
      "Lively beach resorts, family hotels and villas in Ayia Napa, Protaras, Pernera, Paralimni and Kapparis.",
    image: "/regions/east-coast.jpg", // update with your real asset
  },
  {
    id: "west",
    name: "West & South",
    tag: "Limassol · Paphos · Coral Bay",
    description:
      "Coastal hotels and marinas in Limassol, Limassol Marina, Pissouri, Paphos, Coral Bay, Polis and Latchi.",
    image: "/regions/west-south.jpg",
  },
  {
    id: "inland",
    name: "Inland & Mountains",
    tag: "Nicosia · Troodos",
    description:
      "Transfers to the capital Nicosia (Lefkosia) and Troodos mountain villages on request.",
    image: "/regions/inland-mountains.jpg",
  },
  {
    id: "crossborder",
    name: "Cross-border",
    tag: "Kyrenia · Famagusta",
    description:
      "Selected cross-border routes to Kyrenia and Famagusta, subject to current regulations and checks.",
    image: "/regions/cross-border.jpg",
  },
];

export default function WhereWeOperateSection() {
  const [activeRegion, setActiveRegion] = useState<RegionId>("east");
  const region = REGIONS.find((r) => r.id === activeRegion)!;

  return (
    <section className="relative overflow-hidden bg-[#f5f6fb] py-20 text-slate-900 sm:py-24">
      {/* Background: soft map grid + gradients */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(circle at 0% 0%, rgba(176,114,8,0.12), transparent 55%),
            radial-gradient(circle at 100% 100%, rgba(22,44,75,0.12), transparent 55%),
            linear-gradient(to right, rgba(148,163,184,0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "auto, auto, 80px 80px, 80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-10 max-w-3xl space-y-3">
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
            Where We Operate in Cyprus
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Where We Operate in Cyprus
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            From Larnaca and Paphos Airports we provide fixed-price taxi
            transfers to all major cities and resorts across Cyprus. Whether
            you’re heading east to Ayia Napa and Protaras, west to Limassol and
            Paphos, inland to Nicosia and the Troodos mountains, or across the
            Green Line to Kyrenia and Famagusta (where permitted), we’ve got
            you covered.
          </p>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)] lg:items-center">
          {/* LEFT – region images instead of radar circle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 px-5 py-6 shadow-[0_22px_60px_rgba(15,23,42,0.16)] sm:px-7 sm:py-7">
              {/* Active region image */}
              <div className="relative mb-5 overflow-hidden rounded-2xl">
                <div className="relative h-56 w-full sm:h-64">
                  <Image
                    src={region.image}
                    alt={region.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/30 to-transparent" />

                  <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-200">
                        Operating area
                      </p>
                      <p className="text-lg font-semibold text-white sm:text-xl">
                        {region.name}
                      </p>
                      <p className="text-[11px] text-slate-100/90">
                        {region.tag}
                      </p>
                    </div>
                    <div className="rounded-full bg-black/40 px-3 py-1 text-[11px] text-slate-100 ring-1 ring-white/20">
                      From Larnaca &amp; Paphos
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-slate-700 sm:text-[14px]">
                {region.description}
              </p>

              {/* Region selector with active ring */}
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {REGIONS.map((r) => {
                  const isActive = r.id === activeRegion;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setActiveRegion(r.id)}
                      className={`group relative flex items-start gap-2 rounded-2xl px-3 py-2 text-left text-[12px] transition-shadow ${
                        isActive
                          ? "bg-[rgba(176,114,8,0.06)] shadow-[0_0_0_1px_rgba(176,114,8,0.65)]"
                          : "bg-slate-50 hover:bg-white shadow-[0_0_0_1px_rgba(148,163,184,0.6)] hover:shadow-[0_0_0_1px_rgba(148,163,184,0.9)]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="region-ring"
                          className="pointer-events-none absolute -inset-0.5 rounded-3xl border border-[rgba(176,114,8,0.8)]"
                        />
                      )}
                      <span
                        className={`mt-1 inline-block h-1.5 w-1.5 rounded-full ${
                          isActive
                            ? "bg-[rgba(176,114,8,0.95)]"
                            : "bg-slate-400"
                        }`}
                      />
                      <div className="relative z-10">
                        <p
                          className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
                            isActive ? "text-[rgb(22,44,75)]" : "text-slate-500"
                          }`}
                        >
                          {r.name}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          {r.tag}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-[11px] text-slate-500">
                Tap a region to see a typical area we serve. We also cover many
                smaller villages and resorts nearby.
              </p>
            </div>
          </motion.div>

          {/* RIGHT – intertwined locations: some left, some right (two clean columns) */}
          <div className="space-y-7">
            {/* Larnaca belt */}
            <div className="rounded-3xl border border-slate-200 bg-white/90 px-4 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.08)] sm:px-5 sm:py-6">
              <div className="mb-4 flex items-center gap-2">
                <div
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50"
                  style={{ color: BRAND.primary }}
                >
                  <Icon icon={airplaneIcon} width={18} height={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    From Larnaca Airport (LCA)
                  </span>
                  <p className="text-[12px] text-slate-500">
                    East coast, capital and cross-island routes.
                  </p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {LARNACA_DESTINATIONS.map((d, idx) => (
                  <Link
                    key={d.label}
                    href={d.href}
                    className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] text-slate-700 transition-colors hover:border-[rgba(176,114,8,0.8)] hover:bg-white hover:text-[rgb(22,44,75)] ${
                      idx % 2 === 0 ? "justify-start" : "sm:justify-end"
                    }`}
                  >
                    <Icon icon={mapMarkerIcon} width={14} height={14} />
                    <span className="line-clamp-1">{d.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Paphos belt */}
            <div className="rounded-3xl border border-slate-200 bg-white/90 px-4 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.08)] sm:px-5 sm:py-6">
              <div className="mb-4 flex items-center gap-2">
                <div
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50"
                  style={{ color: BRAND.primary }}
                >
                  <Icon icon={airplaneIcon} width={18} height={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    From Paphos Airport (PFO)
                  </span>
                  <p className="text-[12px] text-slate-500">
                    West coast, Limassol, capital and long-distance east routes.
                  </p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {PAPHOS_DESTINATIONS.map((d, idx) => (
                  <Link
                    key={d.label}
                    href={d.href}
                    className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] text-slate-700 transition-colors hover:border-[rgba(176,114,8,0.8)] hover:bg-white hover:text-[rgb(22,44,75)] ${
                      idx % 2 === 0 ? "justify-start" : "sm:justify-end"
                    }`}
                  >
                    <Icon icon={mapMarkerIcon} width={14} height={14} />
                    <span className="line-clamp-1">{d.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <p className="text-[12px] text-slate-500">
              Each destination name links to a detailed route page with pricing
              and typical journey times.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
