// RESPONSIBILITY: Fetches and caches cashier menu from the API.
// DATA FLOW: API -> React Query Cache -> UI

import { useQuery } from "@tanstack/react-query";
import { cashierApi } from "@/app/cashier/cashier_api/cashier_api";

export function useCashierMenuQuery() {
  return useQuery({
    queryKey: ['cashier', 'menu'],
    queryFn: async () => {
      const res = await cashierApi.fetchCashierMenu();
      return res.data || [];
    },
    initialData: [],
  });
}
