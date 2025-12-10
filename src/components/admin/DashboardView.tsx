"use client"

import { Icon } from "@iconify/react"
import { BRAND } from "./brand"
import { Booking, DashboardStats } from "@/lib/admin/types"

interface Props {
  stats: DashboardStats
  bookings: Booking[]
  onOpenBooking: (booking: Booking) => void
}

export const DashboardView: React.FC<Props> = ({ stats, bookings, onOpenBooking }) => {
  const cards = [
    { label: "Total Bookings", value: stats.totalBookings, icon: "mdi:calendar-month-outline" },
    { label: "Pending", value: stats.pendingBookings, icon: "mdi:alert-circle-outline" },
    { label: "Completed Today", value: stats.completedToday, icon: "mdi:check-circle-outline" },
    { label: "Revenue", value: stats.revenue, icon: "mdi:cash-multiple" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: BRAND.white }}>
        Dashboard Overview
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg p-3" style={{ backgroundColor: BRAND.navy }}>
                <Icon icon={c.icon} className="text-xl" style={{ color: BRAND.gold }} />
              </div>
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Recent Bookings</h2>
        <div className="space-y-3">
          {bookings.slice(0, 5).map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between rounded-lg bg-slate-800 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-white">{booking.customerName}</p>
                <p className="text-xs text-slate-400">
                  {booking.id} • {booking.destination}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    booking.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : booking.status === "Assigned"
                      ? "bg-blue-100 text-blue-800"
                      : booking.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
                <button
                  onClick={() => onOpenBooking(booking)}
                  className="rounded-lg p-2 text-slate-300 hover:bg-slate-700"
                >
                  <Icon icon="mdi:eye-outline" className="text-lg" />
                </button>
              </div>
            </div>
          ))}
          {bookings.length === 0 && (
            <p className="text-sm text-slate-400">No bookings yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
