
import { SectionWrapper } from "./SectionWrapper";
import { Icon } from "@iconify/react";

type Props = {
  title: string;
  description?: string;
  items: string[];
  placeholder: string;
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
};

export const RouteHighlights = ({
  title,
  description,
  items,
  placeholder,
  onAdd,
  onUpdate,
  onRemove,
}: Props) => {
  return (
    <SectionWrapper title={title} subtitle={description}>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="
              group flex items-center gap-3
              rounded-xl
              border border-slate-700
              bg-slate-900/60
              px-4 py-3
              transition
              focus-within:border-indigo-500
            "
          >
            <Icon
              icon="mdi:check-circle-outline"
              className="text-slate-500 shrink-0"
              width={18}
            />

            <input
              className="
                flex-1 bg-transparent
                text-slate-100 placeholder:text-slate-500
                outline-none
              "
              placeholder={placeholder}
              value={item}
              onChange={(e) => onUpdate(i, e.target.value)}
            />

            {/* Remove – appears on hover */}
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="
                opacity-0 group-hover:opacity-100
                text-slate-400 hover:text-red-400
                transition
              "
              title="Remove"
            >
              <Icon icon="mdi:close-circle-outline" width={18} />
            </button>
          </div>
        ))}

        {/* Add */}
        <button
          type="button"
          onClick={onAdd}
          className="
            inline-flex items-center gap-2
            text-sm text-indigo-400
            hover:text-indigo-300
            transition
          "
        >
          <Icon icon="mdi:plus-circle-outline" width={18} />
          Add item
        </button>
      </div>
    </SectionWrapper>
  );
};

