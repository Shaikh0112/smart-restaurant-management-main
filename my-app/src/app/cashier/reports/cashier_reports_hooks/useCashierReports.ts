// @ts-nocheck
"use client";

// RESPONSIBILITY: All data-fetching and calculation logic for the CashierReports page.
// Reads SALES_HISTORY, ORDERS, MENU from localStorage via useLocalStorage.
// Derives summary KPIs, top-selling items, daily revenue trend, and CSV export.
// No JSX — pure logic hook consumed by cashier_reports/page.tsx.
// DATA FLOW: localStorage → useLocalStorage → calc functions → UseCashierReportsReturn
//            → CashierReportsSummaryCards + CashierReportsRevenueChart + CashierReportsTopItemsTable → UI

import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import type { AppSalesRecord, AppOrder, AppMenuItem, AppAdvanceReservation } from "@/types/appTypes";
import type {
  CashierReportsPeriod,
  UseCashierReportsReturn,
} from "@/app/cashier/reports/cashier_reports_types/CashierReportsTypes";

import { filterByPeriod, useCashierReportsSummary } from "./useCashierReportsSummary";
import { useCashierReportsTopItems } from "./useCashierReportsTopItems";
import { useCashierReportsDailyRevenue } from "./useCashierReportsDailyRevenue";
import { buildAndDownloadCsv } from "@/app/cashier/cashier_utils/cashier_csv_exporter";
import { getLocalIsoDateString } from "./cashier_reports_date_utils";

export function useCashierReports(): UseCashierReportsReturn {
  const [period, setPeriod] = useState<CashierReportsPeriod>("MONTH");
  const [customDate, setCustomDate] = useState<string>(getLocalIsoDateString());

  // Rule 61: No direct localStorage — hooks only
  const [salesHistory] = useLocalStorage<AppSalesRecord[]>(STORAGE_KEYS.SALES_HISTORY, []);
  const [orders]       = useLocalStorage<AppOrder[]>      (STORAGE_KEYS.ORDERS,        []);
  const [menu]         = useLocalStorage<AppMenuItem[]>   (STORAGE_KEYS.MENU,          []);
  const [advanceReservations] = useLocalStorage<AppAdvanceReservation[]>(STORAGE_KEYS.ADVANCE_RESERVATIONS, []);

  // Deps: salesHistory + period + customDate — refilter when any changes
  const filteredRecords = useMemo(
    () => filterByPeriod(salesHistory, period, customDate) as AppSalesRecord[],
    [salesHistory, period, customDate]
  );

  // Read directly because active_tenant_id is stored as a raw string, not a JSON string!
  const activeTenantId = typeof window !== "undefined" ? window.localStorage.getItem("active_tenant_id") : null;

  const filteredAdvance = useMemo(
    () => {
      const filteredByPeriod = filterByPeriod(advanceReservations, period, customDate) as AppAdvanceReservation[];
      return filteredByPeriod.filter(r => r.tenantId === activeTenantId);
    },
    [advanceReservations, period, customDate, activeTenantId]
  );

  const summary = useCashierReportsSummary(filteredRecords, filteredAdvance, period, customDate);
  const topItems = useCashierReportsTopItems(orders, menu, filteredRecords);
  const dailyRevenue = useCashierReportsDailyRevenue(salesHistory);

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

