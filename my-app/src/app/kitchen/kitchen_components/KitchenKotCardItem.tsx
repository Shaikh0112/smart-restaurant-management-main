// RESPONSIBILITY: Renders an individual item inside a KOT card.

import { Info, Check, X } from "lucide-react";
import { KitchenStatusPipeline } from "./KitchenStatusPipeline";
import { KitchenPrepTimeInput } from "./KitchenPrepTimeInput";
import { OrderCountdownTimer } from "@/components/ui/OrderCountdownTimer";
import type { AppKotItem, KotItemStatus } from "@/types/appTypes";
import type { KitchenPipelineStep } from "@/app/kitchen/kitchen_types/KitchenTypes";

interface KitchenKotCardItemProps {
  item: AppKotItem;
  orderId: string;
  kotId: string;
  savingKey: string;
  onOpenRecipe: (itemId: string) => void;
  onStatusChange: (kotId: string, itemId: string, status: KitchenPipelineStep) => void;
  onItemPrepTimeSet: (orderId: string, kotId: string, itemId: string, mins: number) => void;
  onVoidDecision: (orderId: string, kotId: string, itemId: string, approved: boolean) => void;
}

const PIPELINE_STATUSES: KotItemStatus[] = ["PENDING", "COOKING", "READY"];

export function KitchenKotCardItem({
  item,
  orderId,
  kotId,
  savingKey,
  onOpenRecipe,
  onStatusChange,
  onItemPrepTimeSet,
  onVoidDecision,
}: KitchenKotCardItemProps) {
  const isVoidRequested = item.status === "VOID_REQUESTED";
  const isPipelineItem  = (PIPELINE_STATUSES as string[]).includes(item.status);
  const itemSavingKey   = `${kotId}-${item.itemId}`;
  const isSaving        = savingKey === itemSavingKey;

  return (
    <li
      className={[
        "flex flex-col gap-2 rounded-lg p-3 transition-colors duration-200 border",
        isVoidRequested 
          ? "animate-pulse bg-danger-bg border-danger/40 ring-1 ring-danger/30" 
          : "bg-surface border-border/50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
      ].join(" ")}
    >
      {/* Item name + qty + notes + Recipe spec trigger */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-bold text-text-primary">
              {item.itemId} <span className="text-text-secondary font-medium ml-1">× {item.qty}</span>
            </span>
            <button
              onClick={() => onOpenRecipe(item.itemId)}
              title="View Recipe & Allergen Spec"
              aria-label={`View recipe spec for ${item.itemId}`}
              className="rounded text-text-disabled hover:text-primary transition-colors"
            >
              <Info size={13} />
            </button>
          </div>
          {item.notes && (
            <span className="text-[11px] italic text-text-secondary bg-page rounded w-fit px-1.5 py-0.5 mt-0.5">
              Note: {item.notes}
            </span>
          )}
        </div>

        {/* Countdown Timer & Saving Spinner */}
        <div className="flex items-center gap-2">
          {item.prepEndsAt && item.status !== "READY" && (
            <OrderCountdownTimer prepEndsAt={item.prepEndsAt} />
          )}
          {isSaving && (
            <span className="text-[10px] text-text-secondary animate-pulse">
              saving…
            </span>
          )}
        </div>
      </div>

      {/* Action row: Pipeline and Prep Time Input */}
      {isPipelineItem && (
        <div className="flex items-center justify-between gap-3 mt-1 pt-2 border-t border-border/40">
          <KitchenStatusPipeline
            currentStatus={item.status}
            isDisabled={isSaving}
            onStatusChange={(newStatus: KitchenPipelineStep) =>
              onStatusChange(kotId, item.itemId, newStatus)
            }
          />
          {(item.status === "PENDING" || item.status === "COOKING") && (
            <div className="shrink-0">
              <KitchenPrepTimeInput
                currentMins={item.prepTimeMins || 0}
                onSet={(mins) => onItemPrepTimeSet(orderId, kotId, item.itemId, mins)}
              />
            </div>
          )}
        </div>
      )}

      {/* Waiter Void Request Decision Buttons */}
      {isVoidRequested && (
        <div className="flex flex-col gap-1.5 mt-1 pt-2 border-t border-danger/30">
          <span className="text-[11px] font-bold text-danger uppercase tracking-wider">
            ⚠️ Waiter Void Requested
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onVoidDecision(orderId, kotId, item.itemId, true)}
              aria-label="Approve void request"
              className="flex items-center gap-1 rounded bg-danger px-2.5 py-1 text-[11px] font-bold text-white hover:bg-danger/80 transition-colors"
            >
              <Check size={11} /> Approve Void
            </button>
            <button
              onClick={() => onVoidDecision(orderId, kotId, item.itemId, false)}
              aria-label="Reject void request (already cooking)"
              className="flex items-center gap-1 rounded border border-border bg-card px-2.5 py-1 text-[11px] font-bold text-text-primary hover:bg-surface transition-colors"
            >
              <X size={11} /> Reject (Cooking)
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
