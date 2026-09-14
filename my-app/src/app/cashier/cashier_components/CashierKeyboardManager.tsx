// RESPONSIBILITY: Headless component that binds global keyboard shortcuts for the Cashier POS.
// DATA FLOW: Props -> useCashierKeyboardShortcuts

"use client";

import { useCashierKeyboardShortcuts } from "@/app/cashier/cashier_hooks/useCashierKeyboardShortcuts";

export function CashierKeyboardManager({
  onManagerPinOpen,
  onProceedToPayment,
  onCashCalcOpen,
}: {
  onManagerPinOpen: () => void;
  onProceedToPayment: () => void;
  onCashCalcOpen: () => void;
}) {
  useCashierKeyboardShortcuts({
    onSearchFocus: () => {
      const searchInput = document.getElementById("table-search-input");
      if (searchInput) searchInput.focus();
    },
    onManagerPinOpen,
    onProceedToPayment,
    onCashCalcOpen,
  });

  return null;
}
