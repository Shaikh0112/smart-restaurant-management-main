// RESPONSIBILITY: CashierReceiptItemRow module logic and UI.
import React from "react";
import { formatCurrency } from "@/lib/formatters";
import type { CashierReceiptItemRowProps } from "@/app/cashier/cashier_types/CashierTypes";

export function CashierReceiptItemRow({ name, qty, totalPrice }: CashierReceiptItemRowProps) {
  return (
    <div className="flex justify-between text-xs">
      <span className="flex-1 pr-2 text-text-primary">
        {name} <span className="text-text-secondary">Ã—{qty}</span>
      </span>
      <span className="text-text-primary">{formatCurrency(totalPrice)}</span>
    </div>
  );
}
