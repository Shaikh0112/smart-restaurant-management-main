// RESPONSIBILITY: useCheckoutCrm module logic and UI.
// DATA FLOW: Local component state -> External API
import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import type { AppCrmCustomer } from "@/types/appTypes";

export function useCheckoutCrm() {
  const [, setCrmCustomers] = useLocalStorage<AppCrmCustomer[]>(STORAGE_KEYS.CRM_CUSTOMERS, []);

  const updateCrm = useCallback((
    customerPhone: string, 
    loyaltyEarned: number, 
    redeemAmount: number, 
    tableNumber: string, 
    saleId: string
  ) => {
    if (customerPhone && customerPhone.length >= 10) {
      setCrmCustomers((prev) => {
        const existing = prev.find((c) => c.phone === customerPhone);
        if (existing) {
          return prev.map((c) => {
            if (c.phone !== customerPhone) return c;
            return {
              ...c,
              loyaltyPoints: c.loyaltyPoints + loyaltyEarned - redeemAmount,
              totalVisits: c.totalVisits + 1,
              history: [...c.history, saleId],
            };
          });
        }
        const newCust: AppCrmCustomer = {
          phone: customerPhone,
          name: `Guest (Table ${tableNumber})`,
          loyaltyPoints: loyaltyEarned,
          totalVisits: 1,
          history: [saleId],
        };
        return [...prev, newCust];
      });
    }
  }, [setCrmCustomers]);

  return { updateCrm };
}
