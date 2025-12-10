// src/components/admin/modals/RouteFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Route } from "@/lib/admin/types";

interface RouteFormModalProps {
  open: boolean;
  initial?: Route;
  onSubmit: (input: Omit<Route, "id">, existingId?: number) => void;
  onClose: () => void;
}

export const RouteFormModal: React.FC<RouteFormModalProps> = ({
  open,
  initial,
  onSubmit,
  onClose,
}) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!open) return;

    // schedule state updates asynchronously so they don’t run
    // synchronously in the effect body
    const timeout = setTimeout(() => {
      if (initial) {
        setOrigin(initial.origin);
        setDestination(initial.destination);
        setDistance(initial.distance);
        setTime(initial.time);
        setPrice(String(initial.price));
      } else {
        setOrigin("");
        setDestination("");
        setDistance("");
        setTime("");
        setPrice("");
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !distance || !time || !price) return;

    onSubmit(
      {
        origin,
        destination,
        distance,
        time,
        price: Number.parseFloat(price),
      },
      initial?.id,
    );
  };

  const isEdit = !!initial;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold text-white">
          {isEdit ? "Edit Route" : "Add Route"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="mb-1 block text-slate-300">Origin</label>
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">Destination</label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">Distance</label>
            <input
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">Time</label>
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">Price (€)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
            />
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
              {isEdit ? "Save Changes" : "Create Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
