// src/components/admin/modals/PriceRuleFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { PriceRule } from "@/lib/api/admin/types";

interface PriceRuleFormModalProps {
  open: boolean;
  initial?: PriceRule;
  onSubmit: (input: Omit<PriceRule, "id">, existingId?: number) => void;
  onClose: () => void;
}

export const PriceRuleFormModal: React.FC<PriceRuleFormModalProps> = ({
  open,
  initial,
  onSubmit,
  onClose,
}) => {
  const [airport, setAirport] = useState("");
  const [zone, setZone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [dayPrice, setDayPrice] = useState("");
  const [nightPrice, setNightPrice] = useState("");

  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(() => {
      if (initial) {
        setAirport(initial.airport);
        setZone(initial.zone);
        setVehicle(initial.vehicle);
        setDayPrice(String(initial.dayPrice));
        setNightPrice(String(initial.nightPrice));
      } else {
        setAirport("");
        setZone("");
        setVehicle("");
        setDayPrice("");
        setNightPrice("");
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!airport || !zone || !vehicle || !dayPrice || !nightPrice) return;

    onSubmit(
      {
        airport,
        zone,
        vehicle,
        dayPrice: Number.parseFloat(dayPrice),
        nightPrice: Number.parseFloat(nightPrice),
      },
      initial?.id,
    );
  };

  const isEdit = !!initial;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold text-white">
          {isEdit ? "Edit Price Rule" : "Add Price Rule"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="mb-1 block text-slate-300">Airport</label>
            <input
              value={airport}
              onChange={(e) => setAirport(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">Destination Zone</label>
            <input
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">Vehicle Type</label>
            <input
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-slate-300">Day Price (€)</label>
              <input
                type="number"
                value={dayPrice}
                onChange={(e) => setDayPrice(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-slate-300">Night Price (€)</label>
              <input
                type="number"
                value={nightPrice}
                onChange={(e) => setNightPrice(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {isEdit ? "Save Changes" : "Create Rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
