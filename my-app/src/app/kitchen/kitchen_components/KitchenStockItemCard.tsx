// RESPONSIBILITY: Renders an individual menu item card for stock management with a touch-friendly toggle.

import { Info, AlertTriangle, Send, Check } from "lucide-react";
import type { AppMenuItem, AppLowStockAlert } from "@/types/appTypes";

const STATION_BADGE_CLASS: Record<string, string> = {
  Kitchen: "bg-warning-bg text-warning border-warning/30",
  Bar:     "bg-info-bg text-info border-info/30",
  Bakery:  "bg-success-bg text-success border-success/30",
};

interface KitchenStockItemCardProps {
  item: AppMenuItem;
  togglingId: string | null;
  stockAlerts: AppLowStockAlert[];
  onToggle: (item: AppMenuItem) => void;
  onOpenRecipe?: (itemId: string) => void;
  onSendLowStockAlert: (item: AppMenuItem) => void;
  onMarkFullStockReceived: (item: AppMenuItem) => void;
}

export function KitchenStockItemCard({
  item,
  togglingId,
  stockAlerts,
  onToggle,
  onOpenRecipe,
  onSendLowStockAlert,
  onMarkFullStockReceived,
}: KitchenStockItemCardProps) {
  const isToggling = togglingId === item.id;
  const badgeClass = STATION_BADGE_CLASS[item.station] ?? "bg-card text-text-secondary border-border";
  
  const activeAlert = stockAlerts.find((a) => a.itemId === item.id && a.status !== "RESTOCKED");

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-xs transition-all ${
        item.isAvailable
          ? "border-border bg-card hover:border-emerald-500/30"
          : "border-red-500/40 bg-red-500/5 hover:border-red-500/60"
      }`}
    >
      {/* Left Info */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-base font-bold text-text-primary">{item.name}</span>
          {onOpenRecipe && (
            <button
              onClick={() => onOpenRecipe(item.id)}
              title="View Recipe & Allergen Spec"
              className="rounded p-1 text-text-muted hover:text-primary transition-colors"
            >
              <Info size={15} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${badgeClass}`}>
            {item.station}
          </span>

          <span className={`text-[11px] font-bold ${item.isAvailable ? "text-emerald-500" : "text-red-500"}`}>
            {item.isAvailable ? "In Stock • Updated recently" : "Out of Stock • Updated recently"}
          </span>
        </div>

        {/* Low Stock Alert Controls */}
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {activeAlert ? (
            <div className="flex items-center gap-1.5">
              {activeAlert.status === "IN_PROGRESS" && (
                <span className="flex items-center gap-1 rounded-lg bg-blue-500/10 border border-blue-500/30 px-2 py-1 text-[10px] font-extrabold text-blue-400 animate-pulse">
                  <span>Restock In Progress 🚚</span>
                </span>
              )}
              {activeAlert.status === "DISPATCHED" && (
                <span className="flex items-center gap-1 rounded-lg bg-purple-500/10 border border-purple-500/30 px-2 py-1 text-[10px] font-extrabold text-purple-400 animate-pulse">
                  <span>Stock Supplied 📦</span>
                </span>
              )}
              {activeAlert.status === "ALERT_SENT" && (
                <span className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2 py-1 text-[10px] font-extrabold text-amber-500 animate-pulse">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Alert Sent 🚨</span>
                </span>
              )}
              <button
                onClick={() => onMarkFullStockReceived(item)}
                className="flex items-center gap-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-[10px] font-extrabold text-emerald-400 hover:bg-emerald-500/30 active:scale-95 transition-all shadow-xs"
              >
                <Check className="h-3 w-3" />
                <span>Full Stock Received 🟢</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onSendLowStockAlert(item)}
              className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-[10px] font-extrabold text-amber-500 hover:bg-amber-500/20 active:scale-95 transition-all"
            >
              <Send className="h-3 w-3" />
              <span>Send Low Stock Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: Enlarged 48px Touch Switch Toggle */}
      <button
        role="switch"
        aria-checked={item.isAvailable}
        disabled={isToggling}
        onClick={() => onToggle(item)}
        className={`relative h-9 w-16 shrink-0 rounded-full transition-all duration-200 shadow-inner ${
          item.isAvailable ? "bg-emerald-500" : "bg-red-500"
        } ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-200 flex items-center justify-center font-bold text-xs ${
            item.isAvailable ? "translate-x-8 text-emerald-600" : "translate-x-1 text-red-600"
          }`}
        >
          {item.isAvailable ? "✓" : "✕"}
        </span>
      </button>
    </div>
  );
}
