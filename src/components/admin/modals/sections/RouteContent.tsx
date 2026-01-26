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

export const RouteContent = ({ form, update }: Props) => (
  <SectionWrapper title="Main Content">
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
        <Icon
          icon="mdi:text-box-multiple-outline"
          className="text-indigo-400"
          width={18}
        />
        Route description
      </label>

      <textarea
        className="
          w-full min-h-[220px]
          rounded-xl
          bg-slate-900/80
          border border-slate-700
          px-4 py-3
          text-slate-100
          placeholder:text-slate-500
          leading-relaxed
          transition-all duration-200
          focus:outline-none
          focus:border-indigo-500
          focus:ring-2 focus:ring-indigo-500/20
          hover:border-slate-600
          resize-y
        "
        placeholder="Describe the route experience, what customers can expect, and why this transfer is the best choice..."
        value={form.body}
        onChange={(e) => update("body", e.target.value)}
      />
    </div>
  </SectionWrapper>
);
