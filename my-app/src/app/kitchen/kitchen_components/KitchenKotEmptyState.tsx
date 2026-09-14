// RESPONSIBILITY: Renders the empty state for the KOT Grid when there are no active orders.

import { UtensilsCrossed } from "lucide-react";

export function KitchenKotEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-text-secondary">
      <UtensilsCrossed size={40} strokeWidth={1.5} />
      <p className="text-sm font-medium">No active KOTs for this station</p>
    </div>
  );
}
