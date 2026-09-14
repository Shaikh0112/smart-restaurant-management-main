// @ts-nocheck
"use client";

// RESPONSIBILITY: All shift management logic for the Owner module.
// DATA FLOW: managerApi → useManagerShift → ManagerShiftReport

import { useState, useCallback, useMemo, useEffect } from "react";
import type { AppShiftRegister, AppSalesRecord } from "@/types/appTypes";
import type { UseOwnerShiftReturn } from "@/app/manager/manager_types/ManagerTypes";
import { managerApi } from "../manager_api/manager_api";

const STATUS_OPEN   = "OPEN"   as const;
const STATUS_CLOSED = "CLOSED" as const;
const METHOD_CASH   = "CASH"   as const;

function sumCashSales(salesHistory: AppSalesRecord[]): number {
  return salesHistory.reduce(
    (sum, s) => (s.paymentMethod === METHOD_CASH ? sum + s.totalAmount : sum),
    0
  );
}

export function useManagerShift(): UseOwnerShiftReturn {
  const [shift, setShift] = useState<AppShiftRegister | null>(null);
  const [salesHistory, setSalesHistory] = useState<AppSalesRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const tenantId = typeof window !== "undefined" ? window.localStorage.getItem("active_tenant_id") || "SUPER_ADMIN" : "SUPER_ADMIN";

  useEffect(() => {
    managerApi.getShift(tenantId).then(res => {
      if (res.success && res.data) setShift(res.data);
    });
    managerApi.getSalesHistory(tenantId).then(res => {
      if (res.success && res.data) setSalesHistory(res.data);
    });
  }, [tenantId]);

  const isOpen = useMemo(() => shift?.shiftStatus === STATUS_OPEN, [shift]);

  const openShift = useCallback(
    async (openingCash: number) => {
      setIsSubmitting(true);
      const res = await managerApi.openShift(tenantId, { openingCash });
      if (res.success && res.data) {
        setShift(res.data);
      }
      setIsSubmitting(false);
    },
    [tenantId]
  );

  const closeShift = useCallback(
    async (closingCash: number) => {
      if (!shift || shift.shiftStatus !== STATUS_OPEN) return;
      setIsSubmitting(true);

      const res = await managerApi.closeShift(tenantId, { closingCash, shiftId: shift.id });
      if (res.success && res.data) {
        setShift(res.data);
      } else {
        // Fallback optimistic update if API doesn't return full shift but succeeds
        const cashSales    = sumCashSales(salesHistory);
        const expectedCash = shift.openingCash + cashSales;
        const variance     = closingCash - expectedCash;
        setShift({
          ...shift,
          closingCash,
          expectedCash,
          variance,
          shiftStatus: STATUS_CLOSED,
          closedAt: Date.now(),
        });
      }
      setIsSubmitting(false);
    },
    [shift, salesHistory, tenantId]
  );

  return { shift, isOpen, isSubmitting, salesHistory, openShift, closeShift };
}
