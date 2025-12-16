"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { Icon } from "@iconify/react";
import leafIcon from "@iconify/icons-mdi/leaf";
import usersGroup from "@iconify/icons-mdi/account-group";
import carSports from "@iconify/icons-mdi/car-sports";

const BRAND = {
  gold: "#b07208",
  navy: "#050814",
};

const FLEET = [
  {
    id: "sedan",
    title: "Business & Comfort Sedans",
    subtitle: "Mercedes E-Class or similar · up to 4 passengers",
    desc: "Perfect for airport transfers, corporate travel and executive guests. Quiet ride, leather interiors and discreet presence.",
    img: "/ford-carpri.jpg", // update with your real sedan image
    icon: carSports,
    highlights: ["Up to 4 passengers", "2–3 suitcases", "Ideal for business"],
  },
  {
    id: "vclass",
    title: "Mercedes V-Class Premium Minivan",
    subtitle: "Up to 6 passengers · VIP-style comfort",
    desc: "Spacious cabin with room for family, friends and luggage. Popular for groups, weddings, events and VIP transfers.",
    img: "/mercedesVclass.jpg",
    icon: usersGroup,
    tag: "Most Requested",
    highlights: ["Up to 6 passengers", "Family & group friendly", "Extra luggage space"],
  },
  {
    id: "capri",
    title: "Ford Capri — All-Electric",
    subtitle: "Eco-friendly · up to 4 passengers",
    desc: "A smooth, all-electric ride for guests who care about quieter, cleaner travel without sacrificing comfort.",
    img: "/capri-sedan.jpeg",
    icon: leafIcon,
    tag: "Electric",
    highlights: ["Zero local emissions", "Quiet & smooth", "Ideal for city trips"],
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function FleetSection() {
  return (
    <section className="relative bg-[#04050B] text-white py-24 sm:py-28 overflow-hidden">
      {/* background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55] -z-20"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(176,114,8,0.3), transparent 55%), radial-gradient(circle at 80% 80%, rgba(15,23,42,0.85), transparent 58%)",
        }}
      />

      {/* soft grid overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15)_0,transparent_55%),linear-gradient(to_bottom,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(to_right,rgba(148,163,184,0.18)_1px,transparent_1px)] bg-size-[100%_100%,80px_80px,80px_80px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* heading + mini stats */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between mb-16">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(74,222,128,0.35)]" />
              Our Fleet
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold leading-tight">
              Comfort, space and a cleaner way
              <span className="block text-[rgba(229,231,235,0.88)]">
                to travel across Cyprus
              </span>
            </h2>
            <p className="mt-4 text-sm sm:text-[15px] text-white/75 leading-relaxed">
              Every vehicle in our fleet is carefully selected for safety, comfort and
              reliability with professional drivers, Wi-Fi on board and an electric
              option for greener journeys.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-[11px]">
            <FleetStat
              label="Average driver rating"
              value="4.9/5"
              icon="mdi:star-circle"
            />
            <FleetStat
              label="Baby / child seats"
              value="On request"
              icon="mdi:shield-check"
            />
            <FleetStat
              label="Wi-Fi & water"
              value="Included"
              icon="mdi:wifi"
            />
          </div>
        </div>

        {/* fleet cards */}
        <div className="space-y-12 sm:space-y-14">
          {FLEET.map((v, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={v.id}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut", // cast to satisfy TS
                  delay: i * 0.1,
                }}
                className={[
                  "grid gap-8 lg:gap-12 items-center",
                  "lg:grid-cols-2",
                  isEven ? "" : "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
                ].join(" ")}
              >
                {/* image wrapper */}
                <motion.div
                  whileHover={{ scale: 1.03, rotateX: 3, rotateY: -2 }}
                  transition={{ type: "spring", stiffness: 70, damping: 14 }}
                  className="relative rounded-4xl overflow-hidden bg-black shadow-[0_26px_80px_rgba(0,0,0,0.85)] border border-white/5"
                >
                  {/* subtle inner gradient */}
                  <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_15%_0%,rgba(176,114,8,0.3),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(15,23,42,0.8),transparent_50%)]" />

                  <Image
                    src={v.img}
                    alt={v.title}
                    width={980}
                    height={640}
                    className="object-cover w-full h-[260px] sm:h-80 lg:h-[380px]"
                    priority={i === 0}
                  />

                  {/* bottom gold streak */}
                  <div
                    className="absolute inset-x-10 bottom-4 h-0.5 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${BRAND.gold}, transparent)`,
                      opacity: 0.9,
                    }}
                  />
                </motion.div>

                {/* details */}
                <div className="relative max-w-[480px]">
                  {/* floating accent bar */}
                  <div
                    className="pointer-events-none absolute -left-6 top-2 h-10 w-0.5 rounded-full hidden sm:block"
                    style={{
                      background: `linear-gradient(to bottom, ${BRAND.gold}, transparent)`,
                      opacity: 0.9,
                    }}
                  />

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/80 mb-3">
                    <Icon icon={v.icon} width={16} height={16} />
                    <span>{v.subtitle}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-semibold text-white">
                      {v.title}
                    </h3>
                    {v.tag && (
                      <span
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-3 py-1 border"
                        style={{
                          backgroundColor: "rgba(176,114,8,0.12)",
                          borderColor: "rgba(176,114,8,0.6)",
                          color: BRAND.gold,
                        }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgba(250,204,21,0.95)]" />
                        {v.tag}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-[14px] text-white/75 leading-relaxed">
                    {v.desc}
                  </p>

                  {/* highlights */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {v.highlights?.map((h) => (
                      <div
                        key={h}
                        className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/5 px-3 py-2 text-[12px] text-white/80"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* micro copy */}
                  <p className="mt-4 text-[11px] text-white/55">
                    All vehicles include air-conditioning, licensed professional drivers,
                    and full insurance. Child seats are available on request at no extra
                    cost.
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

    
      </div>
    </section>
  );
}

type FleetStatProps = {
  label: string;
  value: string;
  icon: string;
};

function FleetStat({ label, value, icon }: FleetStatProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-[11px] text-white/60">
        <Icon icon={icon} width={14} height={14} />
        <span>{label}</span>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
