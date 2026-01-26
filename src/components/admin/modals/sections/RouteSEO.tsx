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

export const RouteSEO = ({ form, update }: Props) => (
  <SectionWrapper title="SEO & Hero Content">
    <div className="space-y-6">
      {/* META TITLE */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Icon
            icon="mdi:text-box-outline"
            className="text-blue-400"
            width={18}
          />
          Meta title
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
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-500/20
            hover:border-slate-600
          "
          placeholder="Larnaka Airport to Limassol Transfer"
          value={form.metaTitle}
          onChange={(e) => update("metaTitle", e.target.value)}
        />
      </div>

      {/* META DESCRIPTION */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Icon
            icon="mdi:card-text-outline"
            className="text-indigo-400"
            width={18}
          />
          Meta description
        </label>

        <textarea
          className="
            w-full min-h-[110px] rounded-xl
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
            resize-y
          "
          placeholder="Book a private transfer from Larnaka Airport to Limassol with fixed pricing, professional drivers, and door-to-door service."
          value={form.metaDescription}
          onChange={(e) => update("metaDescription", e.target.value)}
        />
      </div>

      {/* HERO TITLE */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Icon
            icon="mdi:format-title"
            className="text-emerald-400"
            width={18}
          />
          Hero title
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
            focus:border-emerald-500
            focus:ring-2 focus:ring-emerald-500/20
            hover:border-slate-600
          "
          placeholder="Larnaka Airport to Limassol Private Transfers"
          value={form.heroTitle}
          onChange={(e) => update("heroTitle", e.target.value)}
        />
      </div>

      {/* SUB HEADLINE */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Icon
            icon="mdi:text-long"
            className="text-slate-400"
            width={18}
          />
          Sub headline
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
            focus:border-slate-500
            focus:ring-2 focus:ring-slate-500/20
            hover:border-slate-600
          "
          placeholder="Comfortable, reliable, and stress-free transfers with professional chauffeurs."
          value={form.subHeadline}
          onChange={(e) => update("subHeadline", e.target.value)}
        />
      </div>
    </div>
  </SectionWrapper>
);
