"use client";

import { useState } from "react";
import { Check, Pencil } from "lucide-react";

export type StockStatus = "OK" | "LOW" | "EXPIRED";

import type { AppInventoryItem } from "@/types/appTypes";

export function getStockStatus(item: AppInventoryItem): StockStatus {
  if (new Date(item.expiryDate).getTime() < Date.now()) return "EXPIRED";
  if (item.currentStock <= item.threshold) return "LOW";
  return "OK";
}

export function getExpiryClass(expiryDate: string): string {
  const diffDays = (new Date(expiryDate).getTime() - Date.now()) / 86400000;
  if (diffDays < 0) return "text-danger font-semibold";
  if (diffDays <= 3) return "text-warning font-semibold";
  return "text-text-secondary";
}

// RESPONSIBILITY: Status badge for a single inventory row.
export function StatusBadge({ status }: { status: StockStatus }) {
  const styles: Record<StockStatus, string> = {
    OK:      "bg-success-bg text-success",
    LOW:     "bg-warning-bg text-warning",
    EXPIRED: "bg-danger-bg text-danger",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${styles[status]}`}>
      {status === "OK" ? "Fresh" : status === "LOW" ? "Low Stock" : "Expired"}
    </span>
  );
}

// RESPONSIBILITY: Inline editable stock qty cell --- click pencil to edit, check to save.
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
          className="w-20 rounded-lg border border-border-focus bg-input px-2 py-1 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <span className="text-[11px] text-text-secondary">{unit}</span>
        <button
          onClick={handleSave}
          className="rounded-lg p-1 text-success hover:bg-success-bg motion-safe:transition-colors"
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
        className="rounded p-0.5 text-text-disabled hover:text-text-secondary motion-safe:transition-colors"
        aria-label="Edit stock"
      >
        <Pencil size={11} />
      </button>
    </div>
  );
}

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
          className="rounded-lg p-1 text-success hover:bg-success-bg motion-safe:transition-colors"
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
          className="rounded p-0.5 text-text-disabled hover:text-text-secondary motion-safe:transition-colors"
          aria-label="Edit expiry"
        >
          <Pencil size={11} />
        </button>
      )}
    </div>
  );
}
