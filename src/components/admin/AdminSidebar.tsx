"use client";

import { Dispatch, SetStateAction } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { BRAND } from "./brand";
import { AuthAdmin } from "@/lib/api/admin/types";

/* ───────────────── TYPES ───────────────── */

export type AdminViewId =
  | "home"
  | "dashboard"
  | "bookings"
  | "drivers"
  | "routes"
  | "vehicles"
  | "admins"
  | "audit";


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  currentView: AdminViewId;
  setCurrentView: Dispatch<SetStateAction<AdminViewId>>;
  onLogout: () => void;
  admin: AuthAdmin | null;
}

type PermissionKey = keyof AuthAdmin["permissions"];

/* ───────────────── NAV CONFIG ───────────────── */

const NAV_ITEMS: {
  id: AdminViewId;
  label: string;
  icon: string;
  permission?: PermissionKey;
  superuserOnly?: boolean;
}[] = [
  {
    id: "home",
    label: "Home",
    icon: "mdi:home-outline",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "mdi:view-dashboard-outline",
    superuserOnly: true, // 🔒 SUPERUSER ONLY
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: "mdi:calendar-month-outline",
    permission: "bookings",
  },
  {
    id: "drivers",
    label: "Drivers",
    icon: "mdi:steering",
    permission: "drivers",
  },
  {
    id: "routes",
    label: "Routes",
    icon: "mdi:map-marker-path",
    permission: "routes",
  },
  {
    id: "vehicles",
    label: "Vehicles",
    icon: "mdi:car-outline",
    permission: "vehicles",
  },
  {
    id: "admins",
    label: "Admin Users",
    icon: "mdi:account-group-outline",
    permission: "adminUsers",
  },
{
  id: "audit",
  label: "Audit Logs",
  icon: "mdi:shield-search",
  superuserOnly: true,
}
];

/* ───────────────── COMPONENT ───────────────── */

export const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  currentView,
  setCurrentView,
  onLogout,
  admin,
}: SidebarProps) => {


const canAccess = (
  permission?: PermissionKey,
  superuserOnly?: boolean,
) => {
  if (!admin) return false;

  // 🔒 Superuser-only items
  if (superuserOnly) {
    return admin.isSuperuser;
  }

  // 🏠 Public items (like Home) → ALWAYS visible
  if (!permission) {
    return true;
  }

  // 🔐 Permission-based items
  return admin.isSuperuser || !!admin.permissions[permission];
};


  return (
    <aside
      className={`
        flex flex-col
        bg-slate-950
        border-r border-slate-800
        transition-all duration-300
        ${sidebarOpen ? "w-64" : "w-20"}
      `}
    >
      {/* ───────── BRAND ───────── */}
      <div className="relative border-b border-slate-800 px-4 py-4">
        <div
          className={`flex items-center gap-3 ${
            sidebarOpen ? "justify-start" : "justify-center"
          }`}
        >
          <div className="flex h-14 w-16 items-center justify-center rounded-xl bg-white ring-1 ring-slate-800">
            <Image
              src="/firstclass.png"
              alt="FirstClass Transfers"
              width={38}
              height={38}
              className="object-contain"
              priority
            />
          </div>

          {sidebarOpen && (
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">
                FirstClass
              </p>
              <p className="text-xs text-slate-400">
                Admin Panel
              </p>
            </div>
          )}
        </div>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen((p) => !p)}
          className="
            absolute -right-3 top-1/2 -translate-y-1/2
            flex h-6 w-6 items-center justify-center
            rounded-full
            border border-slate-800
            bg-slate-900
            text-slate-400
            transition
            hover:bg-slate-800
            hover:text-slate-200
          "
        >
          <Icon
            icon={sidebarOpen ? "mdi:chevron-left" : "mdi:chevron-right"}
            width={14}
          />
        </button>
      </div>

      {/* ───────── NAV ───────── */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.filter((item) =>
          canAccess(item.permission, item.superuserOnly),
        ).map((item) => {
          const active = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                flex w-full items-center gap-3
                rounded-xl px-3 py-2.5
                text-sm font-medium
                transition
                ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                }
              `}
            >
              <Icon
                icon={item.icon}
                width={18}
                style={active ? { color: BRAND.gold } : undefined}
              />
              {sidebarOpen && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ───────── FOOTER ───────── */}
      <div className="border-t border-slate-800 px-3 py-4">
        <button
          onClick={onLogout}
          className="
            flex w-full items-center gap-3
            rounded-xl px-3 py-2.5
            text-sm font-medium
            text-red-400
            transition
            hover:bg-red-950/40
          "
        >
          <Icon icon="mdi:logout" width={18} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
