import { VehicleOption } from "@/lib/api/admin/types";
import { SectionWrapper } from "./SectionWrapper";
import { Icon } from "@iconify/react";

type Props = {
  vehicles: VehicleOption[];
  onAdd: () => void;
  onUpdate: (i: number, key: keyof VehicleOption, value: unknown) => void;
  onRemove: (i: number) => void;
};

export const RouteVehicles = ({
  vehicles,
  onAdd,
  onUpdate,
  onRemove,
}: Props) => {

    console.log("🔁 RouteVehicles render", vehicles);

  
  return(
    <SectionWrapper
    title="Vehicle Options"
    subtitle="These options are shown to customers during booking"
  >
    <div className="space-y-5">
      {vehicles.map((v, i) => (
        <div
          key={v.id ?? `new-${i}`}
          // ✅ STABLE KEY
          className="
            rounded-xl
            border border-slate-700
            bg-slate-900/60
            p-5
            space-y-5
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Icon
                icon="mdi:car-multiple"
                className="text-indigo-400"
                width={18}
              />
              Vehicle option {i + 1}
            </div>

            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-xs text-red-400 hover:text-red-300 transition"
            >
              Remove
            </button>
          </div>

          {/* MAIN FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* VEHICLE TYPE */}
            <div className="space-y-2">
              <label className="text-sm text-slate-300 font-medium">
                Vehicle type
              </label>
              <input
                className="
                  w-full rounded-xl bg-slate-900/80
                  border border-slate-700 px-4 py-3
                  text-slate-100 placeholder:text-slate-500
                  transition-all
                  focus:outline-none focus:border-indigo-500
                  focus:ring-2 focus:ring-indigo-500/20
                  hover:border-slate-600
                "
                placeholder="Standard Car, Executive Sedan, Minivan"
                value={v.vehicleType ?? ""}
                onChange={(e) => onUpdate(i, "vehicleType", e.target.value)}
              />
            </div>

            {/* CAPACITY */}
            <div className="space-y-2">
              <label className="text-sm text-slate-300 font-medium">
                Passenger capacity
              </label>
              <input
                type="number"
                className="
                  w-full rounded-xl bg-slate-900/80
                  border border-slate-700 px-4 py-3
                  text-slate-100 placeholder:text-slate-500
                  transition-all
                  focus:outline-none focus:border-indigo-500
                  focus:ring-2 focus:ring-indigo-500/20
                  hover:border-slate-600
                "
                placeholder="up to 4 passengers"
                value={v.maxPassengers ?? ""}
                onChange={(e) =>
                  onUpdate(i, "maxPassengers", Number(e.target.value))
                }
              />
            </div>
          </div>

          {/* IDEAL FOR */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300 font-medium">
              Ideal for
            </label>
            <input
              className="
                w-full rounded-xl bg-slate-900/80
                border border-slate-700 px-4 py-3
                text-slate-100 placeholder:text-slate-500
                transition-all
                focus:outline-none focus:border-indigo-500
                focus:ring-2 focus:ring-indigo-500/20
                hover:border-slate-600
              "
              placeholder="Couples, small families, business travellers"
              value={v.idealFor ?? ""}
              onChange={(e) => onUpdate(i, "idealFor", e.target.value)}
            />
          </div>

          {/* PRICE */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300 font-medium">
              Fixed price
            </label>
            <input
              type="number"
              className="
                w-full rounded-xl bg-slate-900/80
                border border-slate-700 px-4 py-3
                text-slate-100 placeholder:text-slate-500
                transition-all
                focus:outline-none focus:border-emerald-500
                focus:ring-2 focus:ring-emerald-500/20
                hover:border-slate-600
              "
              placeholder="€135"
              value={v.fixedPrice ?? ""}
              onChange={(e) =>
                onUpdate(i, "fixedPrice", Number(e.target.value))
              }
            />
          </div>
        </div>
      ))}

      {/* ADD */}
      <button
        type="button"
        onClick={onAdd}
        className="
          inline-flex items-center gap-2
          text-sm text-blue-400
          hover:text-blue-300
          transition
        "
      >
        <Icon icon="mdi:plus-circle-outline" width={18} />
        Add another vehicle option
      </button>
    </div>
  </SectionWrapper>
  )
}
