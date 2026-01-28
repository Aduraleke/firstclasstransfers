"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Driver } from "@/lib/api/admin/types";
import { BRAND } from "./brand";

/* ───────────────── TYPES ───────────────── */

interface Props {
  drivers: Driver[];
  counts: {
    total: number;
    available: number;
    unavailable: number;
  };
  activeTab: "all" | "available" | "unavailable";
  onTabChange: (tab: "all" | "available" | "unavailable") => void;
  search: string;
  onSearchChange: (v: string) => void;
  onAddDriver: () => void;
  onEditDriver: (driver: Driver) => void;
  onDeleteDriver: (id: string) => Promise<void>;
  loading?: boolean;

  // ✅ ADD THIS
  pagination?: {
    next: string | null;
    previous: string | null;
  };
}

/* ───────────────── MAIN ───────────────── */

export const DriversView: React.FC<Props> = ({
  drivers,
  counts,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  onAddDriver,
  onEditDriver,
  onDeleteDriver,
  loading = false,
  pagination,
}) => {
  const [focused, setFocused] = useState<Driver | null>(null);

  const subtitle = useMemo(() => {
    if (activeTab === "available") return "Signals currently online";
    if (activeTab === "unavailable") return "Offline driver signals";
    return "All operational driver signals";
  }, [activeTab]);

  return (
    <section className="relative min-h-full px-2">
      {/* HEADER */}
      <div className="mb-14 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Drivers
          </h1>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        </div>

        <button
          onClick={onAddDriver}
          className="rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
          style={{ backgroundColor: BRAND.navy }}
        >
          + Add Driver
        </button>
      </div>

      {/* FILTER FIELD */}
      <div className="mb-12 grid grid-cols-3 gap-6">
        <SignalNode
          label="All"
          value={counts.total}
          active={activeTab === "all"}
          onClick={() => onTabChange("all")}
        />
        <SignalNode
          label="Online"
          value={counts.available}
          active={activeTab === "available"}
          accent="emerald"
          onClick={() => onTabChange("available")}
        />
        <SignalNode
          label="Offline"
          value={counts.unavailable}
          active={activeTab === "unavailable"}
          accent="rose"
          onClick={() => onTabChange("unavailable")}
        />
      </div>

      {/* SEARCH */}
      {/* <div className="mb-16 max-w-xl">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search signals…"
          className="
            w-full rounded-full
            bg-slate-900/80
            px-6 py-4
            text-sm text-white
            ring-1 ring-slate-800
            focus:ring-slate-600
            outline-none
          "
        />
      </div> */}

      {/* SIGNAL FIELD */}
      {loading ? (
        <SignalSkeleton />
      ) : drivers.length === 0 ? (
        <EmptyState onAddDriver={onAddDriver} />
      ) : (
        <div className="space-y-8">
          {drivers.map((driver) => (
            <SignalLane
              key={driver.id}
              driver={driver}
              focused={focused?.id === driver.id}
              onFocus={() =>
                setFocused(focused?.id === driver.id ? null : driver)
              }
              onEdit={onEditDriver}
              onDelete={onDeleteDriver}
            />
          ))}
        </div>
      )}

      {pagination?.next && (
        <button className="text-xs text-slate-400">Next</button>
      )}
    </section>
  );
};

function SignalLane({
  driver,
  focused,
  onFocus,
  onEdit,
  onDelete,
}: {
  driver: Driver;
  focused: boolean;
  onFocus: () => void;
  onEdit: (d: Driver) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`
        relative overflow-hidden
        rounded-[28px]
        px-8 py-7
        transition-all duration-300
        ${
          focused
            ? "bg-slate-900 ring-2 ring-slate-600"
            : "bg-slate-900/50 ring-1 ring-slate-800"
        }
      `}
    >
      {/* ENERGY LINE */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          driver.isActive ? "bg-emerald-400" : "bg-rose-400"
        }`}
      />

      <div className="flex items-center justify-between">
        {/* IDENTITY */}
        <div className="flex items-center gap-6">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-slate-800">
            {driver.profilePicture ? (
              <Image
                src={driver.profilePicture}
                alt={driver.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Icon icon="mdi:account" className="text-xl text-slate-500" />
              </div>
            )}
          </div>

          <div>
            <p className="text-lg font-medium text-white">{driver.name}</p>
            <p className="text-xs text-slate-400">
              {driver.isActive ? "Online" : "Offline"} · Joined{" "}
              {new Date(driver.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* FOCUS */}
        <button
          onClick={onFocus}
          className="rounded-full px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
        >
          {focused ? "Close" : "Focus"}
        </button>
      </div>

      {/* EXPANDED CONTROL */}
      {focused && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 text-sm">
          <Meta label="Phone" value={driver.phone || "—"} />
          <Meta label="License" value={driver.licenseNumber || "—"} />
          <Meta label="Email" value={driver.email} />

          <div className="col-span-full flex justify-end gap-3 pt-4">
            <button
              onClick={() => onEdit(driver)}
              className="rounded-full bg-slate-800 px-5 py-2 text-sm text-white"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(driver.id)}
              className="rounded-full bg-rose-600 px-5 py-2 text-sm text-white"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SignalNode({
  label,
  value,
  active,
  onClick,
  accent = "slate",
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
  accent?: "slate" | "emerald" | "rose";
}) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-3xl px-6 py-5 text-left transition
        ${active ? "bg-slate-900 ring-2 ring-slate-600" : "bg-slate-900/40 ring-1 ring-slate-800"}
      `}
    >
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-semibold text-${accent}-400`}>
        {value}
      </p>
    </button>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-200">{value}</p>
    </div>
  );
}

function EmptyState({ onAddDriver }: { onAddDriver: () => void }) {
  return (
    <div className="rounded-4xl bg-slate-900/40 p-20 text-center">
      <p className="text-xl font-semibold text-white">No active signals</p>
      <p className="mt-2 text-sm text-slate-400">
        Add drivers to initialize the system.
      </p>
      <button
        onClick={onAddDriver}
        className="mt-8 rounded-full px-8 py-3 text-sm font-semibold text-white"
        style={{ backgroundColor: BRAND.navy }}
      >
        Add Driver
      </button>
    </div>
  );
}

function SignalSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-[28px] bg-slate-900/50"
        />
      ))}
    </div>
  );
}
