"use client";

import { Dispatch, SetStateAction } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { BRAND } from "./brand";
import { AuthAdmin } from "@/lib/api/admin/types";

export type AdminViewId =
  | "dashboard"
  | "bookings"
  | "drivers"
  | "routes"
  | "emails"
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

const NAV_ITEMS: {
  id: AdminViewId;
  label: string;
  icon: string;
  permission?: PermissionKey;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: "mdi:view-dashboard-outline" },
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
    id: "emails",
    label: "Emails",
    icon: "mdi:email-outline",
    permission: "bookings",
  },
  {
    id: "admins",
    label: "Admin Users",
    icon: "mdi:account-group-outline",
    permission: "adminUsers",
  },
];

export const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  currentView,
  setCurrentView,
  onLogout,
  admin,
}: SidebarProps) => {
 
  const hasAnyPermission =
  admin?.isSuperuser ||
  Object.values(admin?.permissions ?? {}).some(Boolean);


  const hasPermission = (permission?: PermissionKey) => {
  if (!admin) return false;

  // Dashboard (no permission key)
  if (!permission) {
    return admin.isSuperuser || hasAnyPermission;
  }

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
      {/* BRAND HEADER */}
      <div className="relative px-4 py-4 border-b border-slate-800">
        <div
          className={`
            flex items-center gap-3
            ${sidebarOpen ? "justify-start" : "justify-center"}
          `}
        >
          {/* Logo Container */}
          <div
            className="
              flex items-center justify-center
              h-14 w-16
              rounded-xl
              bg-white
              ring-1 ring-slate-800
            "
          >
            <Image
              src="/firstclass.png"
              alt="FirstClass Transfers"
              width={38}
              height={38}
              className="object-contain"
              priority
            />
          </div>

          {/* Brand Text */}
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
            flex items-center justify-center
            h-6 w-6
            rounded-full
            bg-slate-900
            border border-slate-800
            text-slate-400
            hover:text-slate-200
            hover:bg-slate-800
            transition
          "
        >
          <Icon
            icon={sidebarOpen ? "mdi:chevron-left" : "mdi:chevron-right"}
            width={14}
          />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.filter((i) => hasPermission(i.permission)).map(
          (item) => {
            const active = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`
                  flex items-center gap-3
                  w-full
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
                  className={!active ? "text-slate-400" : ""}
                />
                {sidebarOpen && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          },
        )}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-slate-800 px-3 py-4">
        <button
          onClick={onLogout}
          className="
            flex items-center gap-3
            w-full
            rounded-xl px-3 py-2.5
            text-sm font-medium
            text-red-400
            hover:bg-red-950/40
            transition
          "
        >
          <Icon icon="mdi:logout" width={18} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
