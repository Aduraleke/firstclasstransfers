// src/components/admin/modals/DriverFormModal.tsx
"use client";
import { useState } from "react";

interface DriverFormModalProps {
  open: boolean;
  onSubmit: (input: { name: string; phone: string; vehicle: string }) => void;
  onClose: () => void;
}

export const DriverFormModal: React.FC<DriverFormModalProps> = ({ open, onSubmit, onClose }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !vehicle) return;
    onSubmit({ name, phone, vehicle });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold text-white">Add Driver</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="mb-1 block text-slate-300">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">Vehicle</label>
            <input
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
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
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Save Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


