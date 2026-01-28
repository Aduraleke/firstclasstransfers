"use client";

import { Icon } from "@iconify/react";

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
  filters: BookingFilters;
  setFilters: (v: BookingFilters) => void;
}

/* ───────────────── COMPONENT ───────────────── */

export const BookingsFilters: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const update = <K extends keyof BookingFilters>(
    key: K,
    value: BookingFilters[K],
  ) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {/* Passenger */}
      <div className="relative">
        <Icon
          icon="mdi:account"
          className="absolute left-3 top-2.5 text-slate-500"
        />
        <input
          placeholder="Passenger name"
          value={filters.passenger_name}
          onChange={(e) => update("passenger_name", e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-white"
        />
      </div>

      {/* From */}
      <input
        placeholder="From location"
        value={filters.from_location}
        onChange={(e) => update("from_location", e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white"
      />

      {/* To */}
      <input
        placeholder="To location"
        value={filters.to_location}
        onChange={(e) => update("to_location", e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white"
      />

      {/* Pickup date */}
      <input
        type="date"
        value={filters.pickup_date}
        onChange={(e) => update("pickup_date", e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white"
      />

      {/* Return date */}
      <input
        type="date"
        value={filters.return_date}
        onChange={(e) => update("return_date", e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white"
      />

      {/* Vehicle */}
      <input
        placeholder="Vehicle type (e.g. V-Class)"
        value={filters.vehicle_type}
        onChange={(e) => update("vehicle_type", e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white"
      />

      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) => update("status", e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white"
      >
        <option value="all">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Assigned">Assigned</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
  );
};
