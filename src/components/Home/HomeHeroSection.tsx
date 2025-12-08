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
  { icon: checkCircle, label: "Fixed Price", text: "No meter, no surprises" },
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
  "/FirstClassTransfersAirplane2.jpg",
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
              Larnaca &amp; Paphos
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
            Fixed-price private taxis from Larnaca and Paphos Airports to Ayia
            Napa, Protaras, Limassol, Nicosia, Paphos, Famagusta and more.
            Modern sedans and Mercedes V-Class minivans, 24/7, with no meter
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
              href="/pricing"
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

        {/* RIGHT – Slider-style highlight card */}
        <div className="flex flex-col items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative w-full h-[360px] sm:h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.45)] flex flex-col justify-center items-center px-8 py-10 bg-white/5 backdrop-blur-sm"
            >
              {/* animated soft gradient */}
              <motion.div
                animate={{
                  background: [
                    `radial-gradient(circle at 30% 30%, ${BRAND.accent}33, transparent 60%)`,
                    `radial-gradient(circle at 70% 70%, ${BRAND.primary}44, transparent 60%)`,
                  ],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 opacity-40"
              />

              {/* ICON */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 10 }}
                className="mb-6 relative"
              >
                <div className="p-5 rounded-full bg-black/40 border border-white/10 relative overflow-hidden">
                  <Icon
                    icon={active.icon}
                    className="text-[2.8rem]"
                    style={{ color: BRAND.accent }}
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.6, 1],
                      opacity: [0.35, 0, 0.35],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="absolute inset-0 bg-[rgba(0,0,0,0.35)] blur-2xl rounded-full"
                  />
                </div>
              </motion.div>

              {/* TEXT */}
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70 mb-2">
                {String(activeHighlight + 1).padStart(2, "0")} /{" "}
                {String(bullets.length).padStart(2, "0")} • Key benefit
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">
                {active.label}
              </h2>
              <p className="text-sm text-white/80 max-w-md text-center leading-relaxed">
                {active.text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* progress dots */}
          <div className="flex items-center space-x-2 mt-5">
            {bullets.map((item, i) => {
              const isActive = i === activeHighlight;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveHighlight(i)}
                  aria-label={`Show: ${item.label}`}
                  className="relative"
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-8"
                        : "w-3 hover:w-5 bg-white/25"
                    }`}
                    style={{
                      backgroundColor: isActive ? BRAND.accent : undefined,
                    }}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="hero-highlight-glow"
                      className="absolute -top-1 left-0 right-0 h-4 rounded-full blur-sm"
                      style={{ backgroundColor: `${BRAND.accent}66` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
