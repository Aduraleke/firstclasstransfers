"use client";

import { ComponentProps, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import airplaneIcon from "@iconify/icons-mdi/airplane";
import shieldCheckIcon from "@iconify/icons-mdi/shield-check";
import babyCarriageIcon from "@iconify/icons-mdi/baby-carriage";
import waterIcon from "@iconify/icons-mdi/water";
import wifiIcon from "@iconify/icons-mdi/wifi";
import clockOutlineIcon from "@iconify/icons-mdi/clock-outline";

const BRAND_PRIMARY = "#162c4b";
const BRAND_ACCENT = "#b07208";

const rotatingBanners = [
  {
    id: "family",
    label: "Family & Beach Stays",
    headline: "Larnaca Airport → Ayia Napa & Protaras",
    sub: "From €54 / €80 · up to 6 passengers · perfect for family holidays.",
    cta: "View beach transfers",
    href: "/routes/ayia-napa",
  },
  {
    id: "business",
    label: "Business & Marina",
    headline: "Executive transfers to Limassol & Nicosia",
    sub: "Fixed price, invoices available · ideal for business, embassies & conferences.",
    cta: "View business routes",
    href: "/routes/limassol",
  },
  {
    id: "long",
    label: "Long-distance comfort",
    headline: "Paphos, Coral Bay & Troodos",
    sub: "Relax with Wi-Fi and optional rest stops on long routes across Cyprus.",
    cta: "See long-distance routes",
    href: "/routes/paphos",
  },
  {
    id: "fleet",
    label: "Mercedes V-Class & Electric",
    headline: "Mercedes V-Class & all-electric Ford Capri",
    sub: "Up to 6 passengers in first-class comfort, plus a cleaner way to travel.",
    cta: "View our fleet",
    href: "/fleet",
  },
];

// ⛔ IMPORTANT:
// Put these 3 files in your Next.js /public folder like:
//   public/AirplaneBg.webp
//   public/carChauffeur.webp
//   public/airfam.avif
// Then these paths are correct: "/AirplaneBg.webp", etc.
const bgSlides = [
  {
    id: "airplane",
    src: "/AirplaneBg.webp",
    alt: "Airplane at sunrise on the runway",
  },
  {
    id: "chauffeur",
    src: "/carChauffeur.webp",
    alt: "Chauffeur helping guests with luggage",
  },
  {
    id: "family",
    src: "/airfam.avif",
    alt: "Family preparing to travel with suitcases",
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % rotatingBanners.length);
      setBgIndex((prev) => (prev + 1) % bgSlides.length);
    }, 6500);

    return () => window.clearInterval(id);
  }, []);

  const active = rotatingBanners[activeIndex];

  return (
    <section className="relative bg-white overflow-hidden">
      {/* BACKGROUND SLIDER */}
      <div className="absolute inset-0 -z-10">
        {bgSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
              index === bgIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* parent is absolute -> Image with fill is okay */}
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover"
            />
            {/* soften image, but keep it visible */}
            <div className="absolute inset-0 bg-white/35 lg:bg-white/45 backdrop-blur-[1px]" />
            {/* brand vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 5% 0%, rgba(22,44,75,0.25), transparent 55%), radial-gradient(circle at 100% 100%, rgba(176,114,8,0.35), transparent 55%)",
              }}
            />
            {/* fade to white at bottom to blend into page */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/30 to-white" />
          </div>
        ))}
      </div>

      {/* CONTENT (aligned under navbar) */}
      <div className="pt-32 sm:pt-36 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
            {/* LEFT: Core value proposition */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f4ff]/90 border border-[#e0e7ff] px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.35)]" />
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#162c4b]">
                  Private Cyprus airport transfers · fixed price
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.1rem] font-semibold leading-tight text-[#111827]">
                  Private Cyprus Airport Transfers{" "}
                  <span className="block text-[1.8rem] sm:text-[2rem] lg:text-[2.2rem] text-[#b07208]">
                    Fixed price, first-class service
                  </span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-xl">
                  Fixed-price private taxis from Larnaca and Paphos Airports to
                  Ayia Napa, Protaras, Limassol, Nicosia, Paphos, Famagusta and
                  more. Modern sedans and Mercedes V-Class minivans, 24/7, with
                  no meter and no hidden extras.
                </p>
              </div>

              {/* Bullet strip */}
              <div className="flex flex-wrap gap-2.5 text-[11px] sm:text-xs">
                <HeroPill
                  icon={shieldCheckIcon}
                  label="Fixed price – no meter, no surprises"
                />
                <HeroPill
                  icon={airplaneIcon}
                  label="Modern sedans & Mercedes V-Class"
                />
                <HeroPill icon={waterIcon} label="Free bottled water" />
                <HeroPill icon={wifiIcon} label="On-board Wi-Fi" />
                <HeroPill
                  icon={babyCarriageIcon}
                  label="Child seats free on request"
                />
                <HeroPill
                  icon={clockOutlineIcon}
                  label="24/7 dispatch · flight monitoring"
                />
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center rounded-full px-6 sm:px-7 py-3 text-sm sm:text-base font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.32)] transition"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_PRIMARY})`,
                    color: "#ffffff",
                  }}
                >
                  Get instant quote &amp; book
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full px-6 sm:px-7 py-3 text-sm sm:text-base font-semibold border border-gray-200 text-[#162c4b] bg-white/90 hover:bg-white transition"
                >
                  View routes &amp; prices
                </Link>
              </div>

              <p className="text-[11px] sm:text-xs text-gray-500">
                Standard sedans for up to 4 passengers · Mercedes V-Class
                minivans for up to 6 passengers.
              </p>
            </div>

            {/* RIGHT: Rotating “scenario” card */}
            <div className="relative">
              {/* Soft glow behind card */}
              <div
                className="pointer-events-none absolute -inset-6 rounded-4xl opacity-60 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle at 0% 0%, rgba(22,44,75,0.35), transparent 60%), radial-gradient(circle at 100% 100%, rgba(176,114,8,0.35), transparent 55%)",
                }}
              />

              <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white/95 shadow-[0_18px_60px_rgba(15,23,42,0.16)]">
                {/* Top mini header */}
                <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3 border-b border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-500">
                      Larnaca &amp; Paphos airport taxis
                    </span>
                    <span className="text-xs text-gray-500">
                      Fixed price · private transfers only
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>24/7</span>
                  </div>
                </div>

                {/* Rotating banner content */}
                <div className="px-4 sm:px-5 py-4 sm:py-5 space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#f9fafb] px-3 py-1 border border-gray-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#b07208]" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-700">
                      {active.label}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-sm sm:text-base font-semibold text-[#111827]">
                      {active.headline}
                    </p>
                    <p className="text-[12px] sm:text-[13px] text-gray-600">
                      {active.sub}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href={active.href}
                      className="text-[12px] sm:text-[13px] font-semibold text-[#162c4b] hover:text-[#b07208] inline-flex items-center gap-1"
                    >
                      {active.cta}
                      <span aria-hidden>→</span>
                    </Link>

                    <div className="flex items-center gap-1.5">
                      {rotatingBanners.map((banner, index) => (
                        <button
                          key={banner.id}
                          type="button"
                          onClick={() => setActiveIndex(index)}
                          className={`h-1.5 rounded-full transition-all ${
                            index === activeIndex
                              ? "w-4 bg-[#162c4b]"
                              : "w-1.5 bg-gray-300"
                          }`}
                          aria-label={banner.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom quick stats strip */}
                <div className="grid grid-cols-3 border-t border-gray-100 text-[11px] sm:text-xs">
                  <div className="px-3 py-3 border-r border-gray-100">
                    <p className="font-semibold text-[#162c4b]">Fixed price</p>
                    <p className="text-gray-500">No meter · no night fees</p>
                  </div>
                  <div className="px-3 py-3 border-r border-gray-100">
                    <p className="font-semibold text-[#162c4b]">Private only</p>
                    <p className="text-gray-500">No shared shuttles</p>
                  </div>
                  <div className="px-3 py-3">
                    <p className="font-semibold text-[#162c4b]">
                      Sedan / V-Class
                    </p>
                    <p className="text-gray-500">Up to 6 passengers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

type HeroPillProps = {
  icon: ComponentProps<typeof Icon>["icon"];
  label: string;
};


function HeroPill({ icon, label }: HeroPillProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f9fafb]/95 border border-gray-200 px-3 py-1">
      <Icon icon={icon} width={14} height={14} className="text-[#162c4b]" />
      <span className="text-[11px] sm:text-xs text-gray-700">{label}</span>
    </span>
  );
}
