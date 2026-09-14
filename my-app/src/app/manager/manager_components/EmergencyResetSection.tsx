// @ts-nocheck
"use client";

import { useState } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";

const RESET_CONFIRM_WORD = "RESET"  as const;

export function EmergencyResetSection({
  isResetting,
  onReset,
}: {
  isResetting: boolean;
  onReset: (pin: string) => boolean;
}) {
  const [confirmText, setConfirmText] = useState<string>("");
  const [pin,         setPin]         = useState<string>("");
  const [error,       setError]       = useState<string>("");
  const [expanded,    setExpanded]    = useState<boolean>(false);

  const isConfirmed = confirmText === RESET_CONFIRM_WORD && pin.length === 4;

  function handleReset() {
    if (!isConfirmed) return;
    const success = onReset(pin);
    if (!success) {
      setError("Incorrect Owner PIN. Try again.");
      setPin("");
    }
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 rounded-xl border border-danger px-4 py-3 text-[13px] font-semibold text-danger hover:bg-danger-bg transition-colors"
      >
        <ShieldAlert size={15} />
        Emergency System Reset
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-danger bg-danger-bg p-5">
      <div className="flex flex-col gap-1">
        <p className="text-[14px] font-bold text-danger">⚠️ Emergency System Reset</p>
        <p className="text-[12px] text-text-secondary">
          This will permanently delete ALL data and restore factory seed data.
          This action cannot be undone.
        </p>
      </div>

      {/* Type RESET confirm */}
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-text-secondary">
          Type <span className="font-mono font-bold text-danger">RESET</span> to confirm
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="RESET"
          className="rounded-lg border border-border bg-input px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled focus:border-border-focus focus:outline-none"
        />
      </div>

      {/* Owner PIN */}
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-text-secondary">Owner PIN (4 digits)</label>
        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(""); }}
          placeholder="••••"
          className="w-28 rounded-lg border border-border bg-input px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled focus:border-border-focus focus:outline-none"
        />
        {error && <p className="text-[11px] text-danger">{error}</p>}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { setExpanded(false); setConfirmText(""); setPin(""); setError(""); }}
          className="flex-1 rounded-xl border border-border py-2.5 text-[13px] font-semibold text-text-secondary hover:bg-card transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleReset}
          disabled={!isConfirmed || isResetting}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger py-2.5 text-[13px] font-semibold text-white disabled:opacity-40 transition-colors"
        >
          {isResetting && <Loader2 size={14} className="animate-spin" />}
          Reset All Data
        </button>
      </div>
    </div>
  );
}
