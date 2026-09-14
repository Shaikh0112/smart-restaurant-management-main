// RESPONSIBILITY: useCashierKeyboardShortcuts module logic and UI.
// DATA FLOW: Local component state -> External API
import { useEffect } from "react";

export function useCashierKeyboardShortcuts({
  onSearchFocus,
  onManagerPinOpen,
  onProceedToPayment,
  onCashCalcOpen,
}: {
  onSearchFocus: () => void;
  onManagerPinOpen: () => void;
  onProceedToPayment: () => void;
  onCashCalcOpen: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "F2") {
        e.preventDefault();
        onSearchFocus();
      } else if (e.key === "F4") {
        e.preventDefault();
        onManagerPinOpen();
      } else if (e.key === "F8") {
        e.preventDefault();
        onProceedToPayment();
      } else if (e.key === "F9") {
        e.preventDefault();
        onCashCalcOpen();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSearchFocus, onManagerPinOpen, onProceedToPayment, onCashCalcOpen]);
}
