"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
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

const bgImages = ["/FirstClassTransfersAirplane2.jpg", "/FirstClassTransfersAirplane4.jpg"];

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

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
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-32 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:px-8 lg:pb-28 lg:pt-40">
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

        {/* RIGHT – Bullet grid */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="grid w-full gap-2 sm:grid-cols-2"
        >
          {bullets.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 backdrop-blur-md shadow-sm"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <Icon
                  icon={item.icon}
                  width={18}
                  height={18}
                  className="text-(--brand-accent)"
                  style={
                    {
                      "--brand-accent": BRAND.accent,
                    } as React.CSSProperties
                  }
                />
                <span className="text-[12px] font-semibold">{item.label}</span>
              </div>
              <p className="text-[11px] text-white/75">{item.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
