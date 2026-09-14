// RESPONSIBILITY: useCashierReportsDailyRevenue module logic and UI.
// DATA FLOW: Local component state -> External API
// @ts-nocheck
"use client";

import { useMemo } from "react";
import { formatDate } from "@/lib/formatters";
import type { AppSalesRecord } from "@/types/appTypes";
import type { CashierReportsDailyStat } from "@/app/cashier/reports/cashier_reports_types/CashierReportsTypes";
import { getLocalMidnight, MS_PER_DAY } from "./cashier_reports_date_utils";

const DAYS_FOR_CHART = 30 as const;

export function calcDailyRevenue(records: AppSalesRecord[], days: number): CashierReportsDailyStat[] {
  const midnightToday = getLocalMidnight();

  return Array.from({ length: days }, (_, i) => {
    const dayIndex = days - 1 - i;
    const dayStart = midnightToday - (dayIndex * MS_PER_DAY);
    const dayEnd = dayStart + MS_PER_DAY;

    const revenue = records
      .filter((r) => r.timestamp >= dayStart && r.timestamp < dayEnd)
      .reduce((sum, r) => sum + r.totalAmount, 0);

    return {
      date:    formatDate(dayStart),
      revenue,
    };
  });
}

export function useCashierReportsDailyRevenue(salesHistory: AppSalesRecord[]) {
  return useMemo(
    () => calcDailyRevenue(salesHistory, DAYS_FOR_CHART),
    [salesHistory]
  );
}
