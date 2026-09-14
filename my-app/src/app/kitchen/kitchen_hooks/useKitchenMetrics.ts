// RESPONSIBILITY: Calculates Kitchen SLA and KPI metrics based on real-time KOT data.
// DATA FLOW: allFlatKots -> Metrics Hook -> KPI UI

import { useMemo } from "react";
import type { KitchenFlatKot, KitchenKpiMetrics } from "@/app/kitchen/kitchen_types/KitchenTypes";
import type { AppMenuItem } from "@/types/appTypes";

const URGENT_THRESHOLD_MS = 900000; // 15 minutes in ms

export function useKitchenMetrics(allFlatKots: KitchenFlatKot[], menuItems: AppMenuItem[] = []) {
  return useMemo<KitchenKpiMetrics>(() => {
    const now = Date.now();
    let urgentCount = 0;
    let readyItemsCount = 0;

    for (const kot of allFlatKots) {
      const elapsedMs = now - kot.timestamp;
      const hasActivePrep = kot.items.some(
        (i) => i.status === "PENDING" || i.status === "COOKING"
      );
      if (elapsedMs > URGENT_THRESHOLD_MS && hasActivePrep) {
        urgentCount++;
      }
      for (const item of kot.items) {
        if (item.status === "READY") {
          readyItemsCount++;
        }
      }
    }

    const outOfStockCount = menuItems.filter((m) => !m.isAvailable).length;

    return {
      totalActiveKots: allFlatKots.length,
      urgentCount,
      avgPrepTimeMins: 12, // Could be calculated based on historical completedKots data
      readyItemsCount,
      outOfStockCount,
    };
  }, [allFlatKots, menuItems]);
}
