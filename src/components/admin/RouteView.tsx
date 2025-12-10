"use client"

import { Icon } from "@iconify/react"
import { BRAND } from "./brand"
import { Route } from "@/lib/admin/types"

interface Props {
  routes: Route[]
  expandedGroups: string[]
  toggleGroup: (group: string) => void
  onAddRoute: () => void
  onEditRoute: (route: Route) => void
  onDeleteRoute: (id: number) => void
}

export const RoutesView: React.FC<Props> = ({
  routes,
  expandedGroups,
  toggleGroup,
  onAddRoute,
  onEditRoute,
  onDeleteRoute,
}) => {
  const origins = Array.from(new Set(routes.map((r) => r.origin)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Route Management</h1>
        <button
          onClick={onAddRoute}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: BRAND.navy }}
        >
          <Icon icon="mdi:plus" className="text-lg" />
          Add Route
        </button>
      </div>

      <div className="space-y-4">
        {origins.map((origin) => (
          <div key={origin} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70">
            <button
              onClick={() => toggleGroup(origin)}
              className="flex w-full items-center justify-between px-6 py-4 hover:bg-slate-800"
            >
              <h3 className="text-lg font-semibold text-white">{origin}</h3>
              <Icon
                icon={expandedGroups.includes(origin) ? "mdi:chevron-up" : "mdi:chevron-down"}
                className="text-xl text-slate-400"
              />
            </button>
            {expandedGroups.includes(origin) && (
              <div className="space-y-2 border-t border-slate-800 px-6 pb-4 pt-3">
                {routes
                  .filter((r) => r.origin === origin)
                  .map((route) => (
                    <div
                      key={route.id}
                      className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-3"
                    >
                      <div>
                        <p className="font-semibold text-white">{route.destination}</p>
                        <p className="text-xs text-slate-400">
                          {route.distance} • {route.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-slate-100">€{route.price}</span>
                        <button
                          onClick={() => onEditRoute(route)}
                          className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-700"
                        >
                          <Icon icon="mdi:pencil-outline" className="text-lg" />
                        </button>
                        <button
                          onClick={() => onDeleteRoute(route.id)}
                          className="rounded-lg p-1.5 text-red-400 hover:bg-red-950/40"
                        >
                          <Icon icon="mdi:trash-can-outline" className="text-lg" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
