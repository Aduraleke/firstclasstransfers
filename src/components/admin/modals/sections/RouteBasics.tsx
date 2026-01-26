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

export const RouteBasics = ({ form, update }: Props) => (
  <SectionWrapper title="Route Locations">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* FROM */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Icon
            icon="mdi:map-marker-outline"
            className="text-blue-400"
            width={18}
          />
          Pickup location
        </label>

        <div className="relative">
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
              focus:border-blue-500
              focus:ring-2 focus:ring-blue-500/20
              hover:border-slate-600
            "
            placeholder="Larnaka Airport (LCA)"
            value={form.fromLocation}
            onChange={(e) => update("fromLocation", e.target.value)}
          />
        </div>
      </div>

      {/* TO */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Icon
            icon="mdi:flag-outline"
            className="text-emerald-400"
            width={18}
          />
          Drop-off location
        </label>

        <div className="relative">
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
              focus:border-emerald-500
              focus:ring-2 focus:ring-emerald-500/20
              hover:border-slate-600
            "
            placeholder="Limassol "
            value={form.toLocation}
            onChange={(e) => update("toLocation", e.target.value)}
          />
        </div>
      </div>
    </div>
  </SectionWrapper>
);
