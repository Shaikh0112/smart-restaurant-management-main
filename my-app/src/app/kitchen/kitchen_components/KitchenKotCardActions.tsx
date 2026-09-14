// RESPONSIBILITY: Renders bulk action buttons for a Kitchen KOT card.

import { Play, CheckCheck, BellRing } from "lucide-react";
import type { KitchenFlatKot, KitchenPipelineStep } from "@/app/kitchen/kitchen_types/KitchenTypes";

interface KitchenKotCardActionsProps {
  kot: KitchenFlatKot;
  hasPendingItems: boolean;
  hasCookingItems: boolean;
  hasReadyItems: boolean;
  onBatchStatusChange: (kotId: string, targetStatus: KitchenPipelineStep) => void;
  onNotifyWaiter?: (kot: KitchenFlatKot) => void;
}

export function KitchenKotCardActions({
  kot,
  hasPendingItems,
  hasCookingItems,
  hasReadyItems,
  onBatchStatusChange,
  onNotifyWaiter,
}: KitchenKotCardActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-surface/80 rounded-lg px-2.5 py-1.5 border border-border/40">
      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Quick Actions</span>
      <div className="flex flex-wrap items-center gap-1.5">
        {hasPendingItems && (
          <button
            onClick={() => onBatchStatusChange(kot.kotId, "COOKING")}
            aria-label="Start all pending items cooking"
            className="flex items-center gap-1 rounded bg-warning-bg px-2 py-0.5 text-[10px] font-bold text-warning hover:bg-warning/20 transition-colors"
          >
            <Play size={10} /> Start All
          </button>
        )}
        {hasCookingItems && (
          <button
            onClick={() => onBatchStatusChange(kot.kotId, "READY")}
            aria-label="Mark all items as ready"
            className="flex items-center gap-1 rounded bg-success-bg px-2 py-0.5 text-[10px] font-bold text-success hover:bg-success/20 transition-colors"
          >
            <CheckCheck size={10} /> Mark All Ready
          </button>
        )}
        {hasReadyItems && onNotifyWaiter && (
          <button
            onClick={() => onNotifyWaiter(kot)}
            aria-label="Broadcast pickup alert to waiter"
            className="flex items-center gap-1 rounded bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary hover:bg-primary/20 transition-colors"
          >
            <BellRing size={10} /> Notify Waiter
          </button>
        )}
      </div>
    </div>
  );
}
