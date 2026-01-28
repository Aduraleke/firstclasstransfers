"use client";

import { Icon } from "@iconify/react";
import { AdminUser } from "@/lib/api/admin/types";
import { BRAND } from "./brand";

interface Props {
  admins: AdminUser[];
  loading: boolean;
  onAddAdmin: () => void;
  onViewAdmin: (id: string) => void;
}

export const AdminUsersView: React.FC<Props> = ({
  admins,
  loading,
  onAddAdmin,
  onViewAdmin,
}) => {
  return (
    <section className="relative flex flex-col gap-10">
      {/* ───────── TITLE STRIP ───────── */}
      <header className="flex items-end justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Control Registry
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Admin Operators
          </h1>
          <p className="max-w-xl text-sm text-slate-400">
            System-level access profiles governing platform behavior,
            permissions, and authority boundaries.
          </p>
        </div>

        <button
          onClick={onAddAdmin}
          className="
            group relative overflow-hidden
            rounded-full px-7 py-3
            text-sm font-semibold text-white
            transition
          "
          style={{ backgroundColor: BRAND.navy }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Icon icon="mdi:account-plus-outline" />
            New Administrator
          </span>
          <span className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
        </button>
      </header>

      {/* ───────── LOADING STATE ───────── */}
      {loading && (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-slate-900"
            />
          ))}
        </div>
      )}

      {/* ───────── EMPTY STATE ───────── */}
      {!loading && admins.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-20 text-center">
          <Icon
            icon="mdi:shield-account-outline"
            className="mx-auto mb-4 text-5xl text-slate-600"
          />
          <p className="text-lg font-medium text-white">
            No admin operators configured
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Create your first operator to begin delegating system control.
          </p>
        </div>
      )}

      {/* ───────── OPERATOR LIST ───────── */}
      {!loading && admins.length > 0 && (
        <div className="flex flex-col gap-3">
          {admins.map((admin) => (
            <OperatorRow
              key={admin.id}
              admin={admin}
              onView={() => onViewAdmin(admin.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

/* ───────────────── OPERATOR ROW ───────────────── */

function OperatorRow({
  admin,
  onView,
}: {
  admin: AdminUser;
  onView: () => void;
}) {
  const isSuper = admin.role === "super_admin";

  return (
    <div
      className="
        group relative
        flex items-center justify-between
        rounded-2xl
        border border-slate-800
        bg-linear-to-r from-slate-950 to-slate-900
        px-6 py-5
        transition
        hover:border-slate-600
      "
    >
      {/* LEFT RAIL */}
      <div
        className={`
          absolute left-0 top-0 h-full w-1 rounded-l-2xl
          ${isSuper ? "bg-emerald-400" : "bg-slate-600"}
        `}
      />

      {/* IDENTITY */}
      <div className="flex items-center gap-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-white">
          <Icon
            icon={isSuper ? "mdi:crown-outline" : "mdi:account-outline"}
            className="text-xl"
          />
        </div>

        <div className="space-y-0.5">
          <p className="text-base font-semibold text-white capitalize">
            {admin.name}
          </p>
          <p className="text-xs text-slate-400">{admin.email}</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            {isSuper ? "Super Administrator" : "Administrator"}
          </p>
        </div>
      </div>

      {/* ACTION */}
      <button
        onClick={onView}
        className="
          rounded-full
          border border-slate-700
          px-5 py-2
          text-xs font-semibold text-slate-300
          transition
          hover:border-slate-500 hover:text-white
        "
      >
        View Admin
      </button>
    </div>
  );
}
