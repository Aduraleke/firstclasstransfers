import { SectionWrapper } from "./SectionWrapper";

type Props = {
  title: string;
  items: string[];
  onAdd: () => void;
  onUpdate: (i: number, v: string) => void;
  onRemove: (i: number) => void;
};

export const RouteLists = ({
  title,
  items,
  onAdd,
  onUpdate,
  onRemove,
}: Props) => (
  <SectionWrapper title={title}>
    {items.map((val, i) => (
      <div key={i} className="flex gap-2">
        <input
          className="input flex-1"
          value={val}
          onChange={(e) => onUpdate(i, e.target.value)}
        />
        <button
          type="button"
          onClick={() => onRemove(i)}
          className="px-3 rounded bg-red-500/20 text-red-400"
        >
          ✕
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={onAdd}
      className="text-blue-400 text-sm"
    >
      + Add Item
    </button>
  </SectionWrapper>
);
