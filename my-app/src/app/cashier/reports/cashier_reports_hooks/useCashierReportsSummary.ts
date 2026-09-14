// RESPONSIBILITY: useCashierReportsSummary module logic and UI.
// DATA FLOW: Local component state -> External API
// @ts-nocheck
"use client";

import { useMemo } from "react";
import type { AppSalesRecord, PaymentMethod, AppAdvanceReservation } from "@/types/appTypes";
import type {
  CashierReportsPeriod,
  CashierReportsSummary,
} from "@/app/cashier/reports/cashier_reports_types/CashierReportsTypes";
import { getLocalMidnight, getStartOfDayFromLocalString, MS_PER_DAY } from "./cashier_reports_date_utils";

const PERIOD_LABELS: Record<CashierReportsPeriod, string> = {
  TODAY:  "Today",
  WEEK:   "This Week",
  MONTH:  "This Month",
  ALL:    "All Time",
  CUSTOM: "Custom Date",
} as const;

export function getPeriodStart(period: CashierReportsPeriod): number {
  const midnightToday = getLocalMidnight();

  if (period === "TODAY") return midnightToday;
  if (period === "WEEK")  return midnightToday - (6 * MS_PER_DAY);
  if (period === "MONTH") return midnightToday - (29 * MS_PER_DAY);
  return 0; // ALL
}

export function filterByPeriod<T extends { timestamp?: number; createdAt?: number }>(
  records: T[], 
  period: CashierReportsPeriod, 
  customDate: string
): T[] {
  if (period === "CUSTOM" && customDate) {
    const targetStart = getStartOfDayFromLocalString(customDate);
    const targetEnd   = targetStart + (MS_PER_DAY * 5); // 5-day window
    return records.filter((r) => {
      const time = r.timestamp || r.createdAt || 0;
      return time >= targetStart && time < targetEnd;
    });
  }
  const start = getPeriodStart(period);
  return records.filter((r) => {
    const time = r.timestamp || r.createdAt || 0;
    return time >= start;
  });
}

function getTopPaymentMethod(records: AppSalesRecord[]): string {
  if (records.length === 0) return "N/A";

  const totals: Record<PaymentMethod, number> = { CASH: 0, UPI: 0, CARD: 0, SPLIT: 0 };
  records.forEach((r) => {
    totals[r.paymentMethod] += r.totalAmount;
  });

  const top = (Object.entries(totals) as [PaymentMethod, number][]).reduce(
    (best, curr) => (curr[1] > best[1] ? curr : best)
  );

  return top[0];
}

export function calcSummary(
  records: AppSalesRecord[], 
  advanceRecords: AppAdvanceReservation[], 
  period: CashierReportsPeriod, 
  customDate: string
): CashierReportsSummary {
  const advanceBookingCount = advanceRecords.filter(r => r.paymentStatus === "PAID").length;
  const advanceBookingRevenue = advanceRecords
    .filter(r => r.paymentStatus === "PAID")
    .reduce((sum, r) => sum + r.totalAdvanceDeposit, 0);

  const totalRevenue   = records.reduce((sum, r) => sum + r.totalAmount, 0) + advanceBookingRevenue;
  const totalOrders    = records.length;
  const avgOrderValue  = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const topPaymentMethod = getTopPaymentMethod(records);
  
  let periodLabel = PERIOD_LABELS[period];
  if (period === "CUSTOM" && customDate) {
    const targetStart = getStartOfDayFromLocalString(customDate);
    const endDate = new Date(targetStart + MS_PER_DAY * 4).toISOString().split("T")[0];
    periodLabel = `Dates: ${customDate} to ${endDate}`;
  }

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    topPaymentMethod,
    periodLabel,
    advanceBookingCount,
    advanceBookingRevenue,
  };
}

export function useCashierReportsSummary(
  filteredRecords: AppSalesRecord[],
  filteredAdvance: AppAdvanceReservation[],
  period: CashierReportsPeriod,
  customDate: string
) {
  return useMemo(
    () => calcSummary(filteredRecords, filteredAdvance, period, customDate),
    [filteredRecords, filteredAdvance, period, customDate]
  );
}
