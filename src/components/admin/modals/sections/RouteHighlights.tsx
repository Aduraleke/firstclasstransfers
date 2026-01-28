import { useState } from "react";
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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <SectionWrapper title={title} subtitle={description}>
      <div className="space-y-4">
        {items.map((item, i) => {
          const isEditing = editingIndex === i;

          return (
            <div
              key={i}
              className="
                flex items-center gap-3
                rounded-xl
                border border-slate-700
                bg-slate-900/60
                px-4 py-3
              "
            >
              <Icon
                icon="mdi:check-circle-outline"
                className="text-slate-400"
                width={18}
              />

              <input
                disabled={!isEditing}
                className={`
                  flex-1 bg-transparent
                  text-slate-100 placeholder:text-slate-500
                  outline-none
                  ${!isEditing ? "cursor-default opacity-70" : ""}
                `}
                placeholder={placeholder}
                value={item}
                onChange={(e) => onUpdate(i, e.target.value)}
              />

              {/* EDIT / SAVE */}
              <button
                type="button"
                onClick={() =>
                  setEditingIndex(isEditing ? null : i)
                }
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                {isEditing ? "Save" : "Edit"}
              </button>

              {/* REMOVE */}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            </div>
          );
        })}

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
          Add item
        </button>
      </div>
    </SectionWrapper>
  );
};
