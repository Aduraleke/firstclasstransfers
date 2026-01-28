"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import carIcon from "@iconify/icons-mdi/car";

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-[#020513] flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-5xl h-24">

        {/* ROAD */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />

        {/* CAR */}
        <motion.div
          initial={{ x: "-10%" }}
          animate={{ x: "110%" }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 -translate-y-1/2"
        >
          <Icon
            icon={carIcon}
            width={48}
            height={48}
            className="text-[#b07208]"
          />
        </motion.div>
      </div>
    </div>
  );
}
