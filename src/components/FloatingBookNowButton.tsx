"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function FloatingBookNowButton() {
  const pathname = usePathname();

  // ❌ Hide on booking pages and admin pages
  if (
    pathname?.startsWith("/booking") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/drivers")
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed bottom-5 right-5 z-50"
    >
      <Link
        href="/booking"
        className="px-6 py-3 rounded-full shadow-xl text-white text-sm sm:text-base font-semibold
                   flex items-center gap-2 transition-all duration-300 bg-linear-to-br 
                   from-[#b07208] to-[#162c4b]
                   hover:shadow-2xl hover:scale-[1.05] active:scale-[0.97]"
        style={{ backdropFilter: "blur(4px)" }}
      >
        Book Now
      </Link>
    </motion.div>
  );
}
