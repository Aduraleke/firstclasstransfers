"use client"

import { Icon } from "@iconify/react"
import { BRAND } from "./brand"
import { Booking, PaymentSession } from "@/lib/admin/types"

interface Props {
  bookings: Booking[]
  selectedBookingId: string
  setSelectedBookingId: (id: string) => void
  paymentSessions: PaymentSession[]
  onCreateSession: (bookingId: string) => void
  onUpdateStatus: (sessionId: string, status: PaymentSession["status"]) => void
}

export const PaymentsView: React.FC<Props> = ({
  bookings,
  selectedBookingId,
  setSelectedBookingId,
  paymentSessions,
  onCreateSession,
  onUpdateStatus,
}) => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Icon icon="mdi:credit-card-outline" />
          Payment Processing
        </h2>
        <p className="mb-4 text-sm text-slate-300">
          Select a booking to create a payment session (simulated Stripe).
        </p>
        <select
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          value={selectedBookingId}
          onChange={(e) => setSelectedBookingId(e.target.value)}
        >
          <option value="">Select a booking...</option>
          {bookings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.id} - {b.customerName} ({b.price})
            </option>
          ))}
        </select>
        <button
          disabled={!selectedBookingId}
          onClick={() => selectedBookingId && onCreateSession(selectedBookingId)}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: BRAND.navy }}
        >
          Create Payment Session
        </button>

        <div className="mt-6 border-t border-slate-800 pt-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Recent Payment Sessions</h3>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {paymentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg bg-slate-800 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-white">{session.bookingId}</p>
                  <p className="text-xs text-slate-300">
                    €{(session.amount / 100).toFixed(2)} • {session.createdAt}
                  </p>
                  <p className="text-xs text-slate-500">Stripe Ref: {session.stripeReference}</p>
                </div>
                <div className="flex items-center gap-2">
                  {session.status === "completed" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      <Icon icon="mdi:check-circle-outline" />
                      Completed
                    </span>
                  )}
                  {session.status === "pending" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      <Icon icon="mdi:clock-outline" />
                      Pending
                    </span>
                  )}
                  {session.status === "failed" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                      <Icon icon="mdi:alert-circle-outline" />
                      Failed
                    </span>
                  )}

                  {session.status === "pending" && (
                    <button
                      onClick={() => onUpdateStatus(session.id, "completed")}
                      className="rounded-lg bg-green-600 px-2 py-1 text-xs font-semibold text-white hover:bg-green-700"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
            {paymentSessions.length === 0 && (
              <p className="text-sm text-slate-400">No payment sessions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
