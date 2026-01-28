import { Icon } from "@iconify/react";
import { downloadActivityLogs } from "@/lib/api/admin/superAdmin";

interface Props {
  logs: string[];
  onDownload?: () => void;
}

export const AuditLogsView: React.FC<Props> = ({
  logs,
  onDownload,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Activity & Audit Logs
        </h1>

        <button
          onClick={onDownload ?? downloadActivityLogs}
          className="
            inline-flex items-center gap-2
            rounded-lg
            bg-slate-800
            px-4 py-2
            text-sm font-semibold text-white
            hover:bg-slate-700
          "
        >
          <Icon icon="mdi:download" />
          Download
        </button>
      </div>

      {/* Logs Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
        <p className="mb-4 text-sm text-slate-300">
          Complete record of system and admin activity for security and compliance.
        </p>

        <div className="max-h-[480px] space-y-2 overflow-y-auto">
          {logs.map((log, index) => (
            <div
              key={index}
              className="
                flex items-start gap-3
                rounded-lg
                border border-slate-700
                bg-slate-800
                px-3 py-3
              "
            >
              <Icon
                icon={
                  log.includes("ERROR")
                    ? "mdi:alert-circle-outline"
                    : log.includes("WARNING")
                    ? "mdi:alert-outline"
                    : "mdi:shield-check-outline"
                }
                className="
                  mt-0.5
                  text-slate-400
                "
              />

              <pre className="whitespace-pre-wrap wrap-break-word text-xs text-slate-200">
                {log}
              </pre>
            </div>
          ))}

          {logs.length === 0 && (
            <p className="text-sm text-slate-400">
              No activity logs available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
