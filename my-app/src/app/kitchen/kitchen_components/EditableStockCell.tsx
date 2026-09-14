import { useState } from "react";
import { Check, Pencil } from "lucide-react";

export interface EditableCellProps {
  itemId:        string;
  currentStock:  number;
  unit:          string;
  onSave:        (id: string, qty: number) => void;
}

export function EditableStockCell({ itemId, currentStock, unit, onSave }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState<string>(String(currentStock));

  function handleSave() {
    const parsed = parseFloat(draft);
    if (!isNaN(parsed) && parsed >= 0) onSave(itemId, parsed);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          autoFocus
          type="number"
          min={0}
          step={0.1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-20 rounded-lg border border-border-focus bg-input px-2 py-1 text-[12px] text-text-primary focus:outline-none"
        />
        <span className="text-[11px] text-text-secondary">{unit}</span>
        <button
          onClick={handleSave}
          className="rounded-lg p-1 text-success hover:bg-success-bg transition-colors"
          aria-label="Save stock"
        >
          <Check size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[13px] font-medium text-text-primary">
        {currentStock} {unit}
      </span>
      <button
        onClick={() => { setDraft(String(currentStock)); setEditing(true); }}
        className="rounded p-0.5 text-text-disabled hover:text-text-secondary transition-colors"
        aria-label="Edit stock"
      >
        <Pencil size={11} />
      </button>
    </div>
  );
}
