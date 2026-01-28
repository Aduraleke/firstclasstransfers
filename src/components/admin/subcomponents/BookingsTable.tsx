"use client";

import { Icon } from "@iconify/react";
import { Booking } from "@/lib/api/admin/types";

/* ───────────────── TYPES ───────────────── */

interface Props {
  bookings: Booking[];
  loading: boolean;
  onViewBooking: (b: Booking) => void;
  onAssignDriver: (b: Booking) => void;

  
}

/* ───────────────── COMPONENT ───────────────── */

export const BookingsTable: React.FC<Props> = ({
  bookings,
  loading,
  onViewBooking,
  onAssignDriver,
}) => {
  
  /* LOADING STATE */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Icon
          icon="mdi:loading"
          className="mr-3 animate-spin text-3xl"
        />
        Fetching bookings…
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Route</th>
            <th className="px-4 py-3">Date & Time</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Driver</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr
              key={b.id}
              className="border-b border-slate-800/60 hover:bg-slate-800/60"
            >
              {/* ID */}
              <td className="px-4 py-3 font-medium text-slate-100">
                {b.id}
              </td>

              {/* CUSTOMER */}
              <td className="px-4 py-3">
                <p className="font-medium text-slate-100">
                  {b.customerName}
                </p>
                <p className="text-xs text-slate-400">{b.email}</p>
              </td>

              {/* ROUTE */}
              <td className="px-4 py-3">
                {b.airport} → {b.destination}
                <div className="text-xs text-slate-400">
                  {b.vehicleType ?? "No vehicle"}
                </div>
              </td>

              {/* DATE */}
              <td className="px-4 py-3">
                <div>{b.date}</div>
                <div className="text-xs text-slate-400">{b.time}</div>
              </td>

              {/* PAYMENT */}
              <td className="px-4 py-3">
                <div className="font-semibold">
                  {b.price !== null ? `€${b.price}` : "—"}
                </div>
                <div className="text-xs text-slate-400">
                  {b.paymentMethod}
                </div>
              </td>

              {/* STATUS */}
              <td className="px-4 py-3">
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-800">
                  {b.status}
                </span>
                <div className="mt-1">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-800">
                    {b.paymentStatus}
                  </span>
                </div>
              </td>

              {/* DRIVER */}
              <td className="px-4 py-3">
                {b.driver ?? "Unassigned"}
              </td>

              {/* ACTIONS */}
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewBooking(b)}
                    className="rounded-lg p-1.5 hover:bg-slate-700"
                  >
                    <Icon icon="mdi:eye-outline" />
                  </button>
                  <button
                    onClick={() => onAssignDriver(b)}
                    className="rounded-lg p-1.5 hover:bg-slate-700"
                  >
                    <Icon icon="mdi:car-outline" />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {bookings.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-8 text-center text-slate-400"
              >
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
