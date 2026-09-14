// RESPONSIBILITY: Renders a single KOT item row in the table actions drawer.
"use client";
import { useState } from "react";
import { Check, Edit, Trash2 } from "lucide-react";
import { WaiterTablePrepCountdown } from "./WaiterTablePrepCountdown";

export function WaiterKotItemRow({ item }: { item: any }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-page p-3 text-sm">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-text-primary">{item.name}</span>
          <span className="text-xs text-text-secondary">Qty: {item.quantity}</span>
        </div>
        {item.status === "COOKING" && item.startTime && item.estimatedDurationMs && (
          <WaiterTablePrepCountdown startTime={item.startTime} estimatedDurationMs={item.estimatedDurationMs} />
        )}
      </div>
    </div>
  );
}
