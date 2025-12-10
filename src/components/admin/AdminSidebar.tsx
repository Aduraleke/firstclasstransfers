"use client"

import { Dispatch, SetStateAction } from "react"
import { Icon } from "@iconify/react"
import { BRAND } from "./brand"
import Image from "next/image"

export type AdminViewId =
  | "dashboard"
  | "bookings"
  | "drivers"
  | "pricing"
  | "routes"
  | "payments"
  | "emails"
  | "admins"
  | "audit"
  | "settings"

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  currentView: AdminViewId
  setCurrentView: Dispatch<SetStateAction<AdminViewId>>
  onLogout: () => void
}

const NAV_ITEMS: { id: AdminViewId; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "mdi:view-dashboard-outline" },
  { id: "bookings", label: "Bookings", icon: "mdi:calendar-month-outline" },
  { id: "drivers", label: "Drivers", icon: "mdi:steering" },
  { id: "pricing", label: "Pricing", icon: "mdi:cash-multiple" },
  { id: "routes", label: "Routes", icon: "mdi:map-marker-path" },
  { id: "payments", label: "Payments", icon: "mdi:credit-card-outline" },
  { id: "emails", label: "Emails", icon: "mdi:email-outline" },
  { id: "admins", label: "Admin Users", icon: "mdi:account-group-outline" },
  { id: "audit", label: "Audit Logs", icon: "mdi:clipboard-text-search-outline" },
  { id: "settings", label: "Settings", icon: "mdi:cog-outline" },
]

export const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  currentView,
  setCurrentView,
  onLogout,
}: SidebarProps) => {
  return (
    <aside
      className={`flex flex-col border-r transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
      style={{ backgroundColor: "#020617", borderColor: "#1f2937" }}
    >
      <div className="flex items-center justify-between bg-white px-4 py-3">
        {sidebarOpen && (
          <Image
            src="/firstclass.png"
            alt="FirstClass Transfers"
            width={140}        // 👈 required
            height={40}        // 👈 required
            className="h-10 w-auto"
            priority
          />
        )}
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
        >
          <Icon icon={sidebarOpen ? "mdi:chevron-left" : "mdi:menu"} className="text-xl" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <Icon
                icon={item.icon}
                className="text-lg"
                style={active ? { color: BRAND.gold } : { color: "#9ca3af" }}
              />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="border-t px-4 py-3" style={{ borderColor: "#1f2937" }}>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-950/40"
        >
          <Icon icon="mdi:logout" className="text-lg" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
