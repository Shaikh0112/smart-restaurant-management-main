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
      setError("Incorrect SuperAdmin PIN. Try again.");
      setPin("");
    }
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 rounded-xl border border-danger px-4 py-3 text-small font-semibold text-danger hover:bg-danger-bg motion-safe:transition-colors"
      >
        <ShieldAlert size={15} strokeWidth={2} />
        Emergency System Reset
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-danger bg-danger-bg p-5">
      <div className="flex flex-col gap-1">
        <p className="text-body font-bold text-danger">⚠️ Emergency System Reset</p>
        <p className="text-table-header text-text-secondary">
          This will permanently delete ALL data and restore factory seed data.
          This action cannot be undone.
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-table-header font-semibold text-text-secondary">
          Type <span className="font-mono font-bold text-danger">RESET</span> to confirm
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="RESET"
          className="rounded-lg border border-border bg-input px-3 py-2 text-small text-text-primary placeholder:text-text-disabled focus:border-border-focus focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-table-header font-semibold text-text-secondary">SuperAdmin PIN (4 digits)</label>
        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(""); }}
          placeholder="••••"
          className="w-28 rounded-lg border border-border bg-input px-3 py-2 text-small text-text-primary placeholder:text-text-disabled focus:border-border-focus focus:outline-none"
        />
        {error && <p className="text-badge text-danger">{error}</p>}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => { setExpanded(false); setConfirmText(""); setPin(""); setError(""); }}
          className="flex-1 rounded-xl border border-border py-2.5 text-small font-semibold text-text-secondary hover:bg-card motion-safe:transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleReset}
          disabled={!isConfirmed || isResetting}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger py-2.5 text-small font-semibold text-white disabled:opacity-40 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
        >
          {isResetting && <Loader2 size={14} className="motion-safe:animate-spin" strokeWidth={2} />}
          Reset All Data
        </button>
      </div>
    </div>
  );
}
