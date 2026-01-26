// src/components/admin/modals/DriverFormModal.tsx
"use client";

import { useState } from "react";
import { DriverFormInput } from "@/lib/api/admin/driverUsers";

interface DriverFormModalProps {
  open: boolean;
  onSubmit: (input: DriverFormInput) => Promise<void> | void;
  onClose: () => void;
}

export const DriverFormModal: React.FC<DriverFormModalProps> = ({
  open,
  onSubmit,
  onClose,
}) => {
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<DriverFormInput, "profilePicture">>({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.licenseNumber) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setError(null);
      setSubmitting(true);

      await onSubmit({
        ...form,
        profilePicture,
      });

      // ✅ close only on success
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save driver. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Add Driver
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <Input
            label="Phone Number"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />

          <Input
            label="License Number"
            value={form.licenseNumber}
            onChange={(v) =>
              setForm({ ...form, licenseNumber: v })
            }
          />

          <div>
            <label className="mb-1 block text-slate-300">
              Profile Picture (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setProfilePicture(e.target.files?.[0] ?? null)
              }
              className="text-slate-300"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-700 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-slate-700 px-4 py-2 font-semibold text-slate-100 hover:bg-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save Driver"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ───────── SMALL INPUT COMPONENT ───────── */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-slate-300">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white outline-none focus:border-slate-400"
      />
    </div>
  );
}
