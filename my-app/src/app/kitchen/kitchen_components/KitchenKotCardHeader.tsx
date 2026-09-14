// RESPONSIBILITY: Renders the header of a Kitchen KOT card (Table, SLA timer, Priority Badges).

import { Printer, Flame, Star, Clock } from "lucide-react";
import type { KitchenFlatKot } from "@/app/kitchen/kitchen_types/KitchenTypes";

interface KitchenKotCardHeaderProps {
  kot: KitchenFlatKot;
  nowMs: number;
  isRush: boolean;
  isVip: boolean;
  isUrgent: boolean;
  isWarning: boolean;
  badgeClass: string;
  onOpenTicket: (kot: KitchenFlatKot) => void;
}

function getElapsedLabel(timestamp: number, nowMs: number): string {
  const diffSec = Math.floor((nowMs - timestamp) / 1000);
  if (diffSec < 60) return `${diffSec}s`;
  const mins = Math.floor(diffSec / 60);
  const secs = diffSec % 60;
  return `${mins}m ${secs}s`;
}

export function KitchenKotCardHeader({
  kot,
  nowMs,
  isRush,
  isVip,
  isUrgent,
  isWarning,
  badgeClass,
  onOpenTicket,
}: KitchenKotCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-border/60">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-extrabold text-text-primary tracking-tight">
            Table {kot.tableNumber}
          </span>

          {/* Priority Badges */}
          {isRush && (
            <span className="flex items-center gap-1 rounded bg-danger px-1.5 py-0.5 text-[10px] font-black text-white uppercase animate-bounce">
              <Flame size={10} /> RUSH
            </span>
          )}
          {isVip && (
            <span className="flex items-center gap-1 rounded bg-warning px-1.5 py-0.5 text-[10px] font-black text-black uppercase">
              <Star size={10} /> VIP
            </span>
          )}

          {/* Context Menu */}
          <div className="relative group/menu">
            <button
              title="More Options"
              aria-label={`More options for KOT ${kot.kotId}`}
              className="rounded p-1 text-text-disabled hover:bg-surface hover:text-text-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden w-32 flex-col rounded-md border border-border bg-card p-1 shadow-lg group-hover/menu:flex z-30">
              <button className="rounded px-2 py-1.5 text-left text-[11px] font-medium text-text-primary hover:bg-surface">
                View Details
              </button>
              <button className="rounded px-2 py-1.5 text-left text-[11px] font-medium text-text-primary hover:bg-surface">
                Reassign Station
              </button>
            </div>
          </div>
        </div>
        <span className="text-[11px] font-medium uppercase tracking-widest text-text-secondary">
          KOT: {kot.kotId}
        </span>
      </div>

      <div className="flex flex-col items-end gap-1">
        {/* Station badge */}
        <span
          className={[
            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            badgeClass,
          ].join(" ")}
        >
          {kot.station}
        </span>

        {/* Elapsed time */}
        <span
          className={[
            "flex items-center gap-1 text-[11px] font-semibold tabular-nums",
            isUrgent
              ? "text-danger font-extrabold"
              : isWarning
              ? "text-warning font-bold"
              : "text-text-secondary",
          ].join(" ")}
        >
          <Clock size={11} />
          {getElapsedLabel(kot.timestamp, nowMs)}
        </span>
      </div>
    </div>
  );
}
