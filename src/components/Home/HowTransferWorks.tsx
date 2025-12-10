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
    meta: "Takes around 1 minutes",
  },
  {
    icon: radarIcon,
    label: "Step 2",
    title: "We Confirm & Track Your Flight",
    text: "You receive instant confirmation by email (and WhatsApp if you wish). For airport pickups, we monitor your flight and automatically adjust your pickup time if there are delays.",
    meta: "We handle the timing",
  },
  {
    icon: carPassenger,
    label: "Step 3",
    title: "Meet Your Driver & Enjoy the Ride",
    text: "Your driver meets you at the agreed point, helps with your luggage and drives you directly to your destination in comfort. All transfers are private – just you and your group in the vehicle.",
    meta: "Private, door-to-door",
  },
];

export default function HowYourTransferWorks() {
  return (
    <section className="relative bg-slate-50 py-20 text-slate-900 sm:py-24">
      {/* soft background tint */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(176,114,8,0.12), transparent 45%), radial-gradient(circle at 100% 100%, rgba(22,44,75,0.12), transparent 45%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
            How Your Transfer Works
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl capitalize">
            From instant quote to hotel lobby in three simple steps.
          </h2>
          <p className="text-sm text-slate-600 sm:text-[15px]">
            Booking your airport taxi in Cyprus with us takes just a couple of
            seconds. Once you&apos;re booked, we quietly handle the details in
            the background.
          </p>
        </div>

        {/* MAIN LAYOUT */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:items-start">
          {/* LEFT – summary card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative rounded-3xl bg-white/90 px-5 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 sm:px-6 sm:py-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(176,114,8,0.9)]" />
              <span>Simple three-step process</span>
            </div>

            <h3 className="mt-4 text-xl font-semibold text-slate-900 sm:text-2xl">
              You book in minutes. We handle everything else.
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[14px]">
              No phone calls, no haggling with taxi ranks. Just pick your route,
              see your fixed prices and reserve your private vehicle. From that
              moment, we track your flight, assign your driver and prepare your
              transfer.
            </p>

            <div className="mt-5 grid gap-3 text-[11px] sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                <p className="font-semibold text-slate-900">1 minutes</p>
                <p className="mt-0.5 text-slate-500">Average booking time</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                <p className="font-semibold text-slate-900">Instant email</p>
                <p className="mt-0.5 text-slate-500">Booking confirmation</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                <p className="font-semibold text-slate-900">Flight tracking</p>
                <p className="mt-0.5 text-slate-500">We adjust for delays</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-[12px] text-slate-100">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                <Icon icon={airplaneTakeoff} width={16} height={16} />
              </span>
              <p>
                Most travellers book their transfer{" "}
                <span className="font-semibold">as soon as flights are
                confirmed</span>. You can still book last-minute if there&apos;s
                availability.
              </p>
            </div>
          </motion.div>

          {/* RIGHT – creative timeline */}
          <div className="relative">
            {/* line & animated plane (desktop) */}
            <div
              className="pointer-events-none absolute inset-x-4 top-10 hidden h-[3px] rounded-full md:block"
              aria-hidden
              style={{
                background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.primary})`,
              }}
            />
            <motion.div
              aria-hidden
              initial={{ x: "0%" }}
              animate={{ x: ["0%", "90%", "0%"] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute left-4 top-8 hidden h-7 w-7 -translate-y-1/2 rounded-full bg-white shadow-md ring-1 ring-slate-200 md:flex items-center justify-center"
            >
              <Icon
                icon={airplaneTakeoff}
                width={16}
                height={16}
                className="text-[rgba(176,114,8,0.9)]"
              />
            </motion.div>

            <div className="flex flex-col gap-8 md:gap-10">
              {STEPS.map((step, idx) => (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: 0.45,
                    ease: "easeOut",
                    delay: idx * 0.05,
                  }}
                  className={[
                    "relative max-w-xl",
                    "md:max-w-none md:w-[88%]",
                    idx === 1 ? "md:self-end" : "md:self-start",
                  ].join(" ")}
                >
                  {/* step connector (mobile) */}
                  {idx > 0 && (
                    <div
                      aria-hidden
                      className="absolute -top-6 left-6 h-6 w-px bg-slate-200 md:hidden"
                    />
                  )}

                  {/* floating step badge */}
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-900 text-[11px] text-slate-50 px-3 py-1 shadow-sm md:mb-4">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold">
                      {idx + 1}
                    </span>
                    <span className="uppercase tracking-[0.16em] opacity-80">
                      {step.label}
                    </span>
                  </div>

                  {/* card */}
                  <div className="rounded-3xl border border-slate-200 bg-white/95 px-5 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:px-6 sm:py-7">
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50"
                        style={{ color: BRAND.primary }}
                      >
                        <Icon icon={step.icon} width={22} height={22} />
                      </div>

                      <div className="flex flex-col items-start">
                        <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                          {step.title}
                        </h3>
                        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                          {step.meta}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-600 sm:text-[14px]">
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
