import { FAQItem } from "@/lib/api/admin/types";
import { SectionWrapper } from "./SectionWrapper";
import { Icon } from "@iconify/react";

type Props = {
  faqs: FAQItem[];
  onAdd: () => void;
  onUpdate: (
    i: number,
    key: keyof FAQItem,
    value: string,
  ) => void;
  onRemove: (i: number) => void;
};

export const RouteFaqs = ({
  faqs,
  onAdd,
  onUpdate,
  onRemove,
}: Props) => (
  <SectionWrapper title="FAQs">
    <div className="space-y-4">
      {faqs.map((f, i) => (
        <div
          key={i}
          className="
            rounded-xl
            border border-slate-700
            bg-slate-900/60
            p-4
            space-y-4
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Icon
                icon="mdi:help-circle-outline"
                className="text-indigo-400"
                width={18}
              />
              FAQ {i + 1}
            </div>

            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-xs text-red-400 hover:text-red-300 transition"
            >
              Remove
            </button>
          </div>

          {/* QUESTION */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Question
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
                focus:border-indigo-500
                focus:ring-2 focus:ring-indigo-500/20
                hover:border-slate-600
              "
              placeholder="e.g. What is the cancellation policy?"
              value={f.question}
              onChange={(e) =>
                onUpdate(i, "question", e.target.value)
              }
            />
          </div>

          {/* ANSWER */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Answer
            </label>
            <textarea
              className="
                w-full min-h-[100px]
                rounded-xl
                bg-slate-900/80
                border border-slate-700
                px-4 py-3
                text-slate-100
                placeholder:text-slate-500
                leading-relaxed
                transition-all
                focus:outline-none
                focus:border-indigo-500
                focus:ring-2 focus:ring-indigo-500/20
                hover:border-slate-600
                resize-y
              "
              placeholder="Provide a clear and helpful answer for customers…"
              value={f.answer}
              onChange={(e) =>
                onUpdate(i, "answer", e.target.value)
              }
            />
          </div>
        </div>
      ))}

      {/* ADD BUTTON */}
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
        Add FAQ
      </button>
    </div>
  </SectionWrapper>
);
