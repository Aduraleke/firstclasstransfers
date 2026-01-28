"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import calendarIcon from "@iconify/icons-mdi/calendar-clock";
import mapIcon from "@iconify/icons-mdi/map-marker-path";
import cashIcon from "@iconify/icons-mdi/cash";
import {
  AssignedBooking,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getAssignedBookingsByDriver(driverId);
        setBookings(res.results);
      } catch {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [driverId]);

  const filteredBookings = useMemo(() => {
    if (activeTab === "all") return bookings;
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

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
              className={`px-4 py-1.5 rounded-full text-xs transition whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-[#b07208] text-black"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
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
      ) : filteredBookings.length === 0 ? (
        <p className="text-white/50">No bookings in this category.</p>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.booking_id} booking={booking} />
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
            {booking.route.from_location} → {booking.route.to_location}
          </h3>
          <p className="text-xs text-white/50">
            Booking ID · {booking.booking_id}
          </p>
        </div>

        <StatusPill status={booking.status} />
      </div>

      {/* DETAILS */}
      <div className="grid sm:grid-cols-2 gap-3 text-sm text-white/70">
        <div className="flex items-center gap-2">
          <Icon icon={calendarIcon} width={16} />
          {booking.pickup_date} · {booking.pickup_time}
        </div>

        <div className="flex items-center gap-2">
          <Icon icon={mapIcon} width={16} />
          {booking.route.distance} · {booking.route.time}
        </div>

        <div className="flex items-center gap-2">
          <Icon icon={cashIcon} width={16} />
          {booking.payment_type} ({booking.payment_status})
        </div>

        <div className="font-semibold text-[#f3c97a]">
          €{booking.price}
        </div>
      </div>

      {/* PASSENGER */}
      <div className="mt-3 text-xs text-white/50">
        Passenger · {booking.passenger_information.full_name} ·{" "}
        {booking.passenger_information.phone_number}
      </div>
    </motion.div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed: "bg-green-500/20 text-green-300",
    Pending: "bg-yellow-500/20 text-yellow-300",
    Cancelled: "bg-red-500/20 text-red-300",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full ${
        styles[status] ?? "bg-white/10 text-white/60"
      }`}
    >
      {status}
    </span>
  );
}
