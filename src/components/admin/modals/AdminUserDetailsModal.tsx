"use client";

import { useState } from "react";
import { AdminUser } from "@/lib/api/admin/types";
import { Icon } from "@iconify/react";
import Image from "next/image";

interface Props {
  open: boolean;
  admin: AdminUser | null;
  loading: boolean;
  onClose: () => void;
  onEdit: (admin: AdminUser) => void;
  onDelete: (id: string) => Promise<void> | void;
}

export const AdminUserDetailsModal: React.FC<Props> = ({
  open,
  admin,
  loading,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (!open) return null;

  const handleDelete = async () => {
    if (!admin) return;
    try {
      setDeleting(true);
      await onDelete(admin.id);
      setDeleted(true);

      setTimeout(() => {
        setDeleted(false);
        setConfirmingDelete(false);
        onClose();
      }, 1200);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* ───────── Header ───────── */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Admin Profile</h2>
          <button onClick={onClose}>
            <Icon
              icon="mdi:close"
              className="text-xl text-slate-400 hover:text-white"
            />
          </button>
        </div>

        {/* ───────── Body ───────── */}
        <div className="px-6 py-6">
          {loading || !admin ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-20 rounded-xl bg-slate-800" />
              <div className="h-12 rounded-lg bg-slate-800" />
              <div className="h-12 rounded-lg bg-slate-800" />
            </div>
          ) : (
            <>
              {/* ───────── Identity ───────── */}
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-800 flex items-center justify-center">
                  {admin.dp ? (
                    <Image
                      src={admin.dp}
                      alt={admin.name || "Admin avatar"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-xl font-semibold text-white">
                      {(
                        admin.name?.charAt(0) ||
                        admin.email?.charAt(0) ||
                        "A"
                      ).toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-xl font-semibold text-white">
                    {admin.name || "Unnamed Admin"}
                  </p>
                  <p className="text-sm text-slate-400">{admin.email}</p>
                </div>

                <span
                  className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${
                    admin.status === "active"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {admin.status === "active" ? "Active" : "Disabled"}
                </span>
              </div>

              {/* ───────── Info Grid ───────── */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <InfoCard
                  icon="mdi:email-outline"
                  label="Email"
                  value={admin.email}
                />
                <InfoCard
                  icon="mdi:phone-outline"
                  label="Phone"
                  value={admin.phone || "Not provided"}
                />
                <InfoCard
                  icon="mdi:shield-account-outline"
                  label="Role"
                  value={admin.role === "super_admin" ? "Super Admin" : "Admin"}
                />
                <InfoCard
                  icon="mdi:clock-outline"
                  label="Last Login"
                  value={admin.lastLogin || "Never"}
                />
              </div>

              {/* ───────── Permissions ───────── */}
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
                  Permissions
                </p>

                <div className="flex flex-wrap gap-2">
                  {Object.entries(admin.permissions)
                    .filter(([, enabled]) => enabled)
                    .map(([key]) => (
                      <span
                        key={key}
                        className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400"
                      >
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (c) => c.toUpperCase())}
                      </span>
                    ))}

                  {Object.values(admin.permissions).every((v) => !v) && (
                    <span className="text-xs text-slate-500">
                      No permissions assigned
                    </span>
                  )}
                </div>
              </div>

              {/* ───────── Login History ───────── */}
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
                  Login History
                </p>

                {admin.loginHistory.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No login records yet.
                  </p>
                ) : (
                  <ul className="space-y-2 text-xs text-slate-300">
                    {admin.loginHistory.map((log, i) => (
                      <li key={i}>
                        {log.date} • {log.ip} • {log.device}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ───────── Actions ───────── */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => onEdit(admin)}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Edit Admin
                </button>

                <button
                  onClick={() => setConfirmingDelete(true)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Delete Admin
                </button>
              </div>
            </>
          )}
        </div>

        {/* ───────── Delete Confirmation ───────── */}
        {confirmingDelete && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/80">
            <div className="w-full max-w-sm rounded-xl bg-slate-900 p-6 text-center shadow-xl">
              {deleted ? (
                <div className="space-y-3">
                  <Icon
                    icon="mdi:check-circle"
                    className="mx-auto text-4xl text-green-500"
                  />
                  <p className="text-sm font-semibold text-white">
                    Admin deleted successfully
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-sm font-semibold text-white">
                    Delete this admin?
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    This action cannot be undone.
                  </p>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setConfirmingDelete(false)}
                      className="flex-1 rounded-lg bg-slate-700 px-4 py-2 text-xs text-white hover:bg-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={deleting}
                      onClick={handleDelete}
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      {deleting ? "Deleting…" : "Yes, Delete"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ───────── Helper ───────── */
function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <Icon icon={icon} className="text-xl text-slate-400" />
      <div>
        <p className="text-[11px] uppercase text-slate-400">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}
