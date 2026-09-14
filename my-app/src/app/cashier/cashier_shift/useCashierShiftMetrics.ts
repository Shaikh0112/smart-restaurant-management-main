// RESPONSIBILITY: useCashierShiftMetrics module logic and UI.
// DATA FLOW: Local component state -> External API
import { useQuery } from "@tanstack/react-query";
import type { CashierShiftMetrics } from "@/app/cashier/cashier_types/CashierTypes";
import { cashierApi } from "../cashier_api/cashier_api";

const initialMetrics: CashierShiftMetrics = {
  openingFloat: 0,
  cashCollected: 0,
  upiCollected: 0,
  cardCollected: 0,
  discountGiven: 0,
  totalNetSales: 0,
  totalBillsPaid: 0,
};

export function useCashierShiftMetrics() {
  const { data: shiftMetrics = initialMetrics, isLoading } = useQuery({
    queryKey: ['cashier', 'shift', 'metrics'],
    queryFn: async () => {
      const res = await cashierApi.fetchCashierShiftMetrics();
      if (res.success && res.data) {
        return res.data as CashierShiftMetrics;
      }
      return initialMetrics;
    },
    initialData: {
      openingFloat: 2000,
      cashCollected: 4850,
      upiCollected: 6200,
      cardCollected: 3100,
      discountGiven: 450,
      totalNetSales: 14150,
      totalBillsPaid: 18,
    }
  });

  return { shiftMetrics, isLoading };
}
