"use client"

import { Icon } from "@iconify/react"
import { BRAND } from "./brand"
import { Booking, DashboardStats } from "@/lib/api/admin/types"

interface Props {
  stats: DashboardStats
  bookings: Booking[]
  onOpenBooking: (booking: Booking) => void
}

export const DashboardView: React.FC<Props> = ({
  stats,
  bookings,
  onOpenBooking,
}) => {
  const cards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: "mdi:calendar-month-outline",
    },
    {
      label: "Pending",
      value: stats.pendingBookings,
      icon: "mdi:alert-circle-outline",
    },
    {
      label: "Completed Today",
      value: stats.completedToday,
      icon: "mdi:check-circle-outline",
    },
    {
      label: "Revenue",
      value: stats.revenue,
      icon: "mdi:cash-multiple",
    },
  ]

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Operational overview & recent activity
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="
              relative rounded-2xl border border-white/5
              bg-slate-900/60 p-6
            "
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                {c.label}
              </p>
              <Icon
                icon={c.icon}
                className="text-xl"
                style={{ color: BRAND.gold }}
              />
            </div>

            <p className="mt-4 text-3xl font-semibold text-white">
              {c.value}
            </p>

            {/* subtle accent line */}
            <div
              className="absolute bottom-0 left-0 h-[2px] w-full rounded-b-2xl"
              style={{ backgroundColor: BRAND.gold, opacity: 0.25 }}
            />
          </div>
        ))}
      </div>

      {/* RECENT BOOKINGS */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-6">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Recent Bookings
          </h2>
          <span className="text-xs text-slate-400">
            Last {Math.min(bookings.length, 5)} entries
          </span>
        </div>

        <div className="space-y-2">
          {bookings.slice(0, 5).map((booking) => (
            <button
              key={booking.id}
              onClick={() => onOpenBooking(booking)}
              className="
                group w-full rounded-xl border border-white/5
                bg-slate-800/60 px-4 py-3
                transition hover:bg-slate-800
                flex items-center justify-between
              "
            >
              <div>
                <p className="font-medium text-white">
                  {booking.customerName}
                </p>
                <p className="text-xs text-slate-400">
                  {booking.destination} • {booking.id}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <StatusPill status={booking.status} />
                <Icon
                  icon="mdi:chevron-right"
                  className="
                    text-xl text-slate-400
                    transition group-hover:text-white
                  "
                />
              </div>
            </button>
          ))}

          {bookings.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-400">
              No bookings yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── SMALL UI PARTS ───────────────────────── */

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-500/15 text-yellow-400",
    Assigned: "bg-blue-500/15 text-blue-400",
    Completed: "bg-emerald-500/15 text-emerald-400",
    Cancelled: "bg-red-500/15 text-red-400",
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] ?? "bg-slate-500/15 text-slate-300"
      }`}
    >
      {status}
    </span>
  )
}
