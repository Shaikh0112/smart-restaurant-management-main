// @ts-nocheck
﻿// RESPONSIBILITY: Single source of truth for all TypeScript types used in the
// ManagerReports module. No logic, no imports, no JSX â€” pure type definitions only.
// DATA FLOW: ManagerReportsTypes.ts â†’ useManagerReports.ts + all ManagerReports components

// â”€â”€â”€ Period Union (Rule 35: No inline string literals) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type ManagerReportsPeriod = "TODAY" | "WEEK" | "MONTH" | "ALL" | "CUSTOM";

// â”€â”€â”€ Data Interfaces â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface ManagerReportsTopItem {
  itemId: string;
  name: string;
  category: string;
  totalQty: number;
  totalRevenue: number;
}

export interface ManagerReportsSummary {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  topPaymentMethod: string;
  periodLabel: string;
  advanceBookingCount: number;
  advanceBookingRevenue: number;
}

export interface ManagerReportsDailyStat {
  date: string;   // formatted display string e.g. "25 Jul"
  revenue: number;
}

// â”€â”€â”€ Hook Return Interface â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface UseOwnerReportsReturn {
  summary: ManagerReportsSummary;
  topItems: ManagerReportsTopItem[];
  dailyRevenue: ManagerReportsDailyStat[];
  period: ManagerReportsPeriod;
  customDate: string;
  setPeriod: (period: ManagerReportsPeriod) => void;
  setCustomDate: (date: string) => void;
  exportCsv: () => void;
}

// â”€â”€â”€ Component Prop Interfaces â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface ManagerReportsSummaryCardsProps {
  summary: ManagerReportsSummary;
}

export interface ManagerReportsRevenueChartProps {
  dailyRevenue: ManagerReportsDailyStat[];
}

export interface ManagerReportsTopItemsTableProps {
  topItems: ManagerReportsTopItem[];
}
