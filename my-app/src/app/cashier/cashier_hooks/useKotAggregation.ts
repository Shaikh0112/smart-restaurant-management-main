// RESPONSIBILITY: useKotAggregation module logic and UI.
// DATA FLOW: Local component state -> External API
// @ts-nocheck
"use client";

import { useMemo } from "react";
import type { AppOrder, AppMenuItem } from "@/types/appTypes";
import type { CashierCartItem, CashierSelectedTable } from "@/app/cashier/cashier_types/CashierTypes";

const KOT_ITEM_VOIDED = "VOIDED" as const;

export function aggregateKots(order: AppOrder, menu: AppMenuItem[]): CashierCartItem[] {
  const menuMap = new Map(menu.map((m) => [m.id, m]));
  const mergeMap = new Map<string, CashierCartItem>();

  for (const kot of order.kots) {
    for (const item of kot.items) {
      if (item.status === KOT_ITEM_VOIDED) continue;

      const menuItem  = menuMap.get(item.itemId);
      const name      = menuItem?.name      ?? item.itemId;
      const unitPrice = menuItem?.price     ?? 0;
      const station   = menuItem?.station   ?? "Kitchen";
      const notes     = item.notes          ?? "";
      const mergeKey  = `${item.itemId}||${notes}`;

      const existing = mergeMap.get(mergeKey);
      if (existing) {
        existing.qty        += item.qty;
        existing.totalPrice  = existing.qty * existing.unitPrice;
      } else {
        mergeMap.set(mergeKey, {
          itemId:     item.itemId,
          name,
          qty:        item.qty,
          unitPrice,
          totalPrice: item.qty * unitPrice,
          station,
          notes,
        });
      }
    }
  }

  return Array.from(mergeMap.values());
}

export function useKotAggregation(
  selectedTableId: string,
  cashierTables: CashierSelectedTable[],
  menuItems: AppMenuItem[]
) {
  return useMemo((): CashierCartItem[] => {
    if (!selectedTableId) return [];
    const selected = cashierTables.find((bt) => bt.table.id === selectedTableId);
    if (!selected) return [];
    return aggregateKots(selected.order, menuItems);
  }, [selectedTableId, cashierTables, menuItems]);
}
