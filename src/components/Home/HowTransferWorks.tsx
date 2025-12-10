"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@iconify/react";
import calendarCheck from "@iconify/icons-mdi/calendar-check";
import radarIcon from "@iconify/icons-mdi/radar";
import carPassenger from "@iconify/icons-mdi/car-sports";
import airplaneTakeoff from "@iconify/icons-mdi/airplane-takeoff";

const BRAND = {
  primary: "#162c4b",
  accent: "#b07208",
};

const STEPS = [
  {
    icon: calendarCheck,
    label: "Step 1",
    title: "Book in Seconds",
    text: "Choose your route, travel date and time. See your fixed fares for sedan and Mercedes V-Class, then submit your booking details online. You can also tell us about child seats, extra luggage or special requests.",
  },
  {
    icon: radarIcon,
    label: "Step 2",
    title: "We Confirm & Track Your Flight",
    text: "You receive instant confirmation by email (and WhatsApp if you wish). For airport pickups, we monitor your flight and automatically adjust your pickup time if there are delays.",
  },
  {
    icon: carPassenger,
    label: "Step 3",
    title: "Meet Your Driver & Enjoy the Ride",
    text: "Your driver meets you at the agreed point, helps with your luggage and drives you directly to your destination in comfort. All transfers are private – just you and your group in the vehicle.",
  },
];

export default function HowYourTransferWorks() {
  return (
    <section className="relative bg-slate-50 text-slate-900 py-20 sm:py-24">
      {/* soft background tint */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(176,114,8,0.12), transparent 45%), radial-gradient(circle at 100% 100%, rgba(22,44,75,0.10), transparent 45%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="uppercase tracking-[0.25em] text-[11px] text-slate-500">
            How Your Transfer Works
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
            How Your Transfer Works
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600">
            Booking your airport taxi in Cyprus with us takes just a couple of minutes.
          </p>
        </div>

        {/* HORIZONTAL TIMELINE */}
        <div className="mt-14">
          <div className="relative">
            {/* horizontal line (desktop only, behind cards) */}
            <div className="hidden md:block absolute left-0 right-0 top-1/2 h-px bg-slate-200" aria-hidden />
            <div
              className="hidden md:block absolute left-8 right-8 top-1/2 h-0.5"
              aria-hidden
              style={{
                background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.primary})`,
              }}
            />

            <div className="flex flex-col gap-10 md:flex-row md:items-stretch md:justify-between">
              {STEPS.map((step, idx) => (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.05 }}
                  className="relative z-10 flex-1 max-w-md mx-auto"
                >
                  {/* dot on the line (desktop) */}
                  <div className="hidden md:flex absolute -bottom-6 left-1/2 -translate-x-1/2 items-center justify-center">
                    <span
                      className="h-4 w-4 rounded-full border-2 bg-slate-50"
                      style={{ borderColor: BRAND.accent }}
                    />
                  </div>

                  {/* card */}
                  <div className="rounded-3xl border border-slate-200 bg-white/90 shadow-[0_16px_40px_rgba(15,23,42,0.08)] px-5 py-6 sm:px-6 sm:py-7">
                    <div className="flex items-center gap-3 mb-4">
                      {/* icon */}
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50"
                        style={{ color: BRAND.primary }}
                      >
                        <Icon icon={step.icon} width={22} height={22} />
                      </div>

                      <div className="flex flex-col items-start">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                          {step.label}
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm sm:text-[14px] leading-relaxed text-slate-600">
                      {step.text}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-400/40"
              style={{
                background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.primary})`,
              }}
            >
              Get Your Instant Quote
              <Icon icon={airplaneTakeoff} width={18} height={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
