"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import type { IconifyIcon } from "@iconify/react";
import phoneIcon from "@iconify/icons-mdi/phone";
import emailIcon from "@iconify/icons-mdi/email";
import licenseIcon from "@iconify/icons-mdi/card-account-details-outline";
import statusIcon from "@iconify/icons-mdi/account-check-outline";
import logoutIcon from "@iconify/icons-mdi/logout";

import {
  DriverDashboardResponse,
  getDriverDashboard,
} from "@/lib/api/drivers/driverUser";

import DriverBookings from "./DriverBookings";
import { useRouter } from "next/navigation";
import { useDriverAuthStore } from "@/lib/api/drivers/driverAuthStore";

export default function DriverPage() {
  const [driver, setDriver] =
    useState<DriverDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

 const token = useDriverAuthStore((s) => s.token);
const logout = useDriverAuthStore((s) => s.logout);


  /* ───────── AUTH GUARD ───────── */
  useEffect(() => {
    if (!token) {
      router.replace("/drivers/login");
    }
  }, [token, router]);

  /* ───────── FETCH DASHBOARD ───────── */
  useEffect(() => {
    if (!token) return;

    const fetchDashboard = async () => {
      try {
        const res = await getDriverDashboard();
        setDriver(res);
      } catch {
        setError("Failed to load driver dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  const handleLogout = () => {
    logout();
    router.replace("/drivers/login");
  };

  /* ───────── BLOCK RENDER ───────── */
  if (!token) {
    return null; // prevents UI flash
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard…
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error ?? "Driver not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020513] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* ───────── PROFILE ───────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-black/70 border border-white/10 backdrop-blur p-6 shadow-[0_18px_50px_rgba(0,0,0,0.8)]"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-full bg-white/10 overflow-hidden">
                {driver.dp ? (
                  <Image
                    src={driver.dp}
                    alt={driver.fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white/40 text-sm">
                    No photo
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-xl font-semibold">
                  {driver.fullName}
                </h1>
                <p className="text-sm text-white/60">
                  Driver ID · {driver.id}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="
                flex items-center gap-2 rounded-xl
                bg-red-500/10 border border-red-500/20
                px-3 py-2 text-xs text-red-300
                hover:bg-red-500/20 transition
              "
            >
              <Icon icon={logoutIcon} width={16} />
              Logout
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <InfoItem icon={emailIcon} label="Email" value={driver.email} />
            <InfoItem icon={phoneIcon} label="Phone" value={driver.phoneNumber} />
            <InfoItem icon={licenseIcon} label="License" value={driver.licenseNumber} />
            <InfoItem
              icon={statusIcon}
              label="Status"
              value={driver.isActive ? "Active" : "Inactive"}
              badge
            />
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-white/50">
            Joined on {new Date(driver.dateJoined).toLocaleDateString()}
          </div>
        </motion.div>

        {/* ───────── BOOKINGS ───────── */}
        <DriverBookings driverId={driver.id} />
      </div>
    </div>
  );
}

/* ───────────────── INFO ITEM ───────────────── */

function InfoItem({
  icon,
  label,
  value,
  badge = false,
}: {
  icon: IconifyIcon;
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
      <div className="flex items-center gap-2 text-xs text-white/60 mb-1">
        <Icon icon={icon} width={14} />
        {label}
      </div>

      <div
        className={`text-sm ${
          badge
            ? "inline-flex px-3 py-1 rounded-full bg-[#b07208]/20 text-[#f3c97a]"
            : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
