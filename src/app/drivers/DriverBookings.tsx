"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import calendarIcon from "@iconify/icons-mdi/calendar-clock";
import mapIcon from "@iconify/icons-mdi/map-marker-path";
import cashIcon from "@iconify/icons-mdi/cash";

import {
  AssignedBooking,
  BookingStatus,
  getAssignedBookingsByDriver,
} from "@/lib/api/drivers/driverUser";

/* ───────────────── CONSTANTS ───────────────── */

const TABS = [
  { key: "all", label: "All" },
  { key: "Pending", label: "Pending" },
  { key: "Completed", label: "Completed" },
  { key: "Cancelled", label: "Cancelled" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/* ───────────────── COMPONENT ───────────────── */

export default function DriverBookings({ driverId }: { driverId: number }) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [bookings, setBookings] = useState<AssignedBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ───────── FETCH BOOKINGS ───────── */
  useEffect(() => {
    let cancelled = false;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        const status =
          activeTab === "all"
            ? undefined
            : (activeTab as BookingStatus);

        const res = await getAssignedBookingsByDriver(driverId, {
          status,
          page: 1,
          pageSize: 10,
        });

        if (!cancelled) {
          setBookings(res.results);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load bookings.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      cancelled = true;
    };
  }, [driverId, activeTab]);

  return (
    <div className="space-y-6">
      {/* HEADER + TABS */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Your Bookings
        </h2>

        <div className="flex gap-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              disabled={loading}
              className={`px-4 py-1.5 rounded-full text-xs transition whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-[#b07208] text-black"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-white/60">Loading bookings…</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="text-white/50">
          No bookings in this category.
        </p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.bookingId}
              booking={booking}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────── BOOKING CARD ───────────────── */

function BookingCard({ booking }: { booking: AssignedBooking }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/5 border border-white/10 p-5"
    >
      {/* TOP */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-white">
            {booking.route.fromLocation} →{" "}
            {booking.route.toLocation}
          </h3>
          <p className="text-xs text-white/50">
            Booking ID · {booking.bookingId}
          </p>
        </div>

        <StatusPill status={booking.status} />
      </div>

      {/* DETAILS */}
      <div className="grid sm:grid-cols-2 gap-3 text-sm text-white/70">
        <div className="flex items-center gap-2">
          <Icon icon={calendarIcon} width={16} />
          {booking.pickupDate} · {booking.pickupTime}
        </div>

        <div className="flex items-center gap-2">
          <Icon icon={mapIcon} width={16} />
          {booking.route.distance} · {booking.route.time}
        </div>

        <div className="flex items-center gap-2">
          <Icon icon={cashIcon} width={16} />
          {booking.paymentType} ({booking.paymentStatus})
        </div>

        <div className="font-semibold text-[#f3c97a]">
          €{booking.price}
        </div>
      </div>

      {/* PASSENGER */}
      <div className="mt-3 text-md text-white/50 capitalize">
        Passenger ·{" "}
        {booking.passengerInformation?.fullName ??
          "Unknown"}{" "}
        ·{" "}
        {booking.passengerInformation?.phoneNumber ??
          "—"}
      </div>
    </motion.div>
  );
}

/* ───────────────── STATUS PILL ───────────────── */

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed: "bg-green-500/20 text-green-300",
    Pending: "bg-yellow-500/20 text-yellow-300",
    Cancelled: "bg-red-500/20 text-red-300",
    Assigned: "bg-blue-500/20 text-blue-300",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full ${
        styles[status] ??
        "bg-white/10 text-white/60"
      }`}
    >
      {status}
    </span>
  );
}
