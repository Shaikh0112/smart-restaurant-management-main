// RESPONSIBILITY: Fetches and filters active and completed KOTs from the backend.
// Replaces the old localStorage direct access architecture.
// DATA FLOW: API -> React Query -> KDS UI

import { useQuery } from "@tanstack/react-query";
import { kitchenApiClient } from "@/app/kitchen/kitchen_api/kitchen_api_client";
import type { KitchenFlatKot, KitchenCompletedKot, KitchenStationTab } from "@/app/kitchen/kitchen_types/KitchenTypes";
import { useMemo } from "react";

export function useKitchenKotQuery(activeTab: KitchenStationTab) {
  // Query for Active KOTs
  const { data: activeKotsResponse, isLoading: isActiveLoading } = useQuery({
    queryKey: ['kitchen', 'activeKots'],
    queryFn: () => kitchenApiClient<KitchenFlatKot[]>('/api/kitchen/kots/active'),
    refetchInterval: 5000, // Polling for real-time KDS simulation (WebSockets preferred in future)
  });

  // Query for Completed KOTs
  const { data: completedKotsResponse, isLoading: isCompletedLoading } = useQuery({
    queryKey: ['kitchen', 'completedKots'],
    queryFn: () => kitchenApiClient<KitchenCompletedKot[]>('/api/kitchen/kots/completed'),
  });

  const allFlatKots = activeKotsResponse?.data || [];
  const completedKots = completedKotsResponse?.data || [];

  const filteredKots = useMemo(() => {
    if (activeTab === "All") return allFlatKots;
    return allFlatKots.filter((k) => k.station === activeTab);
  }, [allFlatKots, activeTab]);

  return {
    allFlatKots,
    filteredKots,
    completedKots,
    isActiveLoading,
    isCompletedLoading,
  };
}
