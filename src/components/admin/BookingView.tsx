"use client";

import { BRAND } from "./brand";
import { Booking } from "@/lib/api/admin/types";
import { Icon } from "@iconify/react";

import { BookingsFilters } from "./subcomponents/BookingsFilters";
import { BookingsTable } from "./subcomponents/BookingsTable";

/* ───────────────── TYPES ───────────────── */

export interface BookingFilters {
  passenger_name: string;
  from_location: string;
  to_location: string;
  pickup_date: string;
  return_date: string;
  vehicle_type: string;
  status: string;
}

interface Props {
  bookings: Booking[];
  loading: boolean;
  filters: BookingFilters;
  setFilters: (v: BookingFilters) => void;
  onExport: () => void;
  onViewBooking: (b: Booking) => void;
  onAssignDriver: (b: Booking) => void;
}



/* ───────────────── COMPONENT ───────────────── */

export const BookingsView: React.FC<Props> = ({
  bookings,
  loading,
  filters,
  setFilters,
  onExport,
  onViewBooking,
  onAssignDriver,
}) => {

  console.log(bookings)
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Bookings Management
        </h1>

        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: BRAND.navy }}
        >
          <Icon icon="mdi:download" />
          Export CSV
        </button>
      </div>

      {/* CONTENT */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        {/* FILTERS */}
        <BookingsFilters
          filters={filters}
          setFilters={setFilters}
        />

        {/* TABLE */}
        <BookingsTable
          bookings={bookings}
          loading={loading}
          onViewBooking={onViewBooking}
          onAssignDriver={onAssignDriver}
        />
      </div>
    </div>
  );
};
