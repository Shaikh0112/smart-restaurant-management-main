// RESPONSIBILITY: Composer hook that aggregates all KDS hooks for the orchestrator.
// Note: Local storage manipulation has been removed. Data now flows via React Query.

import { useKitchenKotQuery } from "./useKitchenKotQuery";
import { useKitchenKotMutations } from "./useKitchenKotMutations";
import { useKitchenVoidMutations } from "./useKitchenVoidMutations";
import { useKitchenAudio } from "./useKitchenAudio";
import { useKitchenMetrics } from "./useKitchenMetrics";
import { useCallback } from "react";
import type { KitchenStationTab, KitchenFlatKot } from "@/app/kitchen/kitchen_types/KitchenTypes";
import type { AppNotification } from "@/types/appTypes";

export function useKitchenKds(activeTab: KitchenStationTab) {
  // Query for data
  const { allFlatKots, filteredKots, completedKots, isActiveLoading, isCompletedLoading } = useKitchenKotQuery(activeTab);
  
  // Calculate metrics
  const metrics = useKitchenMetrics(allFlatKots, []); // pass menu items later if needed

  // Handle audio side-effects
  useKitchenAudio(allFlatKots);

  // Mutations
  const { updateKotItemStatus, batchUpdateKotStatus, recallCompletedKot, setItemPrepTime, savingKey } = useKitchenKotMutations();
  const { handleVoidDecision } = useKitchenVoidMutations();

  // Temporary stub for broadcast pickup (we'll move this to real-time WS/API later)
  const broadcastPickupNotification = useCallback((kot: KitchenFlatKot) => {
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      role: "WAITER",
      title: `Table ${kot.tableNumber} Order Ready!`,
      message: `${kot.station} station has finished preparing items for Table ${kot.tableNumber}. Ready for pickup!`,
      type: "PICKUP_READY",
      tableNumber: kot.tableNumber,
      createdAt: Date.now(),
      isRead: false,
    };
    // Send to backend (Stub)
    console.log("Broadcasted notification:", notif);
  }, []);

  return {
    allFlatKots,
    filteredKots,
    completedKots,
    metrics,
    savingKey,
    updateKotItemStatus,
    batchUpdateKotStatus,
    handleVoidDecision,
    broadcastPickupNotification,
    recallCompletedKot,
    setItemPrepTime,
    isActiveLoading,
    isCompletedLoading
  };
}
