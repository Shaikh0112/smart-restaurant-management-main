// RESPONSIBILITY: useGuestSplit module logic and UI.
// DATA FLOW: Local component state -> External API
import { useState, useMemo } from 'react';
import type { CashierCartItem, CashierTaxBreakdown } from '../cashier_types/CashierTypes';

export function useGuestSplit(cartItems: CashierCartItem[], taxBreakdown: CashierTaxBreakdown) {
  const [splitMode, setSplitMode] = useState<"EQUAL" | "ITEMIZED">("EQUAL");
  const [guestCount, setGuestCount] = useState<number>(2);
  const [paidGuests, setPaidGuests] = useState<Record<number, boolean>>({});

  const equalPerGuest = useMemo(() => {
    return Math.round(taxBreakdown.totalAmount / guestCount);
  }, [taxBreakdown.totalAmount, guestCount]);

  const toggleGuestPaid = (idx: number) => {
    setPaidGuests((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const isFullyPaid = useMemo(() => {
    if (splitMode === "EQUAL") {
      return Array.from({ length: guestCount }).every((_, idx) => paidGuests[idx]);
    }
    return false; // For itemized, simplified
  }, [splitMode, guestCount, paidGuests]);

  return {
    splitMode,
    setSplitMode,
    guestCount,
    setGuestCount,
    paidGuests,
    toggleGuestPaid,
    equalPerGuest,
    isFullyPaid
  };
}
