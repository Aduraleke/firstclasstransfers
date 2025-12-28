// src/components/admin/modals/BookingDetailsModal.tsx
"use client";

import { Booking } from "@/lib/admin/types";

interface BookingDetailsModalProps {
  open: boolean;
  booking: Booking;
  onClose: () => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ open, booking, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold text-white">Booking Details</h2>
        <div className="space-y-2 text-sm text-slate-200">
          <div>
            <p className="text-slate-400">Booking ID</p>
            <p className="font-semibold">{booking.id}</p>
          </div>
          <div>
            <p className="text-slate-400">Customer</p>
            <p className="font-semibold">{booking.customerName}</p>
            <p className="text-xs text-slate-400">{booking.email}</p>
            <p className="text-xs text-slate-400">{booking.phone}</p>
          </div>
          <div>
            <p className="text-slate-400">Route</p>
            <p className="font-semibold">
              {booking.airport} → {booking.destination}
            </p>
            <p className="text-xs text-slate-400">{booking.vehicleType}</p>
          </div>
          <div>
            <p className="text-slate-400">Date & Time</p>
            <p className="font-semibold">
              {booking.date} • {booking.time}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Passengers</p>
            <p className="font-semibold">{booking.passengers}</p>
          </div>
          <div>
            <p className="text-slate-400">Price</p>
            <p className="font-semibold">{booking.price}</p>
          </div>
          <div>
            <p className="text-slate-400">Payment Method</p>
            <p className="font-semibold capitalize">{booking.paymentMethod || "Not specified"}</p>
          </div>
          <div>
            <p className="text-slate-400">Payment Status</p>
            <p className="font-semibold">{booking.paymentStatus}</p>
          </div>
          {booking.revolutOrderId && (
            <div>
              <p className="text-slate-400">Revolut Order ID</p>
              <p className="font-mono text-xs">{booking.revolutOrderId}</p>
            </div>
          )}
          {booking.stripeRef && !booking.revolutOrderId && (
            <div>
              <p className="text-slate-400">Stripe Reference</p>
              <p className="font-mono text-xs">{booking.stripeRef}</p>
            </div>
          )}
          <div>
            <p className="text-slate-400">Notes</p>
            <p className="font-semibold">{booking.notes || "None"}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};
