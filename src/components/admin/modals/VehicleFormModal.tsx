"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Vehicle, VehicleFormInput } from "@/lib/api/admin/vehicles";

const VEHICLE_TYPES = [
  { label: "Sedan", value: "sedan" },
  { label: "Minivan", value: "vclass" },
] as const;

type VehicleTypeValue = (typeof VEHICLE_TYPES)[number]["value"];

/* ───────────────── HELPERS ───────────────── */

function normalizeVehicleType(
  type?: string | null,
): VehicleTypeValue {
  switch (type?.toLowerCase()) {
    case "sedan":
      return "sedan";

    case "minivan":   // ✅ THIS WAS MISSING
    case "vclass":
      return "vclass";

    default:
      return "sedan";
  }
}



function mapVehicleToForm(vehicle?: Vehicle | null): VehicleFormInput {
  return {
    licensePlate: vehicle?.licensePlate ?? "",
    make: vehicle?.make ?? "",
    model: vehicle?.model ?? "",
    year: vehicle?.year ?? "",
    color: vehicle?.color ?? "",
    type: normalizeVehicleType(vehicle?.type),
    maxPassengers: vehicle?.maxPassengers ?? 1,
  };
}


/* ───────────────── COMPONENT ───────────────── */

interface Props {
  open: boolean;
  initial?: Vehicle | null;
  onSubmit: (input: VehicleFormInput, id?: number) => Promise<void>;
  onClose: () => void;
}

export const VehicleFormModal = ({
  open,
  initial,
  onSubmit,
  onClose,
}: Props) => {
  const [form, setForm] = useState<VehicleFormInput>(() =>
    mapVehicleToForm(initial),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setForm(mapVehicleToForm(initial));
  }, [open, initial]);

  if (!open) return null;

  const submit = async () => {
    
    try {
      setLoading(true);
      await onSubmit(form, initial?.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="flex h-full items-center justify-center px-6">
        <div
          className="
            relative w-full max-w-4xl
            rounded-2xl
            bg-[#0B0F1A]
            shadow-[0_0_0_1px_rgba(255,255,255,0.06)]
            overflow-hidden
          "
        >
          {/* TOP BAR */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Vehicle Console
              </p>
              <h2 className="text-xl font-semibold text-white">
                {initial ? "Edit Vehicle" : "Register Vehicle"}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5"
            >
              <Icon icon="mdi:close" />
            </button>
          </div>

          {/* BODY */}
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 px-8 py-10">
            {/* LEFT — IDENTITY */}
            <section className="space-y-8">
              <ConsoleField
                label="License Plate"
                value={form.licensePlate}
                onChange={(v) => setForm({ ...form, licensePlate: v })}
                emphasis
              />

              <ConsoleField
                label="Manufacturer"
                value={form.make}
                onChange={(v) => setForm({ ...form, make: v })}
              />

              <ConsoleField
                label="Model"
                value={form.model}
                onChange={(v) => setForm({ ...form, model: v })}
              />

              <div className="grid grid-cols-2 gap-6">
                <ConsoleField
                  label="Year"
                  value={form.year}
                  onChange={(v) => setForm({ ...form, year: v })}
                />

                <ConsoleField
                  label="Color"
                  value={form.color}
                  onChange={(v) => setForm({ ...form, color: v })}
                />
              </div>
            </section>

            {/* RIGHT — SPECS */}
            <section className="space-y-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">
                  Configuration
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">
                      Vehicle Type
                    </label>
                    <div className="flex gap-2">
                      {VEHICLE_TYPES.map(({ label, value }) => (
                        <button
                          key={value}
                          onClick={() => setForm({ ...form, type: value })}
                          className={`
        px-4 py-2 rounded-lg text-sm transition
        ${
          form.type === value
            ? "bg-white text-black"
            : "bg-white/5 text-slate-300 hover:bg-white/10"
        }
      `}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-2">
                      Max Passengers
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={form.maxPassengers}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          maxPassengers: Number(e.target.value),
                        })
                      }
                      className="
                        w-full
                        bg-transparent
                        border-b border-white/10
                        py-2
                        text-white
                        outline-none
                        focus:border-emerald-400
                        transition
                      "
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-8 py-5 border-t border-white/5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              onClick={submit}
              disabled={loading}
              className="
                rounded-lg
                bg-emerald-400
                px-6 py-2
                text-sm font-semibold text-black
                hover:bg-emerald-300
                disabled:opacity-60
              "
            >
              {loading ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────────────── FIELD ───────────────── */

function ConsoleField({
  label,
  value,
  onChange,
  emphasis = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  emphasis?: boolean;
}) {
  return (
    <div>
      <p
        className={`
          text-xs uppercase tracking-widest mb-2
          ${emphasis ? "text-emerald-400" : "text-slate-400"}
        `}
      >
        {label}
      </p>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full
          bg-transparent
          border-b
          ${emphasis ? "border-emerald-400/40" : "border-white/10"}
          py-2
          text-lg
          text-white
          outline-none
          focus:border-emerald-400
          transition
        `}
      />
    </div>
  );
}
