"use client"

import { Icon } from "@iconify/react"
import { AuditLog } from "@/lib/api/admin/types"

interface Props {
  logs: AuditLog[]
}

export const AuditLogsView: React.FC<Props> = ({ logs }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Activity & Audit Logs</h1>
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
        <p className="mb-4 text-sm text-slate-300">
          Complete record of admin actions for security and compliance.
        </p>
        <div className="max-h-[480px] space-y-2 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start justify-between rounded-lg border border-slate-700 bg-slate-800 px-3 py-3"
            >
              <div>
                <p className="text-xs font-semibold text-white">
                  {log.action.replace(/_/g, " ").toUpperCase()}
                </p>
                <p className="text-xs text-slate-300">{log.details}</p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Admin: {log.adminName} • Time: {log.timestamp} • IP: {log.ipAddress}
                </p>
              </div>
              <Icon icon="mdi:shield-check-outline" className="text-slate-400" />
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-sm text-slate-400">No audit logs yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
