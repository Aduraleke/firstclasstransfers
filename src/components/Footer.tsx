"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import planeIcon from "@iconify/icons-mdi/airplane";
import mapMarkerIcon from "@iconify/icons-mdi/map-marker";
import clockOutlineIcon from "@iconify/icons-mdi/clock-outline";
import whatsappIcon from "@iconify/icons-mdi/whatsapp";
import instagramIcon from "@iconify/icons-mdi/instagram";
import facebookIcon from "@iconify/icons-mdi/facebook";
import emailIcon from "@iconify/icons-mdi/email-outline";
import phoneIcon from "@iconify/icons-mdi/phone-outline";
import { motion } from "framer-motion";

export default function Footer() {
  const BRAND = {
    primary: "#162c4b", // deep navy
    accent: "#b07208", // gold
    neutral: "#ffffff", // white
  };

  const popularRoutes = [
    { from: "Larnaca City", to: "LCA Airport", eta: "≈ 15–20 min" },
    { from: "Ayia Napa", to: "LCA Airport", eta: "≈ 35–45 min" },
    { from: "Protaras", to: "LCA Airport", eta: "≈ 45–55 min" },
  ];

  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        ["--brand-primary" as string]: BRAND.primary,
        ["--brand-accent" as string]: BRAND.accent,
        ["--brand-neutral" as string]: BRAND.neutral,
      }}
      className="relative border-t border-white/10 bg-[#050814] text-sm text-white/80"
    >
      {/* Soft background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        aria-hidden
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(circle at 0% 0%, rgba(22,44,75,0.7), transparent 60%), radial-gradient(circle at 100% 100%, rgba(176,114,8,0.55), transparent 60%)",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        {/* MAIN ROW – much flatter */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] items-start">
          {/* LEFT: Brand + status + contact */}
          <div className="space-y-5">
            {/* Brand row */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative flex items-center justify-center h-12 w-28 sm:h-14 sm:w-36 bg-white rounded-2xl shadow-sm">
                <Image
                  src="/firstclass.png"
                  alt="First Class logo"
                  width={190}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/75">
                  First Class Transfers
                </p>
                <p className="text-xs text-white/60 max-w-xs">
                  Private airport transfers in Cyprus, with a first-class
                  experience from booking to drop-off.
                </p>
              </div>
            </div>

            {/* Status + contact in one simple block */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/60 px-2.5 py-1 text-emerald-200">
                  <span className="relative inline-flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Live · 24/7 Dispatch
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-white/70 border border-white/10 text-[11px]">
                  <Icon
                    icon={clockOutlineIcon}
                    width={14}
                    height={14}
                    className="text-white/70"
                  />
                    Fast Pick-Up
                </span>
              </div>

              <div className="grid gap-2 text-[13px] sm:grid-cols-2 sm:gap-3">
                <a
                  href="tel:+35799240868"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Icon icon={phoneIcon} width={16} height={16} />
                  <span>+357 99 240868, +357 94 005511, +357 96 565385</span>
                </a>
                <a
                  href="mailto:info@firstclass.cy"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Icon icon={emailIcon} width={16} height={16} />
                  <span>booking@firstclasstransfers.eu</span>
                </a>
              </div>

              <motion.a
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98, y: 0 }}
                href="https://wa.me/35799240868"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.6)] mt-1"
                style={{
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                  color: "#ffffff",
                }}
              >
                <Icon icon={whatsappIcon} width={18} height={18} />
                WhatsApp Dispatch
              </motion.a>

              <div className="flex items-center gap-3 pt-2">
                <p className="text-[11px] text-white/55">
                  Share your flight number for smarter timing.
                </p>
              </div>
            </div>

            {/* Socials – inline, no extra card */}
            <div className="flex items-center gap-3 pt-1">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
                Follow
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href="#"
                  aria-label="Instagram"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition-colors"
                >
                  <Icon icon={instagramIcon} width={16} height={16} />
                </Link>
                <Link
                  href="#"
                  aria-label="Facebook"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition-colors"
                >
                  <Icon icon={facebookIcon} width={16} height={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: Popular routes – one light panel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                Popular Routes
              </p>
              <div className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2 py-1 text-[10px] text-white/60">
                <Icon icon={planeIcon} width={14} height={14} />
                Flight-aligned timing
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/25 backdrop-blur px-3 py-3 sm:px-4 sm:py-4">
              <div className="flex items-center justify-between text-[11px] text-white/55 mb-2.5">
                <span className="flex items-center gap-1.5">
                  <Icon icon={mapMarkerIcon} width={14} height={14} />
                  City ↔ Airport rail
                </span>
                <span>ETA window</span>
              </div>

              <div className="space-y-1.5">
                {popularRoutes.map((route) => (
                  <div
                    key={route.from}
                    className="flex items-center justify-between gap-2 rounded-2xl bg-white/5/30 px-2.5 py-2 sm:px-3 sm:py-2.5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-white/90">
                        {route.from}
                      </span>
                      <span className="text-[11px] text-white/55">
                        To {route.to}
                      </span>
                    </div>
                    <div className="flex flex-col items-end text-right gap-0.5">
                      <span className="text-[11px] text-white/60">
                        {route.eta}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border"
                        style={{
                          borderColor: "rgba(176,114,8,0.6)",
                          backgroundColor: "rgba(176,114,8,0.12)",
                          color: BRAND.accent,
                        }}
                      >
                        <span className="h-1 w-4 rounded-full bg-[rgba(176,114,8,0.75)]" />
                        Priority lane
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/55">
                <span>Flight monitoring available on request.</span>
                <Link
                  href="/service-guide"
                  className="underline underline-offset-4 decoration-white/30 hover:decoration-(--brand-accent) hover:text-white"
                >
                  Service guide →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-[11px] text-white/55">
          <div className="flex items-center gap-2">
            <span>© {year} First Class Transfers.</span>
            <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-white/40" />
            <span className="hidden sm:inline-block">
              Crafted for seamless airport journeys.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>Book a transfer</span>
              <Icon icon={planeIcon} width={14} height={14} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
