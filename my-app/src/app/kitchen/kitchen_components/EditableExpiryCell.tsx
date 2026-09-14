import { useState } from "react";
import { Check, Pencil } from "lucide-react";

export interface EditableExpiryProps {
  itemId: string;
  expiryDate: string;
  onSave: (id: string, newDate: string) => void;
  isEditable: boolean;
}

export function EditableExpiryCell({ itemId, expiryDate, onSave, isEditable }: EditableExpiryProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string>(expiryDate);

  function handleSave() {
    if (draft) onSave(itemId, draft);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="date"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="rounded-lg border border-border-focus bg-input px-2 py-1 text-[12px]"
        />
        <button
          onClick={handleSave}
          className="rounded-lg p-1 text-success hover:bg-success-bg transition-colors"
          aria-label="Save expiry"
        >
          <Check size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[12px]">{expiryDate}</span>
      {isEditable && (
        <button
          onClick={() => setEditing(true)}
          className="rounded p-0.5 text-text-disabled hover:text-text-secondary transition-colors"
          aria-label="Edit expiry"
        >
          <Pencil size={11} />
        </button>
      )}
    </div>
  );
}
