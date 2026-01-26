"use client"

import { Icon } from "@iconify/react"
import { Driver } from "@/lib/api/admin/types"
import { BRAND } from "./brand"

interface Props {
  drivers: Driver[]
  counts: {
    total: number
    available: number
    unavailable: number
  }
  activeTab: "all" | "available" | "unavailable"
  onTabChange: (tab: "all" | "available" | "unavailable") => void
  search: string
  onSearchChange: (value: string) => void
  onAddDriver: () => void
  onDeleteDriver: (id: string) => void
  loading?: boolean
}

export const DriversView: React.FC<Props> = ({
  drivers,
  counts = { total: 0, available: 0, unavailable: 0 }, // ✅ DEFAULT
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  onAddDriver,
  onDeleteDriver,
  loading = false,
}) => {

  return (
    <div className="space-y-6">
      {/* ───────── HEADER ───────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Driver Management</h1>

        <button
          onClick={onAddDriver}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: BRAND.navy }}
        >
          <Icon icon="mdi:plus" className="text-lg" />
          Add Driver
        </button>
      </div>

      {/* ───────── STATS ───────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Drivers" value={counts.total} />
        <StatCard
          label="Available Drivers"
          value={counts.available}
          valueClass="text-green-400"
        />
        <StatCard
          label="Unavailable Drivers"
          value={counts.unavailable}
          valueClass="text-red-400"
        />
      </div>

      {/* ───────── TABS + SEARCH ───────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
        <div className="flex gap-2">
          {(["all", "available", "unavailable"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Icon
            icon="mdi:magnify"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-lg bg-slate-900 pl-10 pr-4 py-2 text-sm text-white outline-none ring-1 ring-slate-800 focus:ring-slate-700"
          />
        </div>
      </div>

      {/* ───────── LIST ───────── */}
      {loading ? (
        <DriversSkeleton />
      ) : drivers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-full bg-slate-800 p-3">
                  <Icon
                    icon="mdi:steering"
                    className="text-2xl"
                    style={{ color: BRAND.gold }}
                  />
                </div>

                <button
                  onClick={() => onDeleteDriver(driver.id)}
                  className="rounded-lg p-2 text-red-400 hover:bg-red-950/40"
                >
                  <Icon icon="mdi:trash-can-outline" className="text-lg" />
                </button>
              </div>

              <h3 className="mb-1 text-lg font-semibold text-white">
                {driver.name}
              </h3>

              <p className="text-sm text-slate-300">📱 {driver.phone}</p>
              <p className="text-sm text-slate-300">✉️ {driver.email}</p>

              <span
                className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                  driver.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {driver.isActive ? "Available" : "Unavailable"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ───────────────── SUB-COMPONENTS ───────────────── */

function StatCard({
  label,
  value,
  valueClass = "text-white",
}: {
  label: string
  value: number
  valueClass?: string
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center text-slate-400">
      No drivers found.
    </div>
  )
}

function DriversSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-48 animate-pulse rounded-xl bg-slate-900/60"
        />
      ))}
    </div>
  )
}
