"use client";

// RESPONSIBILITY: All data-fetching and calculation logic for the AdminReports page.
// Reads SALES_HISTORY, ORDERS, MENU from localStorage via useLocalStorage.
// Derives summary KPIs, top-selling items, daily revenue trend, and CSV export.
// No JSX --- pure logic hook consumed by admin_reports/page.tsx.
// DATA FLOW: localStorage --- useLocalStorage --- calc functions --- UseAdminReportsReturn
//            --- AdminReportsSummaryCards + AdminReportsRevenueChart + AdminReportsTopItemsTable --- UI

import { useState, useMemo } from "react";
import { useLocalStorage, getActiveTenantId } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import type { AppSalesRecord, AppOrder, AppMenuItem, AppAdvanceReservation } from "@/types/appTypes";
import type {
  AdminReportsPeriod,
  UseAdminReportsReturn,
} from "@/app/admin/reports/admin_reports_types/AdminReportsTypes";
import {
  filterByPeriod,
  calcSummary,
  calcTopItems,
  calcDailyRevenue,
  buildAndDownloadCsv,
} from "../admin_reports_utils/adminReports.utils";

const DAYS_FOR_CHART = 30 as const;

export function useAdminReports(): UseAdminReportsReturn {
  const [period, setPeriod] = useState<AdminReportsPeriod>("MONTH");
  const [customDate, setCustomDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const [salesHistory] = useLocalStorage<AppSalesRecord[]>(STORAGE_KEYS.SALES_HISTORY, []);
  const [orders]       = useLocalStorage<AppOrder[]>      (STORAGE_KEYS.ORDERS,        []);
  const [menu]         = useLocalStorage<AppMenuItem[]>   (STORAGE_KEYS.MENU,          []);
  const [advanceReservations] = useLocalStorage<AppAdvanceReservation[]>(STORAGE_KEYS.ADVANCE_RESERVATIONS, []);

  const filteredRecords = useMemo(
    () => filterByPeriod(salesHistory, period, customDate) as AppSalesRecord[],
    [salesHistory, period, customDate]
  );

  const activeTenantId = getActiveTenantId();

  const filteredAdvance = useMemo(
    () => {
      const filteredByPeriod = filterByPeriod(advanceReservations, period, customDate) as AppAdvanceReservation[];
      return filteredByPeriod.filter(r => r.tenantId === activeTenantId);
    },
    [advanceReservations, period, customDate, activeTenantId]
  );

  const summary = useMemo(
    () => calcSummary(filteredRecords, filteredAdvance, period, customDate),
    [filteredRecords, filteredAdvance, period, customDate]
  );

  const topItems = useMemo(
    () => calcTopItems(orders, menu, filteredRecords),
    [orders, menu, filteredRecords]
  );

  const dailyRevenue = useMemo(
    () => calcDailyRevenue(salesHistory, DAYS_FOR_CHART),
    [salesHistory]
  );

  function exportCsv(): void {
    buildAndDownloadCsv(filteredRecords);
  }

  return {
    summary,
    topItems,
    dailyRevenue,
    period,
    customDate,
    setPeriod,
    setCustomDate,
    exportCsv,
  };
}
