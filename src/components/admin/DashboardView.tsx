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
      prefix: "€",
    },
  ]

  return (
    <div className="space-y-12">

      {/* HEADER */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-white">
          Dashboard
        </h1>
        <p className="text-sm text-slate-400">
          Live operational snapshot
        </p>
      </header>

      {/* STATS */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="
              group relative overflow-hidden
              rounded-2xl border border-white/5
              bg-linear-to-br from-slate-900/70 to-slate-900/40
              p-6 transition
              hover:border-white/10
            "
          >
            {/* ICON WATERMARK */}
            <Icon
              icon={c.icon}
              className="absolute -right-6 -top-6 text-[96px]"
              style={{ color: BRAND.gold, opacity: 0.06 }}
            />

            <p className="text-xs uppercase tracking-widest text-slate-400">
              {c.label}
            </p>

            <div className="mt-4 flex items-end gap-1">
              {c.prefix && (
                <span className="text-lg text-slate-400">
                  {c.prefix}
                </span>
              )}
              <span className="text-3xl font-semibold text-white">
                {c.value}
              </span>
            </div>

            {/* GLOW */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5"
              style={{
                background: `linear-gradient(90deg, transparent, ${BRAND.gold}, transparent)`,
                opacity: 0.4,
              }}
            />
          </div>
        ))}
      </section>

      {/* RECENT BOOKINGS */}
      <section className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Recent Activity
          </h2>
          <span className="text-xs text-slate-400">
            Last {Math.min(bookings.length, 5)} bookings
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {bookings.slice(0, 5).map((booking) => (
            <button
              key={booking.id}
              onClick={() => onOpenBooking(booking)}
              className="
                group flex w-full items-center justify-between
                px-2 py-4 transition
                hover:bg-white/5
              "
            >
              <div className="space-y-1 text-left">
                <p className="font-medium text-white capitalize">
                  {booking.customerName}
                </p>
                <p className="text-xs text-slate-400">
                  {booking.destination} · {booking.id}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <StatusPill status={booking.status} />
                <Icon
                  icon="mdi:arrow-right"
                  className="
                    text-xl text-slate-500
                    transition-transform
                    group-hover:translate-x-1
                    group-hover:text-white
                  "
                />
              </div>
            </button>
          ))}

          {bookings.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">
              No bookings yet.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

/* ───────────────────────── STATUS ───────────────────────── */

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
