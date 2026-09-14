// RESPONSIBILITY: Utility or types for adminReports.utils.ts.
// DATA FLOW: N/A

import { formatDate } from "@/lib/formatters";
import type { AppSalesRecord, AppOrder, AppMenuItem, PaymentMethod, AppAdvanceReservation } from "@/types/appTypes";
import type {
  AdminReportsPeriod,
  AdminReportsSummary,
  AdminReportsTopItem,
  AdminReportsDailyStat,
} from "@/app/admin/reports/admin_reports_types/AdminReportsTypes";

const MS_PER_DAY      = 86_400_000 as const;
const TOP_ITEMS_LIMIT = 10         as const;

const PERIOD_LABELS: Record<AdminReportsPeriod, string> = {
  TODAY:  "Today",
  WEEK:   "This Week",
  MONTH:  "This Month",
  ALL:    "All Time",
  CUSTOM: "Custom Date",
} as const;

const CSV_HEADERS = "Date,Table,Payment Method,Subtotal,CGST,SGST,Service Charge,VAT,Discount,Total\n" as const;

export function getPeriodStart(period: AdminReportsPeriod): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (period === "TODAY") return now.getTime();

  if (period === "WEEK") {
    const d = new Date(now);
    d.setDate(d.getDate() - 6);
    return d.getTime();
  }

  if (period === "MONTH") {
    const d = new Date(now);
    d.setDate(d.getDate() - 29);
    return d.getTime();
  }

  return 0; // ALL
}

export function filterByPeriod<T extends { timestamp?: number; createdAt?: number }>(records: T[], period: AdminReportsPeriod, customDate: string): T[] {
  if (period === "CUSTOM" && customDate) {
    const targetStart = new Date(`${customDate}T00:00:00`).getTime();
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

export function getTopPaymentMethod(records: AppSalesRecord[]): string {
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

export function calcSummary(records: AppSalesRecord[], advanceRecords: AppAdvanceReservation[], period: AdminReportsPeriod, customDate: string): AdminReportsSummary {
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
    const endDate = new Date(new Date(customDate).getTime() + MS_PER_DAY * 4).toISOString().split("T")[0];
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

export function calcTopItems(
  orders: AppOrder[],
  menu: AppMenuItem[],
  records: AppSalesRecord[]
): AdminReportsTopItem[] {
  const scopedOrderIds = new Set(records.map((r) => r.orderId));
  const menuMap = new Map(menu.map((m) => [m.id, m]));

  const aggregated = new Map<string, AdminReportsTopItem>();

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

export function calcDailyRevenue(records: AppSalesRecord[], days: number): AdminReportsDailyStat[] {
  return Array.from({ length: days }, (_, i) => {
    const dayIndex = days - 1 - i;
    const dayStart = (() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - dayIndex);
      return d.getTime();
    })();
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

export function buildAndDownloadCsv(records: AppSalesRecord[]): void {
  if (typeof window === "undefined") return;

  const rows = records.map((r) =>
    [
      formatDate(r.timestamp),
      r.tableNumber,
      r.paymentMethod,
      r.subtotal,
      r.cgst,
      r.sgst,
      r.serviceCharge,
      r.vat,
      r.discount,
      r.totalAmount,
    ].join(",")
  );

  const csvContent = CSV_HEADERS + rows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href     = url;
  link.download = `sales-report-${Date.now()}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
