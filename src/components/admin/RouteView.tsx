"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { BRAND } from "./brand";
import { Route } from "@/lib/api/admin/routeDestination";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";

interface Props {
  routes: Route[];
  loading: boolean;
  expandedGroups: string[];
  toggleGroup: (group: string) => void;
  onAddRoute: () => void;
  onEditRoute: (route: Route) => void;
  onDeleteRoute: (routeId: string) => Promise<void> | void;
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
      <div className="flex h-[60vh] items-center justify-center text-slate-400">
        Mapping transport network…
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <Icon
          icon="mdi:map-outline"
          className="mb-4 text-5xl text-slate-600"
        />
        <p className="text-xl font-medium text-white">
          No routes defined
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Create your first connection to activate the network
        </p>
        <button
          onClick={onAddRoute}
          className="mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: BRAND.navy }}
        >
          <Icon icon="mdi:plus" />
          Create Route
        </button>
      </div>
    );
  }

  const origins = Array.from(
    new Set(routes.map((r) => r.fromLocation).filter(Boolean)),
  );

  return (
    <section className="space-y-12">
      {/* ───────── COMMAND HEADER ───────── */}
      <header className="flex items-end justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Route Atlas
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Transport Network
          </h1>
          <p className="max-w-xl text-sm text-slate-400">
            Configure directional routes, pricing logic, and vehicle
            availability across your operational geography.
          </p>
        </div>

        <button
          onClick={onAddRoute}
          className="
            relative overflow-hidden
            rounded-full px-7 py-3
            text-sm font-semibold text-white
            transition
          "
          style={{ backgroundColor: BRAND.navy }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Icon icon="mdi:plus" />
            New Route
          </span>
        </button>
      </header>

      {/* ───────── HUBS ───────── */}
      <div className="space-y-8">
        {origins.map((origin) => {
          const groupRoutes = routes.filter(
            (r) => r.fromLocation === origin,
          );
          const expanded = expandedGroups.includes(origin);

          return (
            <div key={origin} className="space-y-4">
              {/* HUB HEADER */}
              <button
                onClick={() => toggleGroup(origin)}
                className="
                  group flex w-full items-center justify-between
                  border-b border-slate-800 pb-4
                "
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white">
                    <Icon icon="mdi:map-marker-radius-outline" />
                  </div>

                  <div className="text-left">
                    <p className="text-lg font-semibold text-white">
                      {origin}
                    </p>
                    <p className="text-xs text-slate-400">
                      {groupRoutes.length} outbound connections
                    </p>
                  </div>
                </div>

                <Icon
                  icon={
                    expanded
                      ? "mdi:chevron-up"
                      : "mdi:chevron-down"
                  }
                  className="text-xl text-slate-400 transition group-hover:text-white"
                />
              </button>

              {/* CONNECTIONS */}
              {expanded && (
                <div className="space-y-3 pl-14">
                  {groupRoutes.map((route) => (
                    <ConnectionRow
                      key={route.routeId}
                      route={route}
                      onEdit={() => onEditRoute(route)}
                      onDelete={() => setRouteToDelete(route)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ───────── DELETE CONFIRM ───────── */}
      <ConfirmDeleteModal
        open={!!routeToDelete}
        title="Remove route"
        description={
          routeToDelete
            ? `This will permanently remove the route from ${routeToDelete.fromLocation} to ${routeToDelete.toLocation}.`
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
    </section>
  );
};

/* ───────────────── CONNECTION ROW ───────────────── */

function ConnectionRow({
  route,
  onEdit,
  onDelete,
}: {
  route: Route;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="
        group flex items-center justify-between
        rounded-xl bg-slate-900 px-5 py-4
        ring-1 ring-slate-800
        transition hover:ring-slate-600
      "
    >
      {/* PATH */}
      <div className="space-y-1">
        <p className="text-white font-medium">
          {route.fromLocation}
          <span className="mx-2 text-slate-500">→</span>
          {route.toLocation}
        </p>

        <div className="flex gap-4 text-xs text-slate-400">
          <span>{route.distance}</span>
          <span>{route.time}</span>
          <span>
            Sedan €{route.sedanPrice} · Van €{route.vanPrice}
          </span>
        </div>
      </div>

      {/* COMMANDS */}
      <div className="flex gap-2 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded-full p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Icon icon="mdi:pencil-outline" />
        </button>

        <button
          onClick={onDelete}
          className="rounded-full p-2 text-rose-400 hover:bg-rose-950/40"
        >
          <Icon icon="mdi:trash-can-outline" />
        </button>
      </div>
    </div>
  );
}
