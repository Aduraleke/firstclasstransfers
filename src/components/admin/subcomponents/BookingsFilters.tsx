"use client";

import { Icon } from "@iconify/react";

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

export const BookingsFilters: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const update = <K extends keyof BookingFilters>(
    key: K,
    value: BookingFilters[K],
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  const base =
    "w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#b07208]";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">

      <div className="relative">
        <Icon
          icon="mdi:account"
          className="absolute left-3 top-3 text-slate-500"
        />
        <input
          placeholder="Passenger name"
          value={filters.passenger_name}
          onChange={(e) => update("passenger_name", e.target.value)}
          className={`${base} pl-10`}
        />
      </div>

      <input
        placeholder="From"
        value={filters.from_location}
        onChange={(e) => update("from_location", e.target.value)}
        className={base}
      />

      <input
        placeholder="To"
        value={filters.to_location}
        onChange={(e) => update("to_location", e.target.value)}
        className={base}
      />

      <input
        type="date"
        value={filters.pickup_date}
        onChange={(e) => update("pickup_date", e.target.value)}
        className={base}
      />

      <input
        type="date"
        value={filters.return_date}
        onChange={(e) => update("return_date", e.target.value)}
        className={base}
      />

      <input
        placeholder="Vehicle type"
        value={filters.vehicle_type}
        onChange={(e) => update("vehicle_type", e.target.value)}
        className={base}
      />

      <select
        value={filters.status}
        onChange={(e) => update("status", e.target.value)}
        className={base}
      >
        <option value="all">All status</option>
        <option value="Pending">Pending</option>
        <option value="Assigned">Assigned</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
  );
};
