"use client";

import React, { useEffect, useState, useRef, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import menuIcon from "@iconify/icons-mdi/menu";
import clockOutlineIcon from "@iconify/icons-mdi/clock-outline";
import closeIcon from "@iconify/icons-mdi/close";
import planeIcon from "@iconify/icons-mdi/airplane";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const BRAND = {
    primary: "#162c4b", // deep navy
    accent: "#b07208", // gold
    neutral: "#ffffff", // white
  };

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const triggerId = useId();
  const pathname = usePathname();

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // focus trap for mobile menu
  useEffect(() => {
    if (!open || !mobileMenuRef.current) return;

    const focusable = mobileMenuRef.current.querySelectorAll(
      "a, button, [tabindex]:not([tabindex='-1'])"
    );
    const first = focusable[0] as HTMLElement | undefined;
    const last = focusable[focusable.length - 1] as HTMLElement | undefined;
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const navLinks = [
    { href: "/routes", label: "Pricing" },
    { href: "/service-guide", label: "Service Guide" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header
      style={{
        ["--brand-primary" as string]: BRAND.primary,
        ["--brand-accent" as string]: BRAND.accent,
        ["--brand-neutral" as string]: BRAND.neutral,
      }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center pointer-events-none"
      role="banner"
    >
      <motion.div
        initial={false}
        animate={scrolled ? "scrolled" : "top"}
        variants={{
          top: { y: 14, opacity: 1, scale: 1 },
          scrolled: { y: 0, opacity: 1, scale: 0.98 },
        }}
        className="mt-4 sm:mt-5 flex justify-center w-full px-3 sm:px-4"
      >
        {/* MAIN CONTAINER */}
        <div className="pointer-events-auto relative w-full max-w-6xl">
          {/* Soft glow aura */}
          <div
            className={`pointer-events-none absolute inset-0 blur-2xl transition-opacity ${
              scrolled ? "opacity-70" : "opacity-40"
            }`}
            aria-hidden
          >
            <div
              className="h-full w-full rounded-[28px]"
              style={{
                background:
                  "radial-gradient(circle at 0% 0%, rgba(22,44,75,0.65), transparent 55%), radial-gradient(circle at 100% 100%, rgba(176,114,8,0.5), transparent 55%)",
              }}
            />
          </div>

          {/* MAIN BAR */}
          <div
            className={`relative flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[rgba(5,10,20,0.94)] backdrop-blur-2xl px-3 sm:px-5 py-2.5 sm:py-3.5 transition-all duration-300 ${
              scrolled
                ? "shadow-[0_6px_10px_rgba(0,0,0,0.6)] scale-[0.99]"
                : "shadow-[0_8px_20px_rgba(0,0,0,0.75)]"
            }`}
          >
            {/* LEFT: Logo + tagline */}
            <Link
              href="/"
              className="flex items-center gap-3 sm:gap-4"
              aria-label="First Class Transfers - Home"
            >
              <div className="relative flex items-center gap-2">
                <div className="relative flex items-center justify-center h-14 w-24 sm:h-14 sm:w-32 bg-white rounded-2xl shadow-sm">
                  <Image
                    src="/firstclass.png"
                    alt="First Class logo"
                    width={180}
                    height={60}
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-(--brand-neutral)/75">
                    First Class Transfers
                  </span>
                  <span className="text-[8px] text-(--brand-neutral)/55">
                    Premium Airport Rides · Cyprus
                  </span>
                </div>
              </div>
            </Link>

            {/* CENTER: route line + nav (desktop) */}
            <div className="hidden lg:flex flex-1 flex-col items-center gap-1">
              {/* Single route lane */}
              <div className="flex items-center gap-2 text-[10px] text-(--brand-neutral)/70">
                <span className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 uppercase tracking-[0.18em] flex items-center gap-1">
                  <span className="text-[9px]">City</span>
                  <span className="h-px w-3 bg-white/30" />
                  <span className="text-[9px]">Airport</span>
                  <Icon
                    icon={planeIcon}
                    width={12}
                    height={12}
                    className="text-(--brand-accent)"
                    aria-hidden
                  />
                </span>

                <div className="relative h-0.5 w-40 overflow-hidden rounded-full bg-white/10">
                  {!prefersReducedMotion && (
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full shadow-[0_0_12px_rgba(176,114,8,0.9)]"
                      style={{
                        background:
                          "radial-gradient(circle, var(--brand-accent) 0%, var(--brand-primary) 70%)",
                      }}
                      initial={{ left: "0%" }}
                      animate={{ left: "calc(100% - 0.375rem)" }} // 0.375rem = h-1.5 / w-1.5
                      transition={{
                        repeat: Infinity,
                        duration: 2.8,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Nav links row */}
              <nav
                className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2 py-1"
                aria-label="Primary"
              >
                {navLinks.map((l) => {
                  const active = isActive(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={[
                        "group relative inline-flex items-center rounded-full px-3.5 py-1.5 text-xs xl:text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-(--brand-primary) focus-visible:ring-(--brand-accent)",
                        active
                          ? "text-(--brand-primary)"
                          : "text-(--brand-neutral)/80",
                      ].join(" ")}
                    >
                      <span className="relative z-10">{l.label}</span>
                      {/* hover / active background */}
                      <span
                        className={[
                          "pointer-events-none absolute inset-0 rounded-full transition-colors",
                          active
                            ? "bg-white"
                            : "bg-white/0 group-hover:bg-white/10",
                        ].join(" ")}
                      />
                      {/* edge border */}
                      <span
                        className={[
                          "pointer-events-none absolute inset-px rounded-full border transition-colors",
                          active
                            ? "border-white/70"
                            : "border-white/0 group-hover:border-white/20",
                        ].join(" ")}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* RIGHT: status + CTA + burger */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Status chip */}
              <div className="hidden md:flex flex-col items-end text-[10px] text-(--brand-neutral)/75 mr-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/60 px-2.5 py-1 text-emerald-200">
                  <span className="relative inline-flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Live · 24/7 Dispatch
                </span>
                <span className="inline-flex items-center gap-1 font-bold rounded-full bg-white/5 px-2.5 py-3 text-emerald-400 border border-emerald-400/60 text-[11px]">
                  <Icon
                    icon={clockOutlineIcon}
                    width={14}
                    height={14}
                    className="text-emerald-400 "
                  />
                  Fast Pick-Up
                </span>
              </div>
              </div>

              {/* Desktop CTA */}
              <motion.div
                className="hidden sm:inline-flex"
                whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
                whileTap={!prefersReducedMotion ? { scale: 0.97 } : {}}
              >
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-[0_12px_30px_rgba(0,0,0,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-(--brand-primary) focus-visible:ring-(--brand-accent)"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand-accent), var(--brand-primary))",
                    color: "white",
                  }}
                >
                  <span>Book Now</span>
                  <Icon icon={planeIcon} width={16} height={16} aria-hidden />
                </Link>
              </motion.div>

              {/* Mobile burger */}
              <button
                id={triggerId}
                onClick={() => setOpen((s) => !s)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-haspopup="true"
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-full bg-white hover:bg-white/10 border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-(--brand-primary) focus-visible:ring-(--brand-accent)"
              >
                <span className="sr-only">Toggle menu</span>
                <Icon
                  icon={open ? closeIcon : menuIcon}
                  width={22}
                  height={22}
                />
              </button>
            </div>

            {/* MOBILE DROPDOWN */}
            <AnimatePresence>
              {open && (
                <motion.div
                  id="mobile-menu"
                  key="mobile"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
                  className="lg:hidden absolute left-0 right-0 top-[calc(100%+0.75rem)] rounded-3xl bg-[rgba(5,10,20,0.98)] border border-white/10 shadow-2xl overflow-hidden"
                  ref={mobileMenuRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={triggerId}
                >
                  <div className="px-4 pt-4 pb-5">
                    {/* mini summary – simplified */}
                    <div className="mb-3 flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2 border border-white/10">
                      <div className="flex flex-col text-[11px] text-(--brand-neutral)">
                        <span className="uppercase tracking-[0.16em] text-[9px] text-(--brand-neutral)/60">
                          Active route
                        </span>
                        <span className="text-[11px] font-medium">
                          City ↔ Larnaca Airport
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-400/60 px-2 py-0.5 text-emerald-300 text-[10px]">
                          24/7
                        </span>
                        <Icon
                          icon={planeIcon}
                          width={16}
                          height={16}
                          className="text-(--brand-accent)"
                          aria-hidden
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      {navLinks.map((l, idx) => {
                        const active = isActive(l.href);
                        return (
                          <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className={[
                              "block text-[15px] font-medium py-2 rounded-xl px-2 transition-colors",
                              active
                                ? "bg-white text-(--brand-primary)"
                                : "text-(--brand-neutral) hover:bg-white/5",
                            ].join(" ")}
                            ref={idx === 0 ? firstLinkRef : undefined}
                          >
                            {l.label}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="pt-4">
                      <motion.a
                        whileHover={
                          !prefersReducedMotion ? { scale: 1.02 } : {}
                        }
                        whileTap={!prefersReducedMotion ? { scale: 0.98 } : {}}
                        href="/booking"
                        onClick={() => setOpen(false)}
                        className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--brand-accent), var(--brand-primary))",
                          color: "white",
                        }}
                      >
                        Book Now
                      </motion.a>
                    </div>

                    <div className="flex flex-col gap-1 text-sm text-(--brand-neutral)/80 border-t border-white/10 mt-3 pt-3">
                      <a href="tel:+35712345678">Call us: +357 12 345678</a>
                      <a href="mailto:info@firstclass.cy">booking@firstclasstransfers.eu</a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
