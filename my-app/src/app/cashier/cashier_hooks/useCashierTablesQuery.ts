// RESPONSIBILITY: Fetches and caches cashier tables from the API.
// DATA FLOW: API -> React Query Cache -> UI

import { useQuery } from "@tanstack/react-query";
import { cashierApi } from "@/app/cashier/cashier_api/cashier_api";

export function useCashierTablesQuery() {
  return useQuery({
    queryKey: ['cashier', 'tables'],
    queryFn: async () => {
      const res = await cashierApi.fetchCashierTables();
      return res.data || [];
    },
    initialData: [],
  });
}
