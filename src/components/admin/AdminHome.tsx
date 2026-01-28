"use client";

import { Icon } from "@iconify/react";
import { useAuthStore } from "@/lib/api/admin/auth/authStore";

export const AdminHome = () => {
  const admin = useAuthStore((s) => s.admin);

  return (
    <div className="space-y-10">
      {/* ───────────────── COMMAND STRIP ───────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-linear-to-br from-slate-900 via-slate-950 to-black p-8">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_40%)]" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400">
              Firctclass Transfers Command Center
            </p>
            <h1 className="mt-1 text-3xl font-bold text-white">
              Welcome back, {admin?.email?.split(" ")[0] ?? "Admin"}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              System standing by for instructions
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-5 py-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
            </span>
            <span className="text-sm font-medium text-emerald-400">
              All systems operational
            </span>
          </div>
        </div>
      </section>

      {/* ───────────────── SYSTEM PULSE ───────────────── */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          System Pulse
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PulseCard
            title="Drivers"
            subtitle="Availability status"
            icon="mdi:steering"
            color="emerald"
          />
          <PulseCard
            title="Vehicles"
            subtitle="Fleet readiness"
            icon="mdi:car-multiple"
            color="sky"
          />
          <PulseCard
            title="Routes"
            subtitle="Active transfers"
            icon="mdi:map-marker-path"
            color="violet"
          />
          <PulseCard
            title="Bookings"
            subtitle="Live demand"
            icon="mdi:calendar-clock"
            color="amber"
          />
        </div>
      </section>

      {/* ───────────────── ACTION RADAR ───────────────── */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Action Radar
        </h2>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <RadarItem
              title="Pending Assignments"
              description="Bookings waiting for driver assignment"
              level="high"
            />
            <RadarItem
              title="Inactive Vehicles"
              description="Vehicles not currently deployable"
              level="medium"
            />
            <RadarItem
              title="Unreviewed Routes"
              description="Routes created without pricing review"
              level="low"
            />
          </div>
        </div>
      </section>

      {/* ───────────────── QUICK COMMANDS ───────────────── */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Quick Commands
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CommandButton icon="mdi:account-plus" label="Add Driver" />
          <CommandButton icon="mdi:car-plus" label="Add Vehicle" />
          <CommandButton icon="mdi:map-plus" label="Create Route" />
          {admin?.isSuperuser && (
            <CommandButton
              icon="mdi:shield-search"
              label="Audit Logs"
              danger
            />
          )}
        </div>
      </section>
    </div>
  );
};

/* ───────────────── SUB COMPONENTS ───────────────── */

function PulseCard({
  title,
  subtitle,
  icon,
  color,
}: {
  title: string;
  subtitle: string;
  icon: string;
  color: "emerald" | "sky" | "violet" | "amber";
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-600">
      <div
        className={`absolute inset-0 opacity-0 transition group-hover:opacity-20 bg-linear-to-br from-${color}-500/30 to-transparent`}
      />

      <div className="relative z-10 flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${color}-500/15 text-${color}-400`}
        >
          <Icon icon={icon} className="text-xl" />
        </div>

        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function RadarItem({
  title,
  description,
  level,
}: {
  title: string;
  description: string;
  level: "high" | "medium" | "low";
}) {
  const color =
    level === "high"
      ? "text-rose-400"
      : level === "medium"
        ? "text-amber-400"
        : "text-emerald-400";

  return (
    <div className="flex items-start gap-4 rounded-2xl bg-slate-950 p-4 ring-1 ring-slate-800">
      <div className={`mt-1 h-2.5 w-2.5 rounded-full ${color}`} />
      <div>
        <p className="font-medium text-white">{title}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function CommandButton({
  icon,
  label,
  danger,
}: {
  icon: string;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      className={`
        group flex flex-col items-center justify-center gap-2
        rounded-2xl px-6 py-6
        ring-1 transition
        ${
          danger
            ? "ring-rose-700 bg-rose-950/40 text-rose-300 hover:ring-rose-500"
            : "ring-slate-800 bg-slate-900/60 text-slate-300 hover:ring-slate-600"
        }
      `}
    >
      <Icon icon={icon} className="text-2xl" />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}
