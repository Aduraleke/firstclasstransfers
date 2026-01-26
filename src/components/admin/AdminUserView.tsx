"use client"

import { Icon } from "@iconify/react"
import { BRAND } from "./brand"
import { AdminUser } from "@/lib/api/admin/types"

interface Props {
  admins: AdminUser[]
  loading: boolean
  onAddAdmin: () => void
  onViewAdmin: (id: string) => void
}

export const AdminUsersView: React.FC<Props> = ({
  admins,
  loading,
  onAddAdmin,
  onViewAdmin,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Content */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-lg bg-slate-800"
              />
            ))}
          </div>
        ) : (
          <div className="max-h-[420px] space-y-3 overflow-y-auto">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between rounded-lg bg-slate-800 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-white">
                    {admin.name}
                  </p>
                  <p className="text-xs text-slate-300">
                    {admin.email}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {admin.role === "super_admin"
                      ? "Super Admin"
                      : "Admin"}{" "}
                    • Created {admin.createdAt}
                  </p>
                </div>

                <button
                  onClick={() => onViewAdmin(admin.id)}
                  className="rounded-lg border border-slate-600 px-4 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  View
                </button>
              </div>
            ))}

            {admins.length === 0 && (
              <p className="text-sm text-slate-400">
                No admin users yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
