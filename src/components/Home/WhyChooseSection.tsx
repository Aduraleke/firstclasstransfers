"use client";

import React from "react";
import { Icon } from "@iconify/react";
import cashIcon from "@iconify/icons-mdi/cash-check";
import carIcon from "@iconify/icons-mdi/car-sports";
import accountTieIcon from "@iconify/icons-mdi/account-tie";
import babyCarriageIcon from "@iconify/icons-mdi/baby-carriage";
import clockOutlineIcon from "@iconify/icons-mdi/clock-outline";
import shieldCheckIcon from "@iconify/icons-mdi/shield-check";

import { motion } from "framer-motion";

const BRAND = {
  primary: "#162c4b",
  accent: "#b07208",
};

const REASONS = [
  {
    icon: cashIcon,
    title: "Fixed, Transparent Prices",
    short: "Know your fare before you travel, night fees or extras.",
  },
  {
    icon: carIcon,
    title: "Premium Vehicles, Not Old Taxis",
    short: "Modern sedans, Mercedes V-Class and an all-electric Ford Capri.",
  },
  {
    icon: accountTieIcon,
    title: "Professional, Friendly Drivers",
    short: "Licensed, insured and English-speaking drivers you can trust.",
  },
  {
    icon: babyCarriageIcon,
    title: "Perfect for Families & Groups",
    short: "Free child seats on request and plenty of luggage space.",
  },
  {
    icon: clockOutlineIcon,
    title: "24/7 Support & Flight Monitoring",
    short: "We track your flight and adjust pickup for delays automatically.",
  },
  {
    icon: shieldCheckIcon,
    title: "Airport Meet & Greet Included",
    short:
      "We wait for you in arrivals with a clear name sign and help with bags.",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="relative overflow-hidden bg-[#04050B] py-24 text-white">
      {/* subtle background runway + glows */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        {/* runway line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[repeating-linear-gradient(90deg,rgba(176,114,8,0.45)_0_16px,transparent_16px_32px)]" />
        {/* soft glows */}
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[rgba(176,114,8,0.24)] blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[rgba(22,44,75,0.6)] blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.28em] text-[11px] text-white/60">
            Why Travellers Choose First Class Transfers
          </p>

          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Why Choose First Class Transfers Cyprus?
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-[15px]">
            We’re a local, professional team focused on doing a few things
            extremely well: clear prices, clean cars and drivers you can trust.
            No drama, no surprises, just solid, reliable service every time.
          </p>
        </div>

        {/* Main layout: left highlight + right grid */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] items-stretch">
          {/* LEFT: highlight card + mini badges */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative flex flex-col justify-between rounded-3xl bg-white/5 p-5 sm:p-6 lg:p-7 backdrop-blur-xl ring-1 ring-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.65)]"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/70 ring-1 ring-white/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>What makes us different</span>
              </div>

              <h3 className="text-xl font-semibold sm:text-2xl">
                A small team that cares about every transfer.
              </h3>

              <p className="text-sm text-white/75 leading-relaxed">
                We&apos;re not a huge call centre or anonymous app. You&apos;re
                booking directly with a small Cyprus team that checks every
                journey, monitors every flight and makes sure you&apos;re looked
                after from arrivals to drop-off.
              </p>

              <ul className="mt-2 space-y-2 text-sm text-white/80">
                <li className="flex gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[rgba(176,114,8,0.9)]" />
                  <span>
                    Fixed prices agreed in advance – the price you see is the
                    price you pay.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[rgba(176,114,8,0.9)]" />
                  <span>
                    Professional, insured drivers – no &quot;random WhatsApp
                    drivers&quot;.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[rgba(176,114,8,0.9)]" />
                  <span>
                    Clean, modern vehicles with space for your luggage and
                    family.
                  </span>
                </li>
              </ul>
            </div>

            {/* mini badges */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-[11px] sm:grid-cols-3">
              <div className="rounded-2xl bg-black/40 px-3 py-2 ring-1 ring-white/15">
                <p className="font-semibold text-white">Per vehicle</p>
                <p className="mt-0.5 text-white/70">Not per person</p>
              </div>
              <div className="rounded-2xl bg-black/40 px-3 py-2 ring-1 ring-white/15">
                <p className="font-semibold text-white">24/7 support</p>
                <p className="mt-0.5 text-white/70">Real local team</p>
              </div>
              <div className="rounded-2xl bg-black/40 px-3 py-2 ring-1 ring-white/15">
                <p className="font-semibold text-white">Flight tracking</p>
                <p className="mt-0.5 text-white/70">We adjust for delays</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: animated white cards grid */}
          <div className="relative">
            {/* decorative vertical line on desktop */}
            <div className="pointer-events-none absolute -left-4 top-2 hidden h-[90%] w-px bg-linear-to-b from-transparent via-white/30 to-transparent lg:block" />

            <div className="grid gap-4 sm:grid-cols-2">
              {REASONS.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.45,
                    ease: "easeOut",
                    delay: index * 0.05,
                  }}
                  className="group relative overflow-hidden rounded-3xl bg-white text-slate-900 shadow-[0_14px_45px_rgba(0,0,0,0.35)] ring-1 ring-slate-200/80 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(0,0,0,0.6)]"
                >
                  {/* top accent bar */}
                  <div
                    className="h-1 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.primary})`,
                    }}
                  />

                  <div className="flex flex-col gap-3 px-4 py-4 sm:px-5 sm:py-5">
                    {/* icon + index */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(176,114,8,0.08)] ring-1 ring-[rgba(176,114,8,0.35)]">
                          <Icon
                            icon={item.icon}
                            width={22}
                            height={22}
                            className="text-[rgba(176,114,8,0.95)]"
                          />
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                        Benefit
                      </span>
                    </div>

                    <h3 className="text-[14.5px] font-bold leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[12.5px] leading-relaxed text-slate-600">
                      {item.short}
                    </p>

                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>Included as standard</span>
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>

      
      </div>

      {/* bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-[#04050B] to-transparent" />
    </section>
  );
}
