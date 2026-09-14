// RESPONSIBILITY: CashierDashboardSkeleton module logic and UI.
import { CashierPageHeader } from "@/app/cashier/cashier_shift/CashierPageHeader";

export function CashierDashboardSkeleton() {
  const SKELETON_ROWS = 3;

  return (
    <div className="rounded-xl border border-primary/20 bg-white/10 backdrop-blur-lg p-6 shadow-lg flex flex-col gap-6">
      <CashierPageHeader
        onOpenDenom={() => {}}
        onOpenApproval={() => {}}
        onOpenPin={() => {}}
        onOpenHotkeys={() => {}}
        onOpenStockRecovery={() => {}}
        activeStockAlertsCount={0}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-2">
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-skeleton-base animate-pulse" />
          ))}
        </div>
        <div className="h-96 rounded-lg bg-skeleton-base animate-pulse" />
      </div>
    </div>
  );
}
