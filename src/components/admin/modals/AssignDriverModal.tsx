// src/components/admin/modals/AssignDriverModal.tsx
"use client";

import { Booking, Driver } from "@/lib/api/admin/types";

interface AssignDriverModalProps {
  open: boolean;
  booking: Booking;
  drivers: Driver[];
  onAssign: (bookingId: string, driverName: string) => void;
  onClose: () => void;
}

export const AssignDriverModal: React.FC<AssignDriverModalProps> = ({
  open,
  booking,
  drivers,
  onAssign,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold text-white">Assign Driver</h2>
        <p className="mb-1 text-sm text-slate-300">Booking: {booking.id}</p>
        <p className="mb-4 text-xs text-slate-400">
          {booking.customerName} • {booking.airport} → {booking.destination}
        </p>

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {drivers.map((driver) => (
            <button
              key={driver.id}
              onClick={() => onAssign(booking.id, driver.name)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-left text-sm text-slate-100 hover:border-slate-500 hover:bg-slate-700"
            >
              <p className="font-semibold">{driver.name}</p>
              <p className="text-xs text-slate-400">
                {driver.vehicle} • {driver.phone}
              </p>
            </button>
          ))}
          {drivers.length === 0 && <p className="text-sm text-slate-400">No drivers yet.</p>}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
