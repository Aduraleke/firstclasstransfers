"use client";

import React from "react";
import { BookingRow } from "@/lib/admin/mocBookings";
import { Icon } from "@iconify/react";
import airplaneIcon from "@iconify/icons-mdi/airplane";

type Props = {
  bookings: BookingRow[];
};

function statusBadge(status: BookingRow["status"]) {
  const base = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium";
  switch (status) {
    case "Confirmed":
      return `${base} bg-emerald-500/10 text-emerald-300 border border-emerald-400/50`;
    case "Pending":
      return `${base} bg-amber-500/10 text-amber-300 border border-amber-400/50`;
    case "Completed":
      return `${base} bg-sky-500/10 text-sky-300 border border-sky-400/50`;
    case "Cancelled":
      return `${base} bg-rose-500/10 text-rose-300 border border-rose-400/50`;
    default:
      return base;
  }
}

function paymentBadge(status: BookingRow["paymentStatus"]) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium";
  switch (status) {
    case "Paid":
      return `${base} bg-emerald-500/10 text-emerald-300 border border-emerald-400/50`;
    case "Unpaid":
      return `${base} bg-red-500/10 text-red-300 border border-red-400/50`;
    case "Refunded":
      return `${base} bg-slate-500/10 text-slate-200 border border-slate-400/50`;
    default:
      return base;
  }
}

export const BookingsTable: React.FC<Props> = ({ bookings }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur px-3 py-3 sm:px-4 sm:py-4 shadow-[0_18px_40px_rgba(0,0,0,0.65)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.22em] text-white/50">
            Upcoming Bookings
          </span>
          <span className="text-[11px] text-white/55">
            Static data for Admin MVP (Dec 3 sprint)
          </span>
        </div>
        <div className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] text-white/65">
          <Icon icon={airplaneIcon} width={14} height={14} />
          LCA · PFO
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-[11px] sm:text-xs">
          <thead>
            <tr className="text-white/55 border-b border-white/10">
              <th className="py-2 pr-3 text-left font-normal">Ref</th>
              <th className="py-2 pr-3 text-left font-normal">Passenger</th>
              <th className="py-2 pr-3 text-left font-normal">Route</th>
              <th className="py-2 pr-3 text-left font-normal hidden md:table-cell">
                Flight
              </th>
              <th className="py-2 pr-3 text-left font-normal">Date / Time</th>
              <th className="py-2 pr-3 text-left font-normal hidden lg:table-cell">
                Vehicle
              </th>
              <th className="py-2 pr-3 text-left font-normal">Status</th>
              <th className="py-2 text-right font-normal">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bookings.map((b) => (
              <tr key={b.id} className="text-white/80">
                <td className="py-2.5 pr-3 align-middle">
                  <div className="flex flex-col">
                    <span className="font-medium">{b.ref}</span>
                    <span className="text-[10px] text-white/50">
                      {b.createdAt}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 pr-3 align-middle">
                  <div className="flex flex-col">
                    <span>{b.passengerName}</span>
                    <span className="text-[10px] text-white/50">
                      {b.passengers} pax
                    </span>
                  </div>
                </td>
                <td className="py-2.5 pr-3 align-middle">
                  <div className="flex flex-col">
                    <span>{b.route}</span>
                    <span className="text-[10px] text-white/50">
                      {b.airport} · Airport
                    </span>
                  </div>
                </td>
                <td className="py-2.5 pr-3 align-middle hidden md:table-cell">
                  <div className="flex flex-col">
                    <span>{b.flightNumber}</span>
                    <span className="text-[10px] text-white/50">
                      Online check-in
                    </span>
                  </div>
                </td>
                <td className="py-2.5 pr-3 align-middle">
                  <div className="flex flex-col">
                    <span>
                      {b.date} · {b.time}
                    </span>
                    <span className="text-[10px] text-white/50">
                      Local time
                    </span>
                  </div>
                </td>
                <td className="py-2.5 pr-3 align-middle hidden lg:table-cell">
                  <div className="flex flex-col">
                    <span>{b.vehicle}</span>
                    <span className="text-[10px] text-white/50">
                      €{b.amountEUR.toFixed(0)} fixed
                    </span>
                  </div>
                </td>
                <td className="py-2.5 pr-3 align-middle">
                  <span className={statusBadge(b.status)}>{b.status}</span>
                </td>
                <td className="py-2.5 pl-3 align-middle text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className={paymentBadge(b.paymentStatus)}>
                      {b.paymentStatus}
                    </span>
                    <span className="text-[11px] text-white/65">
                      €{b.amountEUR.toFixed(0)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
