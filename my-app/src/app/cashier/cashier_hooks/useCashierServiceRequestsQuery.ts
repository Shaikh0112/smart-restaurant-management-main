// RESPONSIBILITY: Fetches and caches cashier service requests from the API.
// DATA FLOW: API -> React Query Cache -> UI

import { useQuery } from "@tanstack/react-query";
import { cashierApi } from "@/app/cashier/cashier_api/cashier_api";

export function useCashierServiceRequestsQuery() {
  return useQuery({
    queryKey: ['cashier', 'serviceRequests'],
    queryFn: async () => {
      const res = await cashierApi.fetchCashierServiceRequests();
      return res.data || [];
    },
    initialData: [],
  });
}
