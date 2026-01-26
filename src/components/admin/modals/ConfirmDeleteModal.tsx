"use client";

import { Icon } from "@iconify/react";

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal: React.FC<Props> = ({
  open,
  title = "Delete route",
  description = "This action cannot be undone.",
  loading,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-950/40 text-red-400">
            <Icon icon="mdi:alert-outline" width={22} />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">{description}</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              inline-flex items-center gap-2
              rounded-lg px-4 py-2
              text-sm font-semibold text-white
              bg-red-600 hover:bg-red-500
              transition
            "
          >
            {loading && <Icon icon="mdi:loading" className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
