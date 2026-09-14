// @ts-nocheck
"use client";

// RESPONSIBILITY: Renders the grid of KOT cards for the Kitchen KDS.
// Sorts KOTs by priority (RUSH first) then timestamp.
// DATA FLOW: kitchen/page.tsx → KitchenKotGrid → KitchenKotCard → UI

import { useMemo } from "react";
import { UtensilsCrossed } from "lucide-react";
import { KitchenKotCard } from "./KitchenKotCard";
import { KitchenKotEmptyState } from "./KitchenKotEmptyState";
import type { KitchenKotGridProps } from "@/app/kitchen/kitchen_types/KitchenTypes";

export function KitchenKotGrid({
  kots,
  onStatusChange,
  onBatchStatusChange,
  onVoidDecision,
  onItemPrepTimeSet,
  onOpenRecipe,
  onOpenTicket,
  onNotifyWaiter,
  savingKey,
}: KitchenKotGridProps) {
  const sortedKots = useMemo(
    () => [...kots],
    [kots]
  );

  if (sortedKots.length === 0) {
    return <KitchenKotEmptyState />;
  }

  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-visible sm:snap-none sm:pb-0">
      {sortedKots.map((kot) => (
        <div key={kot.kotId} className="w-[85vw] min-w-[300px] shrink-0 snap-center sm:w-auto sm:shrink sm:snap-align-none">
          <KitchenKotCard
            kot={kot}
            onStatusChange={onStatusChange}
            onBatchStatusChange={onBatchStatusChange}
            onVoidDecision={onVoidDecision}
            onItemPrepTimeSet={onItemPrepTimeSet}
            onOpenRecipe={onOpenRecipe}
            onOpenTicket={onOpenTicket}
            onNotifyWaiter={onNotifyWaiter}
            savingKey={savingKey}
          />
        </div>
      ))}
    </div>
  );
}


