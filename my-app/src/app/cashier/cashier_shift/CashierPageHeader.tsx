// RESPONSIBILITY: CashierPageHeader module logic and UI.
import { Keyboard, Package, KeyRound, Calculator, ShieldCheck } from "lucide-react";

export function CashierPageHeader({
  onOpenDenom,
  onOpenApproval,
  onOpenPin,
  onOpenHotkeys,
  onOpenStockRecovery,
  activeStockAlertsCount = 0,
}: {
  onOpenDenom?: () => void;
  onOpenApproval?: () => void;
  onOpenPin?: () => void;
  onOpenHotkeys?: () => void;
  onOpenStockRecovery?: () => void;
  activeStockAlertsCount?: number;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-primary">Cashier Cashier POS</h1>
        <p className="text-sm text-text-secondary">Select a table to view and process the bill</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onOpenStockRecovery && (
          <button
            onClick={onOpenStockRecovery}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/20 motion-safe:transition-all relative shadow-xs"
          >
            <Package className="h-4 w-4 text-amber-400" />
            <span>Stock Recovery Hub </span>
            {activeStockAlertsCount > 0 && (
              <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-xs font-extrabold text-white animate-pulse">
                {activeStockAlertsCount}
              </span>
            )}
          </button>
        )}

        {onOpenHotkeys && (
          <button
            onClick={onOpenHotkeys}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-text-primary hover:border-primary motion-safe:transition-all"
          >
            <Keyboard className="h-4 w-4 text-primary" />
            <span>Hotkeys [F1]</span>
          </button>
        )}

        {onOpenPin && (
          <button
            onClick={onOpenPin}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/20 motion-safe:transition-all"
          >
            <KeyRound className="h-4 w-4" />
            <span>Manager PIN [F4]</span>
          </button>
        )}

        {onOpenDenom && (
          <button
            onClick={onOpenDenom}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-500 hover:bg-emerald-500/20 motion-safe:transition-all"
          >
            <Calculator className="h-4 w-4" />
            <span>Cash Denominations</span>
          </button>
        )}
        {onOpenApproval && (
          <button
            onClick={onOpenApproval}
            className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/20 motion-safe:transition-all"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Approval Center</span>
          </button>
        )}
      </div>
    </div>
  );
}
