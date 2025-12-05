"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import airplaneIcon from "@iconify/icons-mdi/airplane";
import mapMarkerIcon from "@iconify/icons-mdi/map-marker";
import compassIcon from "@iconify/icons-mdi/compass";

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
  { label: "Limassol & Amathus seafront", href: "/routes/limassol" },
  { label: "Nicosia (capital)", href: "/routes/paphos-to-nicosia" },
  { label: "Larnaca City & Larnaca Airport", href: "/routes/larnaca" },
  {
    label: "Ayia Napa, Protaras & Famagusta (long-distance)",
    href: "/routes/ayia-napa",
  },
];

export default function WhereWeOperateSection() {
  return (
    <section className="relative bg-[#f5f6fb] text-slate-900 py-20 sm:py-24 overflow-hidden">
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
        <div className="max-w-3xl space-y-3 mb-10">
          <p className="uppercase tracking-[0.25em] text-[11px] text-slate-500">
            Where We Operate in Cyprus
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
            Where We Operate in Cyprus
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
            From Larnaca and Paphos Airports we provide fixed-price taxi transfers
            to all major cities and resorts across Cyprus. Whether you’re heading
            east to Ayia Napa and Protaras, west to Limassol and Paphos, inland to
            Nicosia and the Troodos mountains, or across the Green Line to Kyrenia
            and Famagusta (where permitted), we’ve got you covered.
          </p>
        </div>

        {/* MAIN LAYOUT: Map card + belts */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)] lg:items-center">
          {/* LEFT: “map” / radar card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            <div className="relative rounded-4xl border border-slate-200 bg-white/90 shadow-[0_22px_60px_rgba(15,23,42,0.16)] px-5 py-6 sm:px-7 sm:py-7 overflow-hidden">
              {/* inner “island radar” circle */}
              <div className="relative flex items-center justify-center py-6">
                <div
                  className="relative h-52 w-52 sm:h-60 sm:w-60 rounded-full border border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.16)]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 20%, rgba(22,44,75,0.18), transparent 55%), radial-gradient(circle at 70% 80%, rgba(176,114,8,0.22), transparent 55%)",
                  }}
                >
                  {/* radar rings */}
                  <div className="absolute inset-6 rounded-full border border-slate-200/70" />
                  <div className="absolute inset-11 rounded-full border border-slate-200/40" />
                  <div className="absolute inset-16 rounded-full border border-slate-200/30" />

                  {/* Larnaca marker */}
                  <div className="absolute left-[20%] top-[40%] flex flex-col items-center gap-1">
                    <span className="inline-flex h-2 w-2 rounded-full bg-[rgba(176,114,8,0.95)] shadow-[0_0_10px_rgba(176,114,8,0.8)]" />
                    <span className="text-[10px] font-semibold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded-full border border-slate-200">
                      Larnaca (LCA)
                    </span>
                  </div>

                  {/* Paphos marker */}
                  <div className="absolute right-[18%] bottom-[25%] flex flex-col items-center gap-1">
                    <span className="inline-flex h-2 w-2 rounded-full bg-[rgba(22,44,75,0.95)] shadow-[0_0_10px_rgba(22,44,75,0.8)]" />
                    <span className="text-[10px] font-semibold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded-full border border-slate-200">
                      Paphos (PFO)
                    </span>
                  </div>

                  {/* Compass icon */}
                  <div className="absolute top-3 right-4 flex items-center gap-1 text-[10px] text-slate-500">
                    <Icon icon={compassIcon} width={16} height={16} />
                    <span>N</span>
                  </div>
                </div>
              </div>

              {/* zone labels */}
              <div className="grid gap-3 sm:grid-cols-2 text-[11px] sm:text-[12px] text-slate-700 mt-2">
                <div className="space-y-1.5">
                  <p className="font-semibold flex items-center gap-1">
                    <span className="inline-flex h-2 w-2 rounded-full bg-[rgba(176,114,8,0.9)]" />
                    East Coast
                  </p>
                  <p className="text-slate-600">
                    Ayia Napa, Nissi Beach, Protaras, Pernera, Paralimni &amp; Kapparis.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="font-semibold flex items-center gap-1">
                    <span className="inline-flex h-2 w-2 rounded-full bg-[rgba(22,44,75,0.95)]" />
                    West &amp; South
                  </p>
                  <p className="text-slate-600">
                    Limassol, Limassol Marina, Pissouri, Paphos, Coral Bay, Polis &amp; Latchi.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="font-semibold flex items-center gap-1">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                    Inland &amp; Mountains
                  </p>
                  <p className="text-slate-600">
                    Nicosia (Lefkosia) and Troodos mountain areas on request.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="font-semibold flex items-center gap-1">
                    <span className="inline-flex h-2 w-2 rounded-full bg-amber-500" />
                    Cross-border
                  </p>
                  <p className="text-slate-600">
                    Selected routes to Kyrenia &amp; Famagusta, subject to current regulations.
                  </p>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-500">
                Unsure if your hotel, villa or village is covered? Share your address
                with us and we&apos;ll confirm price and availability for your exact
                location.
              </p>
            </div>
          </motion.div>

          {/* RIGHT: Larnaca + Paphos “belt” lists */}
          <div className="space-y-7">
            {/* Larnaca belt */}
            <div className="rounded-3xl border border-slate-200 bg-white/90 shadow-[0_14px_40px_rgba(15,23,42,0.08)] px-4 py-5 sm:px-5 sm:py-6">
              <div className="mb-3 flex items-center gap-2">
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
                    Fixed-price private taxis to city, coast, mountains &amp; beyond.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {LARNACA_DESTINATIONS.map((d) => (
                  <Link
                    key={d.label}
                    href={d.href}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] text-slate-700 hover:border-[rgba(176,114,8,0.8)] hover:bg-white hover:text-[rgb(22,44,75)] transition-colors"
                  >
                    <Icon icon={mapMarkerIcon} width={14} height={14} />
                    <span>{d.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Paphos belt */}
            <div className="rounded-3xl border border-slate-200 bg-white/90 shadow-[0_14px_40px_rgba(15,23,42,0.08)] px-4 py-5 sm:px-5 sm:py-6">
              <div className="mb-3 flex items-center gap-2">
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

              <div className="flex flex-wrap gap-2">
                {PAPHOS_DESTINATIONS.map((d) => (
                  <Link
                    key={d.label}
                    href={d.href}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] text-slate-700 hover:border-[rgba(176,114,8,0.8)] hover:bg-white hover:text-[rgb(22,44,75)] transition-colors"
                  >
                    <Icon icon={mapMarkerIcon} width={14} height={14} />
                    <span>{d.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <p className="text-[12px] text-slate-500">
              Each destination name links to a detailed route page with pricing and
              typical journey times.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
