"use client";

import { useState } from "react";
import { Booking } from "@/lib/api/admin/types";
import {
  getAvailableDrivers,
  getAvailableVehicles,
  assignBooking,
  AvailableDriver,
  AvailableVehicle,
} from "@/lib/api/admin/bookingDetails";

interface Props {
  open: boolean;
  booking: Booking;
  onSuccess: () => void;
  onClose: () => void;
}

export const AssignDriverModal: React.FC<Props> = ({
  open,
  booking,
  onSuccess,
  onClose,
}) => {
  const [drivers, setDrivers] = useState<AvailableDriver[]>([]);
  const [vehicles, setVehicles] = useState<AvailableVehicle[]>([]);

  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  const [driversLoading, setDriversLoading] = useState(false);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleDriverFocus() {
    if (drivers.length > 0) return;
    setDriversLoading(true);
    try {
      setDrivers(await getAvailableDrivers(booking.id));
    } finally {
      setDriversLoading(false);
    }
  }

  async function handleVehicleFocus() {
    if (vehicles.length > 0 || !booking.vehicleType) return;
    setVehiclesLoading(true);
    try {
      setVehicles(await getAvailableVehicles(booking.id, booking.vehicleType));
    } finally {
      setVehiclesLoading(false);
    }
  }

  async function handleAssign() {
    if (!driverId || !vehicleId) return;
    setSubmitting(true);
    try {
      await assignBooking(booking.id, {
        driver_id: driverId,
        vehicle_id: vehicleId,
      });
      onSuccess();
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur px-4">
      <div className="w-full max-w-md max-h-[85vh] bg-[#050814] rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.7)] border border-white/10 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-white/10">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Assignment
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            Assign Driver & Vehicle
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {booking.customerName} • {booking.airport} → {booking.destination}
          </p>
        </div>

        {/* BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* DRIVER */}
          <div>
            <label className="block mb-2 text-xs uppercase tracking-widest text-slate-500">
              Driver
            </label>
            <select
              onFocus={handleDriverFocus}
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="
                w-full rounded-xl bg-black/40 border border-white/10
                px-4 py-2.5 text-sm text-white
                focus:border-[#b07208] focus:outline-none
              "
            >
              <option value="">
                {driversLoading
                  ? "Loading available drivers…"
                  : "Select a driver"}
              </option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* VEHICLE */}
          <div>
            <label className="block mb-2 text-xs uppercase tracking-widest text-slate-500">
              Vehicle
              {booking.vehicleType && (
                <span className="ml-2 text-[10px] text-[#b07208]">
                  ({booking.vehicleType})
                </span>
              )}
            </label>

            <select
              onFocus={handleVehicleFocus}
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              disabled={!booking.vehicleType}
              className="
                w-full rounded-xl bg-black/40 border border-white/10
                px-4 py-2.5 text-sm text-white
                focus:border-[#b07208] focus:outline-none
                disabled:opacity-40
              "
            >
              <option value="">
                {vehiclesLoading
                  ? "Loading available vehicles…"
                  : !booking.vehicleType
                    ? "Vehicle type not specified"
                    : "Select a vehicle"}
              </option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={submitting || !driverId || !vehicleId}
            className="
              rounded-xl bg-[#b07208] px-6 py-2.5
              text-sm font-semibold text-black
              hover:brightness-110
              disabled:opacity-50
              transition
            "
          >
            {submitting ? "Assigning…" : "Confirm Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
};
