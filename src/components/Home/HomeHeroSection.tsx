"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import planeIcon from "@iconify/icons-mdi/airplane";
import checkCircle from "@iconify/icons-mdi/check-circle";
import carIcon from "@iconify/icons-mdi/car-sports";
import waterIcon from "@iconify/icons-mdi/water";
import babyCarriageIcon from "@iconify/icons-mdi/baby-carriage";
import clockOutlineIcon from "@iconify/icons-mdi/clock-outline";
import leafIcon from "@iconify/icons-mdi/leaf";
import shieldCheckIcon from "@iconify/icons-mdi/shield-check";

const BRAND = {
  primary: "#162c4b",
  accent: "#b07208",
};

const bullets = [
  { icon: checkCircle, label: "Fixed Price", text: "No surprises" },
  {
    icon: carIcon,
    label: "Modern, Comfortable Vehicles",
    text: "Sedans & Mercedes V-Class",
  },
  { icon: waterIcon, label: "Free Water & Wi-Fi", text: "Stay refreshed" },
  {
    icon: shieldCheckIcon,
    label: "Licensed Drivers",
    text: "English-speaking professionals",
  },
  {
    icon: babyCarriageIcon,
    label: "Child Seats Free on Request",
    text: "For families",
  },
  {
    icon: clockOutlineIcon,
    label: "24/7 Availability",
    text: "Same prices day & night",
  },
  {
    icon: leafIcon,
    label: "All-Electric Option",
    text: "Ford Capri for lower emissions",
  },
];

const bgImages = [
  "/FirstClassHero.jpg",
  "/FirstClassTransfersAirplane4.jpg",
];

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const [bgIndex, setBgIndex] = useState(0);
  const [activeHighlight, setActiveHighlight] = useState(0);

  // Background crossfade
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Right-side slider autoplay
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActiveHighlight((prev) => (prev + 1) % bullets.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const active = bullets[activeHighlight];

  return (
    <section className="relative isolate overflow-hidden text-white">
      {/* BACKGROUND IMAGES */}
      <div className="absolute inset-0 -z-20">
        {bgImages.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={i === 0}
            className={`object-cover transition-opacity duration-2000 ease-in-out ${
              i === bgIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/70 via-black/60 to-[#050814]/95" />

      {/* CONTENT */}
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:gap-16 px-4 pb-20 pt-32 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:px-8 lg:pb-28 lg:pt-40">
        {/* LEFT */}
        <div className="space-y-7">
          {/* eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/80">
            <span>Cyprus Airport Taxi Transfers</span>
            <span className="h-0.5 w-5 rounded-full bg-white/50" />
            <span className="flex items-center gap-1">
              <Icon icon={planeIcon} width={14} height={14} />
              Larnaka &amp; Paphos
            </span>
          </div>

          {/* H1 */}
          <motion.h1
            initial={prefersReducedMotion ? undefined : { y: 18, opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold sm:text-4xl lg:text-5xl tracking-tight"
          >
            Private Cyprus Airport Transfers –{" "}
            <span style={{ color: BRAND.accent }}>
              Fixed Price, First Class Service
            </span>
          </motion.h1>

          {/* Subheadline */}
          <p className="max-w-xl text-sm text-white/80 sm:text-base">
            Fixed-price private taxis from Larnaka and Paphos Airports to Ayia
            Napa, Protaras, Limassol, Nicosia, Paphos, Famagusta and more.
            Modern sedans and Mercedes V-Class minivans, 24/7,
            and no hidden extras.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,0.7)]"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.primary})`,
                }}
              >
                Get Instant Quote &amp; Book
                <Icon icon={planeIcon} width={18} height={18} />
              </Link>
            </motion.div>

            <Link
              href="/routes"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm text-white/90 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              View Routes &amp; Prices
            </Link>
          </div>

          {/* Supporting line */}
          <p className="text-[12px] text-white/75 sm:text-[13px]">
            Standard sedans for up to 4 passengers · Mercedes V-Class minivans
            for up to 6 passengers.
          </p>
        </div>

        {/* RIGHT – More interesting highlight card */}
        <div className="relative flex w-full items-center justify-center lg:justify-end">
          {/* soft glow behind card */}
          <div className="pointer-events-none absolute -inset-x-6 top-4 h-[340px] rounded-4xl bg-[radial-gradient(circle_at_0%_0%,rgba(176,114,8,0.35),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(15,23,42,0.65),transparent_55%)] opacity-70 blur-3xl" />

          <AnimatePresence mode="wait">
            <motion.div
              key={active.label}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.98 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-white/12 bg-white/8 shadow-[0_22px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl px-5 py-6 sm:px-6 sm:py-7 flex flex-col gap-5"
            >
              {/* top eyebrow + counter */}
              <div className="flex items-center justify-center gap-3 text-[11px]">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 ring-1 ring-white/15">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="font-semibold uppercase tracking-[0.12em] text-white/75">
                    Why travellers book with us
                  </span>
                </div>
                
              </div>

              {/* main content: icon + text */}
              <div className="flex items-center gap-4 sm:gap-5">
                {/* ICON STACK */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 12 }}
                  className="relative"
                >
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-black/40 ring-1 ring-white/15 overflow-hidden">
                    {/* subtle rotating highlight */}
                    {!prefersReducedMotion && (
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 14,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0"
                      >
                        <div className="absolute -inset-6 bg-[conic-gradient(from_0deg,rgba(255,255,255,0.1),rgba(176,114,8,0.5),rgba(15,23,42,0.6),rgba(255,255,255,0.1))]" />
                      </motion.div>
                    )}
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-black/70">
                      <Icon
                        icon={active.icon}
                        className="text-[1.9rem]"
                        style={{ color: BRAND.accent }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* TEXT */}
                <div className="flex-1 space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold leading-snug">
                    {active.label}
                  </h2>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {active.text}
                  </p>
                  <p className="text-[11px] text-white/60">
                    Every booking includes meet &amp; greet at arrivals, flight
                    tracking and a fixed fare agreed in advance.
                  </p>
                </div>
              </div>

              {/* mini perks strip */}
              <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-2xl bg-black/35 px-2.5 py-2 ring-1 ring-white/10">
                  <div className="flex items-center gap-1.5 text-white/80">
                    <Icon icon={checkCircle} width={13} height={13} />
                    <span className="font-semibold">Fixed fare</span>
                  </div>
                  <p className="mt-1 text-[10px] text-white/65">
                    No extras
                  </p>
                </div>
                <div className="rounded-2xl bg-black/35 px-2.5 py-2 ring-1 ring-white/10">
                  <div className="flex items-center gap-1.5 text-white/80">
                    <Icon icon={clockOutlineIcon} width={13} height={13} />
                    <span className="font-semibold">24/7</span>
                  </div>
                  <p className="mt-1 text-[10px] text-white/65">
                    Same price day &amp; night
                  </p>
                </div>
                <div className="rounded-2xl bg-black/35 px-2.5 py-2 ring-1 ring-white/10">
                  <div className="flex items-center gap-1.5 text-white/80">
                    <Icon icon={shieldCheckIcon} width={13} height={13} />
                    <span className="font-semibold">Licensed</span>
                  </div>
                  <p className="mt-1 text-[10px] text-white/65">
                    Checked, insured drivers
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

    
        </div>
      </div>
    </section>
  );
}
