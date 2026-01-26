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

export const RouteCTA = ({ form, update }: Props) => (
  <SectionWrapper title="Call to Action">
    <div className="space-y-6">
      {/* IMAGE UPLOAD */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Icon
            icon="mdi:image-outline"
            className="text-indigo-400"
            width={18}
          />
          Hero image
        </label>

        <input
          type="file"
          className="
            w-full rounded-xl
            bg-slate-900/80
            border border-slate-700
            px-4 py-2.5
            text-slate-300
            file:mr-4 file:rounded-lg
            file:border-0
            file:bg-slate-800
            file:px-4 file:py-2
            file:text-sm
            file:text-slate-200
            hover:border-slate-600
            transition
          "
          onChange={(e) =>
            update("image", e.target.files?.[0] ?? null)
          }
        />

        <p className="text-xs text-slate-400">
          This image appears at the top of the route page.
        </p>
      </div>

      {/* CTA LABEL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Icon
            icon="mdi:gesture-tap-button"
            className="text-emerald-400"
            width={18}
          />
          Button label
        </label>

        <input
          className="
            w-full rounded-xl
            bg-slate-900/80
            border border-slate-700
            px-4 py-3
            text-slate-100
            placeholder:text-slate-500
            transition-all
            focus:outline-none
            focus:border-emerald-500
            focus:ring-2 focus:ring-emerald-500/20
            hover:border-slate-600
          "
          placeholder="Book your transfer"
          value={form.bookCtaLabel}
          onChange={(e) =>
            update("bookCtaLabel", e.target.value)
          }
        />
      </div>

      {/* CTA SUPPORT */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Icon
            icon="mdi:information-outline"
            className="text-slate-400"
            width={18}
          />
          Support text
        </label>

        <input
          className="
            w-full rounded-xl
            bg-slate-900/80
            border border-slate-700
            px-4 py-3
            text-slate-100
            placeholder:text-slate-500
            transition-all
            focus:outline-none
            focus:border-slate-500
            focus:ring-2 focus:ring-slate-500/20
            hover:border-slate-600
          "
          placeholder="Free cancellation up to 24 hours before pickup"
          value={form.bookCtaSupport}
          onChange={(e) =>
            update("bookCtaSupport", e.target.value)
          }
        />
      </div>
    </div>
  </SectionWrapper>
);
