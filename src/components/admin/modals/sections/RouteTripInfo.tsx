import { RouteFormInput } from "@/lib/api/admin/types";
import { SectionWrapper } from "./SectionWrapper";
import { Icon } from "@iconify/react";

type Props = {
  form: RouteFormInput;
  update: <K extends keyof RouteFormInput>(
    key: K,
    value: RouteFormInput[K],
  ) => void;
};

export const RouteTripInfo = ({ form, update }: Props) => (
  <SectionWrapper title="Trip & Pricing">
    <div className="space-y-6">
      {/* TRIP DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Icon
              icon="mdi:map-marker-distance"
              className="text-indigo-400"
              width={18}
            />
            Distance
          </label>

          <input
            className="
              w-full rounded-xl
              bg-slate-900/80
              border border-slate-700
              px-4 py-3
              text-slate-100
              placeholder:text-slate-500
              transition-all duration-200
              focus:outline-none
              focus:border-indigo-500
              focus:ring-2 focus:ring-indigo-500/20
              hover:border-slate-600
            "
            placeholder="120 km"
            value={form.distance}
            onChange={(e) => update("distance", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Icon
              icon="mdi:clock-outline"
              className="text-indigo-400"
              width={18}
            />
            Estimated travel time
          </label>

          <input
            className="
              w-full rounded-xl
              bg-slate-900/80
              border border-slate-700
              px-4 py-3
              text-slate-100
              placeholder:text-slate-500
              transition-all duration-200
              focus:outline-none
              focus:border-indigo-500
              focus:ring-2 focus:ring-indigo-500/20
              hover:border-slate-600
            "
            placeholder="1h 30m"
            value={form.time}
            onChange={(e) => update("time", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Icon
              icon="mdi:clock-outline"
              className="text-indigo-400"
              width={18}
            />
            Duration (minutes)
          </label>

          <input
            type="number"
            min={1}
            step={1}
            required
            value={form.duration_minutes}
            className="
      w-full rounded-xl
      bg-slate-900/80
      border border-slate-700
      px-4 py-3
      text-slate-100
      placeholder:text-slate-500
      transition-all duration-200
      focus:outline-none
      focus:border-indigo-500
      focus:ring-2 focus:ring-indigo-500/20
      hover:border-slate-600
    "
            placeholder="90"
            onChange={(e) =>
              update("duration_minutes", parseInt(e.target.value, 10))
            }
          />
        </div>
      </div>

      {/* PRICING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Icon
              icon="mdi:car-sedan"
              className="text-emerald-400"
              width={18}
            />
            Sedan price
          </label>

          <input
            type="number"
            className="
              w-full rounded-xl
              bg-slate-900/80
              border border-slate-700
              px-4 py-3
              text-slate-100
              placeholder:text-slate-500
              transition-all duration-200
              focus:outline-none
              focus:border-emerald-500
              focus:ring-2 focus:ring-emerald-500/20
              hover:border-slate-600
            "
            placeholder="89"
            value={form.sedanPrice}
            onChange={(e) => update("sedanPrice", Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Icon
              icon="mdi:van-passenger"
              className="text-emerald-400"
              width={18}
            />
            Van price
          </label>

          <input
            type="number"
            className="
              w-full rounded-xl
              bg-slate-900/80
              border border-slate-700
              px-4 py-3
              text-slate-100
              placeholder:text-slate-500
              transition-all duration-200
              focus:outline-none
              focus:border-emerald-500
              focus:ring-2 focus:ring-emerald-500/20
              hover:border-slate-600
            "
            placeholder="119"
            value={form.vanPrice}
            onChange={(e) => update("vanPrice", Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  </SectionWrapper>
);
