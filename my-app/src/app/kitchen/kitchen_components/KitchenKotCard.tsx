"use client";

// RESPONSIBILITY: Renders a single KOT card for the Kitchen KDS.
// Composes KitchenKotCardHeader, KitchenKotCardActions, and KitchenKotCardItem.

import { useState, useEffect } from "react";
import { KitchenKotCardHeader } from "./KitchenKotCardHeader";
import { KitchenKotCardActions } from "./KitchenKotCardActions";
import { KitchenKotCardItem } from "./KitchenKotCardItem";
import type { KitchenKotCardProps } from "@/app/kitchen/kitchen_types/KitchenTypes";

// ─── Constants (Rule 35: No magic strings) ────────────────────────────────────

const STATION_BORDER: Record<string, string> = {
  Kitchen: "border-l-warning",
  Bar:     "border-l-info",
  Bakery:  "border-l-success",
};

const STATION_BADGE: Record<string, string> = {
  Kitchen: "bg-warning-bg text-warning",
  Bar:     "bg-info-bg text-info",
  Bakery:  "bg-success-bg text-success",
};

const WARNING_ELAPSED_SEC = 450;  // 7.5 minutes (Yellow)
const EXCEEDED_ELAPSED_SEC = 600; // 10 minutes (Orange)
const URGENT_ELAPSED_SEC   = 900; // 15 minutes (Red)

export function KitchenKotCard({
  kot,
  onStatusChange,
  onBatchStatusChange,
  onVoidDecision,
  onItemPrepTimeSet,
  onOpenRecipe,
  onOpenTicket,
  onNotifyWaiter,
  savingKey,
}: KitchenKotCardProps) {
  const [nowMs, setNowMs] = useState(() => Date.now());

  // Live elapsed timer — updates every second
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsedSec  = Math.floor((nowMs - kot.timestamp) / 1000);
  const isUrgent    = elapsedSec >= URGENT_ELAPSED_SEC;
  const isExceeded  = elapsedSec >= EXCEEDED_ELAPSED_SEC && !isUrgent;
  const isWarning   = elapsedSec >= WARNING_ELAPSED_SEC && !isExceeded && !isUrgent;

  const isRush = kot.priority === "RUSH";
  const isVip  = kot.priority === "VIP";

  const stationBorderClass = STATION_BORDER[kot.station] ?? "border-l-border";
  const badgeClass         = STATION_BADGE[kot.station]  ?? "bg-card text-text-secondary";

  // SLA Urgency Border Styling
  const borderClass = isRush
    ? "border-l-danger border-l-[6px] ring-2 ring-danger/50 bg-danger-bg/20 animate-pulse"
    : isUrgent
    ? "border-l-red-600 border-l-[6px] ring-2 ring-red-600/50 bg-red-500/10 animate-pulse"
    : isExceeded
    ? "border-l-orange-500 border-l-[5px] ring-1 ring-orange-500/40 bg-orange-500/10"
    : isWarning
    ? "border-l-amber-500 border-l-[5px] ring-1 ring-amber-500/30 bg-amber-500/10"
    : `${stationBorderClass} border-l-[5px]`;

  const hasPendingItems = kot.items.some((item) => item.status === "PENDING");
  const hasCookingItems = kot.items.some((item) => item.status === "COOKING" || item.status === "PENDING");
  const hasReadyItems   = kot.items.some((item) => item.status === "READY");

  return (
    <div
      className={[
        "group flex flex-col gap-3 rounded-xl border border-border bg-gradient-to-b from-card to-page p-4",
        "shadow-sm transition-all duration-300 hover:shadow-md relative",
        borderClass,
      ].join(" ")}
      onContextMenu={(e) => {
        e.preventDefault();
        // Since this is a card-level context menu, we can just log or trigger actions
        // In a real app, you'd show a floating dropdown here
        console.log("Context menu triggered for KOT ID:", kot.kotId);
        // Copy KOT ID to clipboard as a basic context action
        navigator.clipboard.writeText(kot.kotId);
        // Alert would be replaced by a toast in production
        // alert(`Copied KOT ID: ${kot.kotId}`);
      }}
    >
      <KitchenKotCardHeader
        kot={kot}
        nowMs={nowMs}
        isRush={isRush}
        isVip={isVip}
        isUrgent={isUrgent}
        isWarning={isWarning}
        badgeClass={badgeClass}
        onOpenTicket={onOpenTicket}
      />

      <KitchenKotCardActions
        kot={kot}
        hasPendingItems={hasPendingItems}
        hasCookingItems={hasCookingItems}
        hasReadyItems={hasReadyItems}
        onBatchStatusChange={onBatchStatusChange}
        onNotifyWaiter={onNotifyWaiter}
      />

      <ul className="flex flex-col gap-2.5">
        {kot.items.map((item) => (
          <KitchenKotCardItem
            key={item.itemId}
            item={item}
            orderId={kot.orderId}
            kotId={kot.kotId}
            savingKey={savingKey}
            onOpenRecipe={onOpenRecipe}
            onStatusChange={onStatusChange}
            onItemPrepTimeSet={onItemPrepTimeSet}
            onVoidDecision={onVoidDecision}
          />
        ))}
      </ul>
    </div>
  );
}
