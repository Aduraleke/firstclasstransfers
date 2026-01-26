"use client";
import { useState } from "react";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";
import { Icon } from "@iconify/react";
import { BRAND } from "./brand";
import { Route } from "@/lib/api/admin/routeDestination";

interface Props {
  routes: Route[];
  loading: boolean;
  expandedGroups: string[];
  toggleGroup: (group: string) => void;
  onAddRoute: () => void;
  onEditRoute: (route: Route) => void;
  onDeleteRoute: (routeId: string) => void;
}

export const RoutesView: React.FC<Props> = ({
  routes,
  loading,
  expandedGroups,
  toggleGroup,
  onAddRoute,
  onEditRoute,
  onDeleteRoute,
}) => {
  const [routeToDelete, setRouteToDelete] = useState<Route | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (loading) {
    return (
      <div className="text-center text-slate-400 py-16">Loading routes…</div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="text-center text-slate-400 py-16">
        No routes available
      </div>
    );
  }

  const origins = Array.from(
    new Set(routes.map((r) => r.fromLocation).filter(Boolean)),
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Routes</h1>
          <p className="text-sm text-slate-400">
            Manage transfer routes, pricing, vehicles, and content
          </p>
        </div>

        <button
          onClick={onAddRoute}
          className="
            inline-flex items-center gap-2
            rounded-xl px-5 py-2.5
            text-sm font-semibold text-white
            shadow
            transition hover:opacity-95
          "
          style={{ backgroundColor: BRAND.navy }}
        >
          <Icon icon="mdi:plus" width={18} />
          New Route
        </button>
      </div>

      {/* GROUPS */}

      <div className="space-y-4">
        {origins.map((origin) => {
          const groupRoutes = routes.filter((r) => r.fromLocation === origin);

          const expanded = expandedGroups.includes(origin);

          return (
            <div
              key={origin}
              className="
                rounded-2xl
                border border-slate-800
                bg-slate-900/60
                overflow-hidden
              "
            >
              {/* GROUP HEADER */}
              <button
                onClick={() => toggleGroup(origin)}
                className="
                  w-full flex items-center justify-between
                  px-6 py-4
                  hover:bg-slate-800/60
                  transition
                "
              >
                <div>
                  <h3 className="text-lg font-medium text-white">{origin}</h3>
                  <p className="text-xs text-slate-400">
                    {groupRoutes.length} route
                    {groupRoutes.length !== 1 && "s"}
                  </p>
                </div>

                <Icon
                  icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
                  className="text-xl text-slate-400"
                />
              </button>

              {/* GROUP CONTENT */}
              {expanded && (
                <div className="border-t border-slate-800 px-4 py-3 space-y-2">
                  {groupRoutes.map((route) => (
                    <div
                      key={route.routeId}
                      className="
                        flex items-center justify-between
                        rounded-xl
                        bg-slate-800/70
                        px-4 py-3
                        hover:bg-slate-800
                        transition
                      "
                    >
                      {/* ROUTE INFO */}
                      <div className="space-y-0.5">
                        <p className="font-medium text-white">
                          {route.fromLocation} → {route.toLocation}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                          <span>
                            {route.distance} • {route.time}
                          </span>
                          <span>Sedan €{route.sedanPrice}</span>
                          <span>Van €{route.vanPrice}</span>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditRoute(route)}
                          className="
                            inline-flex items-center justify-center
                            rounded-lg
                            p-2
                            text-slate-300
                            hover:bg-slate-700
                            hover:text-white
                            transition
                          "
                          title="Edit route"
                        >
                          <Icon icon="mdi:pencil-outline" width={18} />
                        </button>

                        <button
                          onClick={() => setRouteToDelete(route)}
                          className="
                            inline-flex items-center justify-center
                            rounded-lg
                            p-2
                            text-red-400
                            hover:bg-red-950/40
                            transition
                          "
                          title="Delete route"
                        >
                          <Icon icon="mdi:trash-can-outline" width={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmDeleteModal
        open={!!routeToDelete}
        title="Delete route"
        description={
          routeToDelete
            ? `Are you sure you want to delete the route from ${routeToDelete.fromLocation} to ${routeToDelete.toLocation}?`
            : ""
        }
        loading={deleting}
        onClose={() => setRouteToDelete(null)}
        onConfirm={async () => {
          if (!routeToDelete) return;

          try {
            setDeleting(true);
            await onDeleteRoute(routeToDelete.routeId);
            setRouteToDelete(null);
          } finally {
            setDeleting(false);
          }
        }}
      />
    </div>
  );
};
