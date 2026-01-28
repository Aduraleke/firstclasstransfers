"use client";


import { Booking } from "@/lib/api/admin/types";
import { Icon } from "@iconify/react";

import { BookingsFilters } from "./subcomponents/BookingsFilters";
import { BookingsTable } from "./subcomponents/BookingsTable";

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

export const BookingsView: React.FC<Props> = ({
  bookings,
  loading,
  filters,
  setFilters,
  onExport,
  onViewBooking,
  onAssignDriver,
}) => {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Bookings
          </h1>
          <p className="text-sm text-slate-400">
            Search, manage and assign trips
          </p>
        </div>

        <button
          onClick={onExport}
          className="
            inline-flex items-center gap-2
            rounded-xl px-5 py-2.5 text-sm font-semibold
            bg-[#162c4b] text-white
            hover:brightness-110 transition
          "
        >
          <Icon icon="mdi:download" />
          Export CSV
        </button>
      </div>

      {/* MAIN PANEL */}
      <div className="
        rounded-2xl
        bg-slate-900/60
        border border-white/5
        backdrop-blur
      ">
        {/* FILTERS */}
        <div className="border-b border-white/5 px-6 py-5">
          <BookingsFilters
            filters={filters}
            setFilters={setFilters}
          />
        </div>

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
