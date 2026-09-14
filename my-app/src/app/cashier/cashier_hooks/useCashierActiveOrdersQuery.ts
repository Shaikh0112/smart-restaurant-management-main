// RESPONSIBILITY: Fetches and caches cashier orders from the API.
// DATA FLOW: API -> React Query Cache -> UI

import { useQuery } from "@tanstack/react-query";
import { cashierApi } from "@/app/cashier/cashier_api/cashier_api";

export function useCashierActiveOrdersQuery() {
  return useQuery({
    queryKey: ['cashier', 'orders'],
    queryFn: async () => {
      const res = await cashierApi.fetchCashierOrders();
      return res.data || [];
    },
    initialData: [],
  });
}
