// RESPONSIBILITY: useOrderAggregation module logic and UI.
// DATA FLOW: Local component state -> External API
// @ts-nocheck
"use client";

import { useMemo } from "react";
import type { AppOrder, AppTable, AppServiceRequest } from "@/types/appTypes";
import type { CashierSelectedTable } from "@/app/cashier/cashier_types/CashierTypes";

const STATUS_BILLING_PENDING = "BILLING_PENDING" as const;
const STATUS_OCCUPIED        = "OCCUPIED"        as const;
const STATUS_ACTIVE          = "ACTIVE"          as const;

export function useOrderAggregation(
  tables: AppTable[],
  orders: AppOrder[],
  serviceRequests: AppServiceRequest[]
) {
  return useMemo((): CashierSelectedTable[] => {
    const safeLower = (s?: string) => (s || "").toLowerCase().replace(/^(tbl|t)-?/i, "");

    const billReqSet = new Set<string>();
    for (const req of serviceRequests) {
      if (req && req.type === "BILL" && (req.status === "PENDING" || req.status === "ACKNOWLEDGED")) {
        if (req.tableId) billReqSet.add(req.tableId);
        if (req.tableNumber) billReqSet.add(req.tableNumber);
        const norm = safeLower(req.tableId || req.tableNumber);
        if (norm) billReqSet.add(norm);
      }
    }

    return tables
      .filter((t) => {
        if (!t || !t.id) return false;
        const normId = safeLower(t.id);
        const normNum = safeLower(t.tableNumber);
        const hasBillReq = billReqSet.has(t.id) || (t.tableNumber && billReqSet.has(t.tableNumber)) || billReqSet.has(normId) || billReqSet.has(normNum);
        return t.status === STATUS_BILLING_PENDING || t.status === STATUS_OCCUPIED || hasBillReq;
      })
      .reduce<CashierSelectedTable[]>((acc, table) => {
        const order = orders.find(
          (o) =>
            o &&
            o.status === STATUS_ACTIVE &&
            (o.id === table.currentOrderId ||
              safeLower(o.tableNumber) === safeLower(table.tableNumber) ||
              safeLower(o.tableNumber) === safeLower(table.id))
        );
        if (order) {
          const normId = safeLower(table.id);
          const normNum = safeLower(table.tableNumber);
          const hasBillReq = billReqSet.has(table.id) || (table.tableNumber && billReqSet.has(table.tableNumber)) || billReqSet.has(normId) || billReqSet.has(normNum);

          const finalTable = hasBillReq && table.status !== STATUS_BILLING_PENDING
            ? { ...table, status: STATUS_BILLING_PENDING }
            : table;

          acc.push({ table: finalTable, order });
        }
        return acc;
      }, []);
  }, [tables, orders, serviceRequests]);
}
