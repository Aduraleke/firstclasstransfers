"use client";

import { useEffect, useState } from "react";
import { AdminUser } from "@/lib/api/admin/types";
import { Icon } from "@iconify/react";
import Image from "next/image";

/* ───────────────── Types ───────────────── */

interface Props {
  open: boolean;
  mode?: "create" | "edit";
  initialData?: AdminUser | null;
  error?: string | null;
  submitting?: boolean;
  onSubmit: (input: {
    name: string;
    email: string;
    phone: string;
    permissions: AdminUser["permissions"];
    dp?: File | null;
  }) => void;
  onClose: () => void;
}

/* ───────────────── Constants ───────────────── */

const PERMISSION_LABELS: Record<keyof AdminUser["permissions"], string> = {
  bookings: "Bookings",
  drivers: "Drivers",
  routes: "Routes",
  adminUsers: "Admin Users",
  vehicles: "Vehicles",
};

/* ───────────────── Component ───────────────── */

export const AdminUserFormModal: React.FC<Props> = ({
  open,
  mode = "create",
  initialData,
  error,
  submitting = false,
  onSubmit,
  onClose,
}) => {
  /* ───────── Local State ───────── */

  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [dp, setDp] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialData?.dp ?? null,
  );

  const [permissions, setPermissions] = useState<AdminUser["permissions"]>(
    initialData?.permissions ?? {
      bookings: false,
      drivers: false,
      routes: false,
      adminUsers: false,
      vehicles: false,
    },
  );

  /* ───────── Derived State ───────── */

  const isSubmitting = submitting;
  const isFormInvalid = !name || !email;
  const emailHasError = error?.toLowerCase().includes("email");

  /* ───────── Effects ───────── */

  // Escape key closes modal
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (!open) return null;

  /* ───────── Handlers ───────── */

  const handleTogglePerm = (key: keyof AdminUser["permissions"]) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageChange = (file: File | null) => {
    if (!file) return;

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setDp(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isFormInvalid) return;

    onSubmit({
      name,
      email,
      phone,
      permissions,
      dp,
    });
  };

  /* ───────── UI ───────── */

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 py-4">
          <h2 className="text-lg font-semibold text-white">
            {mode === "edit" ? "Edit Admin User" : "Add Admin User"}
          </h2>
          <button onClick={onClose}>
            <Icon
              icon="mdi:close"
              className="text-xl text-slate-400 hover:text-white"
            />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-800">
              {preview ? (
                <Image
                  src={preview}
                  alt="Avatar preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <Icon icon="mdi:account" className="text-3xl text-slate-400" />
              )}
            </div>

            <label className="cursor-pointer text-xs text-blue-400 hover:underline">
              Upload photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="mb-1 block text-slate-300">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white outline-none focus:border-slate-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              disabled={mode === "edit"}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-white outline-none
                border bg-slate-900
                ${emailHasError ? "border-red-500" : "border-slate-600"}
                ${mode === "edit" ? "cursor-not-allowed opacity-70" : ""}
                focus:border-slate-400`}
            />
            {mode === "edit" && (
              <p className="mt-1 text-xs text-slate-400">
                Email cannot be changed after creation
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-slate-300">
              Phone (optional)
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white outline-none focus:border-slate-400"
            />
          </div>

          {/* Permissions */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
              Permissions
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(
                Object.keys(permissions) as (keyof AdminUser["permissions"])[]
              ).map((key) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 text-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={permissions[key]}
                    onChange={() => handleTogglePerm(key)}
                  />
                  <span>{PERMISSION_LABELS[key]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-slate-700 px-4 py-2 text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isFormInvalid}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
            >
              {isSubmitting && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}

              {isSubmitting
                ? mode === "edit"
                  ? "Updating…"
                  : "Creating…"
                : mode === "edit"
                  ? "Update Admin"
                  : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
