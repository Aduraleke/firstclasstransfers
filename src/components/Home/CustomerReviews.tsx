"use client";

import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import starIcon from "@iconify/icons-mdi/star";
import formatQuoteClose from "@iconify/icons-mdi/format-quote-close";

const BRAND = {
  gold: "#b07208",
  navy: "#050814",
};

const REVIEWS = [
  {
    text:
      "Best decision of our trip. Driver was waiting at arrivals, the car was spotless and the price was exactly as quoted. Will definitely use again.",
    name: "Anna K.",
    location: "Germany",
  },
  {
    text:
      "Professional service from Larnaca to Nicosia. On time, Wi-Fi in the car, and an invoice for my company. Very easy to deal with.",
    name: "Michael S.",
    location: "United Kingdom",
  },
  {
    text:
      "We travelled with two small kids and lots of luggage. They provided child seats and helped with everything – felt very safe and looked after.",
    name: "Elena P.",
    location: "Romania",
  },
];

export default function CustomerReviews() {
  return (
    <section className="relative bg-[#050814] text-white py-24 sm:py-28 overflow-hidden">
      {/* background glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(22,44,75,0.55), transparent 60%), radial-gradient(circle at 80% 80%, rgba(176,114,8,0.45), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* header + rating strip */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-14">
          <div className="space-y-3 max-w-xl">
            <p className="uppercase tracking-[0.25em] text-[11px] text-white/55">
              What Our Customers Say
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold leading-tight">
              Guests who land with us,{" "}
              <span style={{ color: BRAND.gold }}>keep booking us</span>.
            </h2>
            <p className="text-sm sm:text-[15px] text-white/70">
              Here&apos;s what recent travellers said after using First Class Transfers
              for their airport rides in Cyprus.
            </p>
          </div>

          {/* rating badge */}
          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-md shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
              <Icon icon={starIcon} width={18} height={18} className="text-[#f9d55c]" />
              <span className="text-sm">
                <span className="font-semibold">4.9 / 5</span>{" "}
                <span className="text-white/70">Average rating</span>
              </span>
            </div>
            <p className="text-[11px] text-white/55">
              Based on real guest reviews (Google &amp; direct feedback).
            </p>
          </div>
        </div>

        {/* collage of review cards */}
        <div className="relative mt-4">
          {/* soft center glow behind cards */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="mx-auto h-64 w-full max-w-3xl rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_65%)] blur-3xl" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {REVIEWS.map((r, idx) => {
              const base = {
                0: "md:-rotate-2 md:-translate-y-3",
                1: "md:translate-y-2",
                2: "md:rotate-2 md:-translate-y-4",
              } as const;

              return (
                <motion.article
                  key={r.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.08 }}
                  whileHover={{
                    y: -6,
                    rotate: 0,
                    boxShadow: "0 26px 70px rgba(0,0,0,0.8)",
                  }}
                  className={[
                    "relative rounded-3xl bg-white text-slate-900 px-5 py-6 sm:px-6 sm:py-7",
                    "shadow-[0_18px_50px_rgba(0,0,0,0.65)] border border-slate-200/80",
                    "flex flex-col justify-between",
                    base[idx as 0 | 1 | 2] || "",
                  ].join(" ")}
                >
                  {/* top quote icon + subtle stripe */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <Icon icon={formatQuoteClose} width={18} height={18} />
                    </div>
                    <span
                      className="h-0.5 w-16 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${BRAND.gold}, transparent)`,
                      }}
                    />
                  </div>

                  {/* text */}
                  <p className="text-[13px] sm:text-[14px] leading-relaxed text-slate-700 mb-5">
                    “{r.text}”
                  </p>

                  {/* footer: name + location */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-900">
                        {r.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{r.location}</p>
                    </div>

                    {/* initials badge */}
                    <div className="h-9 w-9 rounded-full bg-slate-900 text-white text-[11px] font-semibold flex items-center justify-center border border-slate-200/80">
                      {r.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
