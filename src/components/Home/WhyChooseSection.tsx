"use client";

import React from "react";
import { Icon } from "@iconify/react";
import cashIcon from "@iconify/icons-mdi/cash-check";
import carIcon from "@iconify/icons-mdi/car-sports";
import accountTieIcon from "@iconify/icons-mdi/account-tie";
import babyCarriageIcon from "@iconify/icons-mdi/baby-carriage";
import clockOutlineIcon from "@iconify/icons-mdi/clock-outline";
import shieldCheckIcon from "@iconify/icons-mdi/shield-check";
import Link from "next/link";

const REASONS = [
  {
    icon: cashIcon,
    title: "Fixed, Transparent Prices",
    short: "Know your fare before you travel – no meter, night fees or extras.",
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
    <section className="relative bg-[#04050B] text-white py-28 overflow-hidden">
      {/* (Optional) static runway line */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 -z-10 bg-[repeating-linear-gradient(90deg,rgba(176,114,8,0.45)_0_16px,transparent_16px_32px)]" />

      {/* header */}
      <div className="text-center max-w-3xl mx-auto px-4 mb-14">
        <p className="uppercase tracking-[0.28em] text-[11px] text-white/60">
          Why Travellers Choose First Class Transfers
        </p>

        <h2 className="text-3xl sm:text-4xl font-semibold mt-3 leading-tight">
          Why Choose First Class Transfers Cyprus?
        </h2>

        <p className="text-sm sm:text-[15px] text-white/75 mt-4 leading-relaxed">
          We’re a local, professional team focused on doing a few things
          extremely well: clear prices, clean cars and drivers you can trust. No
          drama, no surprises, just solid, reliable service every time.
        </p>
      </div>

      {/* HORIZONTAL BELT (manual scroll, Tailwind only) */}
      <div className="relative">
        <div className="hide-scrollbar overflow-x-auto px-6 sm:px-8">
          <div className="flex gap-6 md:gap-8 snap-x snap-mandatory">
            {REASONS.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="shrink-0 snap-center w-60 h-[300px]
                           rounded-[28px] border border-white/10 bg-white/5
                           backdrop-blur-xl shadow-[0_14px_60px_rgba(0,0,0,0.65)]
                           flex flex-col justify-center items-center text-center
                           px-6 relative
                           transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(0,0,0,0.85)]"
                style={{
                  transform:
                    index % 2 === 0 ? "rotateY(8deg)" : "rotateY(-8deg)",
                }}
              >
                {/* icon */}
                <div className="mb-4 p-4 rounded-2xl border border-[rgba(176,114,8,0.55)] bg-[rgba(176,114,8,0.12)] shadow-[0_4px_18px_rgba(176,114,8,0.4)]">
                  <Icon icon={item.icon} width={32} height={32} />
                </div>

                <h3 className="text-[14.5px] font-bold mb-1">{item.title}</h3>
                <p className="text-[12px] text-white/75 leading-relaxed">
                  {item.short}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-black/30 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-10">
        <Link
          href="/about"
          className="inline-flex items-center gap-1 text-sm font-semibold text-white/85
                     hover:text-white transition-colors underline underline-offset-4 decoration-white/30"
        >
          Learn More About Us →
        </Link>
      </div>

      {/* section fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-[#04050B] to-transparent" />
    </section>
  );
}
