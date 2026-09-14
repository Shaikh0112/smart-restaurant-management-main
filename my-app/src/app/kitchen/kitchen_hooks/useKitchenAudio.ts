// RESPONSIBILITY: Observes changes in KOT arrays and plays context-aware audio alerts.
// DATA FLOW: KOT Array Data -> Audio Hook -> Browser Audio API

import { useEffect, useRef } from "react";
import { playKitchenBell, playVoidAlert } from "@/lib/audioHelper";
import type { KitchenFlatKot } from "@/app/kitchen/kitchen_types/KitchenTypes";

function hasNewVoidRequest(prev: KitchenFlatKot[], next: KitchenFlatKot[]): boolean {
  const prevVoidSet = new Set<string>();
  for (const kot of prev) {
    for (const item of kot.items) {
      if (item.status === "VOID_REQUESTED") {
        prevVoidSet.add(`${kot.kotId}-${item.itemId}`);
      }
    }
  }
  for (const kot of next) {
    for (const item of kot.items) {
      if (
        item.status === "VOID_REQUESTED" &&
        !prevVoidSet.has(`${kot.kotId}-${item.itemId}`)
      ) {
        return true;
      }
    }
  }
  return false;
}

export function useKitchenAudio(allFlatKots: KitchenFlatKot[]) {
  const prevKotCountRef = useRef<number>(-1);
  const prevFlatKotsRef = useRef<KitchenFlatKot[]>([]);

  useEffect(() => {
    const currentCount = allFlatKots.length;

    // Initial mount skip
    if (prevKotCountRef.current === -1) {
      prevKotCountRef.current = currentCount;
      prevFlatKotsRef.current = allFlatKots;
      return;
    }

    // Play Bell if new KOT arrived
    if (currentCount > prevKotCountRef.current) {
      playKitchenBell();
    }

    // Play Void Alert if new void requested
    if (hasNewVoidRequest(prevFlatKotsRef.current, allFlatKots)) {
      playVoidAlert();
    }

    prevKotCountRef.current = currentCount;
    prevFlatKotsRef.current = allFlatKots;
  }, [allFlatKots]);
}
