"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Vehicle } from "@/lib/api/admin/vehicles";

/* ───────────────── TYPES ───────────────── */

interface Props {
  vehicles: Vehicle[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: number) => Promise<void>;
}

/* ───────────────── VIEW ───────────────── */

export const VehiclesView: React.FC<Props> = ({
  vehicles,
  loading,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [confirm, setConfirm] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  return (
    <section className="flex flex-col gap-6">
      {/* HEADER / COMMAND BAR */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Fleet Vehicles</h1>
          <p className="text-xs text-slate-400">
            Registered vehicles and capacity configuration
          </p>
        </div>

        <button
          onClick={onAdd}
          className="
            inline-flex items-center gap-2
            rounded-md bg-white px-4 py-2
            text-sm font-medium text-black
            hover:bg-slate-200
          "
        >
          <Icon icon="mdi:plus" />
          Add vehicle
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          Loading vehicles…
        </div>
      ) : vehicles.length === 0 ? (
        <div className="rounded-md border border-slate-800 bg-slate-900 p-14 text-center">
          <p className="text-white font-medium">No vehicles registered</p>
          <p className="mt-1 text-sm text-slate-400">
            Vehicles added here become available for routing and assignment.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Plate</th>
                <th className="px-4 py-3 text-left font-medium">Vehicle</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Capacity</th>
                <th className="px-4 py-3 text-right font-medium" />
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {vehicles.map((v) => (
                <tr
                  key={v.id}
                  className="group bg-slate-950 hover:bg-slate-900 transition"
                >
                  <td className="px-4 py-3 font-mono text-white">
                    {v.licensePlate}
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-white font-medium">
                      {v.make} {v.model}
                    </p>
                    <p className="text-xs text-slate-500">
                      {v.year || "—"} {v.color && `• ${v.color}`}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {v.type}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {v.maxPassengers}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => onEdit(v)}
                        className="rounded px-2 py-1 text-slate-300 hover:bg-slate-800"
                        title="Edit vehicle"
                      >
                        <Icon icon="mdi:pencil-outline" />
                      </button>

                      <button
                        onClick={() => setConfirm(v)}
                        className="rounded px-2 py-1 text-rose-400 hover:bg-rose-950/40"
                        title="Delete vehicle"
                      >
                        <Icon icon="mdi:trash-can-outline" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      <DeleteConfirm
        vehicle={confirm}
        loading={deleting}
        onClose={() => setConfirm(null)}
        onConfirm={async () => {
          if (!confirm) return;
          try {
            setDeleting(true);
            await onDelete(confirm.id);
            setConfirm(null);
          } finally {
            setDeleting(false);
          }
        }}
      />
    </section>
  );
};

/* ───────────────── DELETE MODAL ───────────────── */

function DeleteConfirm({
  vehicle,
  loading,
  onClose,
  onConfirm,
}: {
  vehicle: Vehicle | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-sm rounded-md border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-sm font-semibold text-white">
          Confirm deletion
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          You are about to permanently remove{" "}
          <span className="text-white font-medium">
            {vehicle.make} {vehicle.model}
          </span>
          . This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm text-slate-300 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              rounded bg-rose-600 px-4 py-2
              text-sm font-medium text-white
              hover:bg-rose-500
              disabled:opacity-60
            "
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
