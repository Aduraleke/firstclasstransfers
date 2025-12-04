"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import gaugeIcon from "@iconify/icons-mdi/view-dashboard-outline";
import calendarIcon from "@iconify/icons-mdi/calendar-clock";
import cashIcon from "@iconify/icons-mdi/cash-multiple";
import carIcon from "@iconify/icons-mdi/car-estate";
import cogIcon from "@iconify/icons-mdi/cog-outline";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: gaugeIcon },
  { href: "/admin/bookings", label: "Bookings", icon: calendarIcon },
  { href: "/admin/pricing", label: "Pricing", icon: cashIcon },
  { href: "/admin/drivers", label: "Drivers", icon: carIcon },
  { href: "/admin/settings", label: "Settings", icon: cogIcon },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <aside className="hidden md:flex md:flex-col w-60 lg:w-64 border-r border-white/10 bg-[#050814]/95">
      <div className="px-4 pt-4 pb-3 border-b border-white/10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">
          Admin
        </p>
        <p className="text-xs text-white/70 mt-1">
          First Class Transfers · Cyprus
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-[13px] transition-colors",
                active
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-white/70 hover:bg-white/5",
              ].join(" ")}
            >
              <Icon icon={link.icon} width={18} height={18} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-4 pt-2 border-t border-white/10 text-[11px] text-white/55">
        <p>Dispatch center · 24/7</p>
        <p className="mt-0.5">LCA &amp; PFO coverage</p>
      </div>
    </aside>
  );
};
