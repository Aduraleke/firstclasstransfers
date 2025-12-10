"use client"

import { Icon } from "@iconify/react"
import { BRAND } from "./brand"
import { Booking, EmailNotification } from "@/lib/admin/types"

interface ComposeEmailState {
  to: string
  subject: string
  message: string
  recipientName: string
}

interface Props {
  bookings: Booking[]
  emails: EmailNotification[]
  composeEmail: ComposeEmailState
  setComposeEmail: (state: ComposeEmailState) => void
  onSendCustom: () => void
  onSendBookingEmail: (bookingId: string, type: EmailNotification["type"]) => void
}

export const EmailsView: React.FC<Props> = ({
  bookings,
  emails,
  composeEmail,
  setComposeEmail,
  onSendCustom,
  onSendBookingEmail,
}) => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Icon icon="mdi:email-outline" />
          Email Management
        </h2>

        {/* Compose */}
        <div className="mb-6 rounded-lg bg-slate-800 p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Compose Custom Email</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Recipient Name (optional)"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500"
              value={composeEmail.recipientName}
              onChange={(e) => setComposeEmail({ ...composeEmail, recipientName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Recipient Email"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500"
              value={composeEmail.to}
              onChange={(e) => setComposeEmail({ ...composeEmail, to: e.target.value })}
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500"
              value={composeEmail.subject}
              onChange={(e) => setComposeEmail({ ...composeEmail, subject: e.target.value })}
            />
            <textarea
              placeholder="Message"
              className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500"
              value={composeEmail.message}
              onChange={(e) => setComposeEmail({ ...composeEmail, message: e.target.value })}
            />
            <button
              onClick={onSendCustom}
              className="w-full rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: BRAND.navy }}
            >
              Send Email
            </button>
          </div>
        </div>

        {/* Booking emails */}
        <div className="mb-6 rounded-lg bg-slate-800 p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Quick Emails to Booking Customers</h3>
          <div className="space-y-2">
            {bookings.slice(0, 3).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{booking.customerName}</p>
                  <p className="text-xs text-slate-400">{booking.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSendBookingEmail(booking.id, "booking_confirmation")}
                    className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-700"
                  >
                    Confirmation
                  </button>
                  {booking.driver && (
                    <button
                      onClick={() => onSendBookingEmail(booking.id, "driver_assigned")}
                      className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-700"
                    >
                      Driver Assigned
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent emails */}
        <div className="border-t border-slate-800 pt-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Recent Emails</h3>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {emails.map((email) => (
              <div
                key={email.id}
                className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2"
              >
                <div>
                  <p className="text-xs font-semibold text-white">
                    {email.type.replace(/_/g, " ").toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-300">{email.to}</p>
                  <p className="text-[10px] text-slate-500">{email.timestamp}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${
                    email.status === "sent"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  <Icon
                    icon={email.status === "sent" ? "mdi:check-circle-outline" : "mdi:clock-outline"}
                    className="text-xs"
                  />
                  {email.status === "sent" ? "Sent" : "Pending"}
                </span>
              </div>
            ))}
            {emails.length === 0 && (
              <p className="text-sm text-slate-400">No emails yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
