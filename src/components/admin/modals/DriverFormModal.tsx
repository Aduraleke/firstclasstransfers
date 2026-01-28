"use client";

import { useEffect, useState } from "react";
import { DriverFormInput } from "@/lib/api/admin/driverUsers";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Driver } from "@/lib/api/admin/types";

interface DriverFormModalProps {
  open: boolean;
  initialData?: Driver | null;
  onSubmit: (input: DriverFormInput, driverId?: string) => Promise<void>;
  onClose: () => void;
}

export const DriverFormModal: React.FC<DriverFormModalProps> = ({
  open,
  onSubmit,
  onClose,
  initialData,
}) => {
  const [form, setForm] = useState<Omit<DriverFormInput, "profilePicture">>({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(initialData);

  /* ───────── PREFILL / RESET ───────── */
  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        licenseNumber: initialData.licenseNumber,
      });
      setPreview(initialData.profilePicture || null);
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        licenseNumber: "",
      });
      setPreview(null);
    }

    setAvatar(null);
    setError(null);
  }, [open, initialData]);

  if (!open) return null;

  /* ───────── SUBMIT ───────── */
  const submit = async () => {
    if (!form.name || !form.email || !form.phone || !form.licenseNumber) {
      setError("Complete all required fields to continue.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await onSubmit(
        { ...form, profilePicture: avatar },
        initialData?.id, // ✅ KEY FIX
      );

      onClose();
    } catch {
      setError(
        isEdit
          ? "Failed to update driver. Try again."
          : "Failed to create driver. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const setImage = (file: File | null) => {
    setAvatar(file);
    setPreview(file ? URL.createObjectURL(file) : preview);
  };

  /* ───────── UI ───────── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-[#0B0F1A] shadow-2xl">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 hover:bg-white/10"
        >
          <Icon icon="mdi:close" />
        </button>

        <div className="grid md:grid-cols-[300px_1fr]">
          {/* ───────── LEFT ───────── */}
          <div className="flex flex-col items-center justify-center gap-6 bg-linear-to-b from-slate-900 to-black px-6 py-10">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
              {preview ? (
                <Image src={preview} alt="Avatar" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-500">
                  <Icon icon="mdi:account" className="text-5xl" />
                </div>
              )}
            </div>

            <label className="cursor-pointer text-sm font-medium text-emerald-400 hover:underline">
              Upload photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
            </label>

            <div className="text-center">
              <p className="text-lg font-semibold text-white">
                {form.name || "Driver Name"}
              </p>
              <p className="text-xs text-slate-400">
                {form.email || "email@example.com"}
              </p>
            </div>
          </div>

          {/* ───────── RIGHT ───────── */}
          <div className="px-10 py-10">
            <h2 className="text-xl font-semibold text-white">
              {isEdit ? "Edit Driver" : "Create Driver"}
            </h2>
            <p className="mb-8 text-sm text-slate-400">
              This information will be used across the system
            </p>

            <div className="grid gap-6">
              <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Email address" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Field label="Phone number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <Field label="Driver's License number" value={form.licenseNumber} onChange={(v) => setForm({ ...form, licenseNumber: v })} />
            </div>

            {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

            <div className="mt-10 flex items-center justify-between">
              <button onClick={onClose} className="text-sm text-slate-400 hover:text-white">
                Cancel
              </button>

              <button
                onClick={submit}
                disabled={submitting}
                className="rounded-xl bg-emerald-500 px-8 py-3 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
              >
                {submitting ? "Saving…" : isEdit ? "Update Driver" : "Create Driver"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────────────── FIELD ───────────────── */

function Field({
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
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="
          peer
          w-full
          border-b border-slate-700
          bg-transparent
          py-3
          text-white
          outline-none
          transition
          focus:border-emerald-400
        "
      />

      <label
        className="
          pointer-events-none
          absolute
          left-0
          top-1/2
          -translate-y-1/2
          text-sm
          text-slate-400
          transition-all

          peer-focus:-top-2
          peer-focus:text-xs
          peer-focus:text-emerald-400

          peer-not-placeholder-shown:-top-2
          peer-not-placeholder-shown:text-xs
        "
      >
        {label}
      </label>
    </div>
  );
}

