// RESPONSIBILITY: Single source of truth for all TypeScript types used in the
// AdminReports module. No logic, no imports, no JSX -------- pure type definitions only.
// DATA FLOW: AdminReportsTypes.ts -------- useAdminReports.ts + all AdminReports components

// ------------------------ Period Union (Rule 35: No inline string literals) ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export type AdminReportsPeriod = "TODAY" | "WEEK" | "MONTH" | "ALL" | "CUSTOM";

// ------------------------ Data Interfaces --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface AdminReportsTopItem {
  itemId: string;
  name: string;
  category: string;
  totalQty: number;
  totalRevenue: number;
}

export interface AdminReportsSummary {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  topPaymentMethod: string;
  periodLabel: string;
  advanceBookingCount: number;
  advanceBookingRevenue: number;
}

export interface AdminReportsDailyStat {
  date: string;   // formatted display string e.g. "25 Jul"
  revenue: number;
}

// ------------------------ Hook Return Interface --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface UseAdminReportsReturn {
  summary: AdminReportsSummary;
  topItems: AdminReportsTopItem[];
  dailyRevenue: AdminReportsDailyStat[];
  period: AdminReportsPeriod;
  customDate: string;
  setPeriod: (period: AdminReportsPeriod) => void;
  setCustomDate: (date: string) => void;
  exportCsv: () => void;
}

// ------------------------ Component Prop Interfaces ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export interface AdminReportsSummaryCardsProps {
  summary: AdminReportsSummary;
}

export interface AdminReportsRevenueChartProps {
  dailyRevenue: AdminReportsDailyStat[];
}

export interface AdminReportsTopItemsTableProps {
  topItems: AdminReportsTopItem[];
}
