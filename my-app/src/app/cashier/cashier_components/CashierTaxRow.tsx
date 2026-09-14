// RESPONSIBILITY: CashierTaxRow module logic and UI.
import React from "react";
import { formatCurrency } from "@/lib/formatters";
import type { CashierTaxRowProps } from "@/app/cashier/cashier_types/CashierTypes";

export function CashierTaxRow({ label, value }: CashierTaxRowProps) {
  if (value === 0) return null;
  return (
    <div className="flex justify-between text-xs text-text-secondary">
      <span>{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}
