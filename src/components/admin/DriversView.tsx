"use client"

import { Icon } from "@iconify/react"
import { Driver } from "@/lib/admin/types"
import { BRAND } from "./brand"

interface Props {
  drivers: Driver[]
  onAddDriver: () => void
  onDeleteDriver: (id: string) => void
}

export const DriversView: React.FC<Props> = ({ drivers, onAddDriver, onDeleteDriver }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Driver Management</h1>
        <button
          onClick={onAddDriver}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: BRAND.navy }}
        >
          <Icon icon="mdi:plus" className="text-lg" />
          Add Driver
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {drivers.map((driver) => (
          <div key={driver.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-full bg-slate-800 p-3">
                <Icon icon="mdi:steering" className="text-2xl" style={{ color: BRAND.gold }} />
              </div>
              <button
                onClick={() => onDeleteDriver(driver.id)}
                className="rounded-lg p-2 text-red-400 hover:bg-red-950/40"
              >
                <Icon icon="mdi:trash-can-outline" className="text-lg" />
              </button>
            </div>
            <h3 className="mb-1 text-lg font-semibold text-white">{driver.name}</h3>
            <p className="text-sm text-slate-300">📱 {driver.phone}</p>
            <p className="text-sm text-slate-300">🚗 {driver.vehicle}</p>
            <span
              className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                driver.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {driver.status}
            </span>
          </div>
        ))}

        {drivers.length === 0 && (
          <p className="text-sm text-slate-400">No drivers yet. Click &quot;Add Driver&quot; to create one.</p>
        )}
      </div>
    </div>
  )
}
