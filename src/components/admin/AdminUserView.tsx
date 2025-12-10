"use client"

import { Icon } from "@iconify/react"
import { BRAND } from "./brand"
import { AdminUser } from "@/lib/admin/types"

interface Props {
  admins: AdminUser[]
  onAddAdmin: () => void
  onDeactivate: (id: string) => void
}

export const AdminUsersView: React.FC<Props> = ({ admins, onAddAdmin, onDeactivate }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Admin Users</h1>
        <button
          onClick={onAddAdmin}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: BRAND.navy }}
        >
          <Icon icon="mdi:plus" className="text-lg" />
          Add Admin
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="max-h-[420px] space-y-3 overflow-y-auto">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between rounded-lg bg-slate-800 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-white">{admin.name}</p>
                <p className="text-xs text-slate-300">{admin.email}</p>
                <p className="text-[11px] text-slate-400">
                  Role: {admin.role === "super_admin" ? "Super Admin" : "Admin"} • Created:{" "}
                  {admin.createdAt}
                </p>
                <p className="text-[11px] text-slate-400">Last Login: {admin.lastLogin}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    admin.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {admin.status === "active" ? "Active" : "Inactive"}
                </span>
                {admin.status === "active" && (
                  <button
                    onClick={() => onDeactivate(admin.id)}
                    className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
          {admins.length === 0 && (
            <p className="text-sm text-slate-400">No admin users yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
