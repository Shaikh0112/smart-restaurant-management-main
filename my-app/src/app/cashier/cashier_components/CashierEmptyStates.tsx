// RESPONSIBILITY: Beautiful empty state components for the Cashier POS to ensure UX compliance.

import { UtensilsCrossed, BarChart3, ShieldCheck } from "lucide-react";

export function TableEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-text-secondary rounded-2xl border border-dashed border-border bg-card shadow-sm">
      <div className="rounded-full bg-primary/10 p-4">
        <UtensilsCrossed size={32} strokeWidth={1.5} className="text-primary" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-text-primary">No Active Tables</h3>
        <p className="text-xs mt-1 max-w-[200px]">There are currently no tables awaiting billing. Relax for a moment!</p>
      </div>
    </div>
  );
}

export function ReportsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-text-secondary rounded-2xl border border-dashed border-border bg-card shadow-sm">
      <div className="rounded-full bg-blue-500/10 p-4">
        <BarChart3 size={32} strokeWidth={1.5} className="text-blue-500" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-text-primary">No Data Available</h3>
        <p className="text-xs mt-1 max-w-[200px]">Shift metrics and reports will appear here once transactions are processed.</p>
      </div>
    </div>
  );
}

export function ApprovalEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-text-secondary rounded-2xl border border-dashed border-border bg-card shadow-sm">
      <div className="rounded-full bg-emerald-500/10 p-4">
        <ShieldCheck size={32} strokeWidth={1.5} className="text-emerald-500" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-text-primary">All Caught Up</h3>
        <p className="text-xs mt-1 max-w-[200px]">There are no pending voids or discounts requiring manager approval.</p>
      </div>
    </div>
  );
}
