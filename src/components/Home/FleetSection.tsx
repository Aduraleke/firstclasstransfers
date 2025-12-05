"use client";

import React from "react";
import { motion } from "framer-motion";
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
    desc: "Ideal for most airport transfers, business trips and city-to-city rides — quiet, comfortable and stylish.",
    img: "/ford-carpri.jpg", // Replace with your real image
    icon: carSports,
  },
  {
    id: "vclass",
    title: "Mercedes V-Class Premium Minivan",
    subtitle: "Up to 6 passengers · VIP-style comfort",
    desc: "Spacious beige interior, room for bags & buggies, and a smooth ride — perfect for families or groups.",
    img: "/mercedesVclass.jpg",
    icon: usersGroup,
    tag: "Most Requested",
  },
  {
    id: "capri",
    title: "Ford Capri — All-Electric",
    subtitle: "Eco-friendly · up to 4 passengers",
    desc: "A quieter, smoother and lower-emission ride — for guests who care about sustainability.",
    img: "/capri.jpg",
    icon: leafIcon,
    tag: "Electric",
  },
];

export default function FleetSection() {
  return (
    <section className="relative bg-[#04050B] text-white py-28 overflow-hidden">
      {/* subtle lighting */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45] -z-20"
        style={{
          background:
            "radial-gradient(circle at 25% 30%, rgba(176,114,8,0.25), transparent 55%), radial-gradient(circle at 70% 75%, rgba(22,44,75,0.35), transparent 60%)",
        }}
      />

      <div className="text-center max-w-4xl mx-auto px-4 mb-16">
        <p className="uppercase tracking-[0.25em] text-[11px] text-white/60">
          Our Fleet – Comfort, Space & Cleaner Travel
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold mt-3 leading-tight">
          Our Fleet – Comfort, Space & Cleaner Travel
        </h2>
        <p className="text-sm sm:text-[15px] text-white/75 mt-4 leading-relaxed">
          We select vehicles for comfort, safety and reliability, with modern
          amenities, licensed drivers and an all-electric option for greener travel.
        </p>
      </div>

      {/* fleet cards */}
      <div className="flex flex-col gap-12 max-w-6xl mx-auto px-4">
        {FLEET.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
            className="grid lg:grid-cols-2 gap-10 items-center"
          >
            {/* image */}
            <motion.div
              whileHover={{ scale: 1.04, rotateX: 2, rotateY: -2 }}
              transition={{ type: "spring", stiffness: 70 }}
              className="relative rounded-[34px] overflow-hidden bg-black shadow-[0_28px_80px_rgba(0,0,0,0.75)]"
            >
              <Image
                src={v.img}
                alt={v.title}
                width={900}
                height={600}
                className="object-cover w-full h-[300px] sm:h-[360px] lg:h-[420px]"
              />

              {/* gold light streak */}
              <div
                className="absolute inset-x-0 bottom-0 h-1.5"
                style={{
                  background: `linear-gradient(90deg, transparent, ${BRAND.gold}, transparent)`,
                  opacity: 0.7,
                }}
              />
            </motion.div>

            {/* details */}
            <div className="space-y-5 max-w-[480px]">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-white/85">
                <Icon icon={v.icon} width={20} height={20} />
                {v.subtitle}
              </div>

              <h3 className="text-2xl font-semibold text-white">{v.title}</h3>

              <p className="text-white/70 text-[14px] leading-relaxed">
                {v.desc}
              </p>

              {v.tag && (
                <span
                  className="inline-block mt-2 text-[11px] font-semibold rounded-full px-3 py-1 border"
                  style={{
                    backgroundColor: "rgba(176,114,8,0.14)",
                    borderColor: "rgba(176,114,8,0.5)",
                    color: BRAND.gold,
                  }}
                >
                  {v.tag}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-20">
        <a
          href="/fleet"
          className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
          style={{
            background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.navy})`,
          }}
        >
          View Our Full Fleet
          <Icon icon="mdi:arrow-right" width={16} height={16} />
        </a>
      </div>
    </section>
  );
}
