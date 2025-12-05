"use client";

import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import helpIcon from "@iconify/icons-mdi/comment-question";
import airplaneIcon from "@iconify/icons-mdi/airplane";
import checkIcon from "@iconify/icons-mdi/check-circle";

const BRAND = {
  primary: "#162c4b",
  accent: "#b07208",
};

const FAQS = [
  {
    q: "Do you charge extra at night?",
    a: "No. Our prices are fixed 24/7 — no night or weekend surcharges for pre-booked transfers.",
  },
  {
    q: "Is the price per person or per vehicle?",
    a: "All fares are per vehicle. Sedans carry up to 4 passengers, V-Class up to 6.",
  },
  {
    q: "What happens if my flight is delayed?",
    a: "We track your flight and adjust pickup accordingly. Normal delays are not charged extra.",
  },
  {
    q: "Can I get a child seat?",
    a: "Yes — baby and child seats are free. Just tell us age/approx. weight when booking.",
  },
];
 
export default function FaqTeaser() {
  return (
    <section className="relative bg-white text-slate-900 py-24 sm:py-28 overflow-hidden">
      {/* travel path decoration */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(176,114,8,0.22) 1px, transparent 3px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* rotating airplane path */}
      <motion.div
        className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full border border-[rgba(176,114,8,0.35)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        <Icon
          icon={airplaneIcon}
          width={24}
          height={24}
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-[rgba(176,114,8,0.9)]"
        />
      </motion.div>

      <div className="relative mx-auto max-w-6xl px-4 text-center mb-16">
        <p className="uppercase tracking-[0.25em] text-[11px] text-slate-500">
          Have Questions?
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold mt-2 mb-4">
          Have Questions?
        </h2>
        <p className="text-sm sm:text-[15px] text-slate-600 max-w-xl mx-auto">
          Here are some of the things travellers ask most before booking.
        </p>
      </div>

      {/* FAQ cards */}
      <div className="grid gap-6 px-5 sm:px-6 max-w-5xl mx-auto sm:grid-cols-2">
        {FAQS.map((f, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 140, damping: 12 }}
            className="group rounded-2xl bg-white border border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.08)]
                       px-6 py-5 text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon
                icon={helpIcon}
                width={18}
                height={18}
                className="text-[rgba(176,114,8,0.9)]"
              />
              <h3 className="font-semibold text-[15px]">{f.q}</h3>
            </div>

            <p className="text-[13px] text-slate-600 leading-relaxed">
              {f.a}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 text-center">
        <a
          href="/faqs"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          style={{
            background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.primary})`,
          }}
        >
          View All FAQs
          <Icon icon={checkIcon} width={16} height={16} />
        </a>
      </div>
    </section>
  );
}
