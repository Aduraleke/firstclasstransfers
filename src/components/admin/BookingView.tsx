"use client"

import { Icon } from "@iconify/react"
import { BRAND } from "./brand"
import { Booking } from "@/lib/admin/types"

interface Props {
  bookings: Booking[]
  search: string
  setSearch: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  onExport: () => void
  onViewBooking: (booking: Booking) => void
  onAssignDriver: (booking: Booking) => void
}

export const BookingsView: React.FC<Props> = ({
  bookings,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onExport,
  onViewBooking,
  onAssignDriver,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-white">Bookings Management</h1>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: BRAND.navy }}
        >
          <Icon icon="mdi:download" className="text-lg" />
          Export CSV
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Icon icon="mdi:magnify" className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-slate-800/60 hover:bg-slate-800/60">
                  <td className="px-4 py-3 font-medium text-slate-100">{booking.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-100">{booking.customerName}</p>
                    <p className="text-xs text-slate-400">{booking.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-100">
                      {booking.airport} → {booking.destination}
                    </p>
                    <p className="text-xs text-slate-400">{booking.vehicleType}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-100">{booking.date}</p>
                    <p className="text-xs text-slate-400">{booking.time}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-100">{booking.price}</p>
                    <p className="text-xs text-slate-400 capitalize">{booking.paymentMethod || "cash"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
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
                      <br />
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          booking.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800"
                            : booking.paymentStatus === "Refunded"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-100">{booking.driver || "Unassigned"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewBooking(booking)}
                        className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-700"
                      >
                        <Icon icon="mdi:eye-outline" className="text-lg" />
                      </button>
                      <button
                        onClick={() => onAssignDriver(booking)}
                        className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-700"
                      >
                        <Icon icon="mdi:car-outline" className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-400">
                    No bookings found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
