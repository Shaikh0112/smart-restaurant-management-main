"use client";
// RESPONSIBILITY: Presentation component for AdminActionDialog.
// DATA FLOW: Props -> Component -> UI


import { useState } from "react";

interface AdminActionDialogProps {
  itemName: string;
  actionWord: string; // e.g. "DELETE", "DEACTIVATE"
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminActionDialog({ itemName, actionWord, title, onConfirm, onCancel }: AdminActionDialogProps) {
  const [input, setInput] = useState<string>("");
  const isConfirmed = input === actionWord;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
      onClick={onCancel}
    >
      <div
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-card border border-border p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-bold text-text-primary">{title}</h3>
          <p className="text-[13px] text-text-secondary">
            This will affect <span className="font-semibold text-text-primary">{itemName}</span>.
            Type <span className="font-mono font-bold text-danger">{actionWord}</span> to confirm.
          </p>
        </div>
        <input
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Type ${actionWord}`}
          className="rounded-lg border border-border bg-input px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-mono"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-border px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:bg-page motion-safe:transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!isConfirmed}
            onClick={onConfirm}
            className="rounded-lg bg-danger px-3 py-1.5 text-[13px] font-medium text-white hover:bg-danger-hover disabled:opacity-40 motion-safe:transition-colors"
          >
            {title}
          </button>
        </div>
      </div>
    </div>
  );
}
