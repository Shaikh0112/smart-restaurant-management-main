// RESPONSIBILITY: useCashierReportsTopItems module logic and UI.
// DATA FLOW: Local component state -> External API
// @ts-nocheck
"use client";

import { useMemo } from "react";
import type { AppOrder, AppMenuItem, AppSalesRecord } from "@/types/appTypes";
import type { CashierReportsTopItem } from "@/app/cashier/reports/cashier_reports_types/CashierReportsTypes";

const TOP_ITEMS_LIMIT = 10 as const;

export function calcTopItems(
  orders: AppOrder[],
  menu: AppMenuItem[],
  records: AppSalesRecord[]
): CashierReportsTopItem[] {
  const scopedOrderIds = new Set(records.map((r) => r.orderId));
  const menuMap = new Map(menu.map((m) => [m.id, m]));

  const aggregated = new Map<string, CashierReportsTopItem>();

  orders
    .filter((o) => scopedOrderIds.has(o.id))
    .forEach((order) => {
      order.kots.forEach((kot) => {
        kot.items.forEach((kotItem) => {
          const menuItem = menuMap.get(kotItem.itemId);
          if (!menuItem) return;

          const existing = aggregated.get(kotItem.itemId);
          const revenue  = menuItem.price * kotItem.qty;

          if (existing) {
            existing.totalQty     += kotItem.qty;
            existing.totalRevenue += revenue;
          } else {
            aggregated.set(kotItem.itemId, {
              itemId:       kotItem.itemId,
              name:         menuItem.name,
              category:     menuItem.category,
              totalQty:     kotItem.qty,
              totalRevenue: revenue,
            });
          }
        });
      });
    });

  return Array.from(aggregated.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, TOP_ITEMS_LIMIT);
}

export function useCashierReportsTopItems(
  orders: AppOrder[],
  menu: AppMenuItem[],
  filteredRecords: AppSalesRecord[]
) {
  return useMemo(
    () => calcTopItems(orders, menu, filteredRecords),
    [orders, menu, filteredRecords]
  );
}
