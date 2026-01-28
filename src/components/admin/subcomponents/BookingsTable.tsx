"use client";

import { Icon } from "@iconify/react";
import { Booking } from "@/lib/api/admin/types";

interface Props {
  bookings: Booking[];
  loading: boolean;
  onViewBooking: (b: Booking) => void;
  onAssignDriver: (b: Booking) => void;
}

export const BookingsTable: React.FC<Props> = ({
  bookings,
  loading,
  onViewBooking,
  onAssignDriver,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Icon icon="mdi:loading" className="mr-3 animate-spin text-2xl" />
        Loading bookings…
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-900/80">
          <tr className="text-xs uppercase tracking-wider text-slate-400 border-b border-white/5">
            <th className="px-5 py-4 text-left">Customer</th>
            <th className="px-5 py-4 text-left">Route</th>
            <th className="px-5 py-4 text-left">Date</th>
            <th className="px-5 py-4 text-left">Payment</th>
            <th className="px-5 py-4 text-left">Status</th>
            <th className="px-5 py-4 text-left">Driver</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {bookings.map((b) => (
            <tr
              key={b.id}
              className="hover:bg-white/5 transition"
            >
              {/* CUSTOMER */}
              <td className="px-5 py-4">
                <p className="font-medium text-white capitalize">
                  {b.customerName}
                </p>
                <p className="text-xs text-slate-400">
                  {b.email}
                </p>
              </td>

              {/* ROUTE */}
              <td className="px-5 py-4 text-slate-300">
                {b.airport} → {b.destination}
                <div className="text-xs text-slate-500">
                  {b.vehicleType ?? "No vehicle"}
                </div>
              </td>

              {/* DATE */}
              <td className="px-5 py-4">
                <div className="text-slate-300">{b.date}</div>
                <div className="text-xs text-slate-500">{b.time}</div>
              </td>

              {/* PAYMENT */}
              <td className="px-5 py-4">
                <div className="font-semibold text-white">
                  {b.price ? `€${b.price}` : "—"}
                </div>
                <div className="text-xs text-slate-500">
                  {b.paymentMethod}
                </div>
              </td>

              {/* STATUS */}
              <td className="px-5 py-4 space-y-1">
                <StatusPill status={b.status} />
                <StatusPill status={b.paymentStatus} subtle />
              </td>

              {/* DRIVER */}
              <td className="px-5 py-4 text-slate-300">
                {b.driver ?? "Unassigned"}
              </td>

              {/* ACTIONS */}
              <td className="px-5 py-4 text-right">
                <div className="inline-flex gap-2">
                  <button
                    onClick={() => onViewBooking(b)}
                    className="rounded-lg p-2 hover:bg-white/10"
                  >
                    <Icon icon="mdi:eye-outline" />
                  </button>
                  <button
                    onClick={() => onAssignDriver(b)}
                    className="rounded-lg p-2 hover:bg-white/10"
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
                colSpan={7}
                className="px-6 py-10 text-center text-slate-400"
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

function StatusPill({
  status,
  subtle = false,
}: {
  status: string;
  subtle?: boolean;
}) {
  const map: Record<string, string> = {
    Pending: "bg-yellow-500/15 text-yellow-400",
    Assigned: "bg-blue-500/15 text-blue-400",
    Completed: "bg-emerald-500/15 text-emerald-400",
    Cancelled: "bg-red-500/15 text-red-400",
  };

  return (
    <span
      className={`
        inline-block rounded-full px-3 py-1 text-xs font-medium
        ${map[status] ?? "bg-white/10 text-slate-300"}
        ${subtle ? "opacity-70" : ""}
      `}
    >
      {status}
    </span>
  );
}
