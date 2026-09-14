// RESPONSIBILITY: Utility or types for adminDashboardHelpers.ts.
// DATA FLOW: N/A

import { formatCurrency, formatCurrencyCompact, formatDate } from "@/lib/formatters";
import type { AppOrder, AppSalesRecord } from "@/types/appTypes";
import type { AdminDailyStat, AdminPaymentSplit } from "@/app/admin/admin_types/AdminTypes";

const MS_PER_DAY            = 86_400_000  as const;
const DAYS_FOR_CHART        = 7           as const;
const STATUS_COMPLETED      = "COMPLETED" as const;
const PAY_CASH              = "CASH"      as const;
const PAY_UPI               = "UPI"       as const;
const PAY_CARD              = "CARD"      as const;
const PAY_SPLIT             = "SPLIT"     as const;

export function isToday(timestamp: number): boolean {
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  return timestamp >= todayMidnight.getTime();
}

export function midnightNDaysAgo(daysAgo: number): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.getTime();
}

export function calcLast7DaysStats(salesHistory: AppSalesRecord[]): AdminDailyStat[] {
  return Array.from({ length: DAYS_FOR_CHART }, (_, i) => {
    const dayIndex  = DAYS_FOR_CHART - 1 - i; 
    const dayStart  = midnightNDaysAgo(dayIndex);
    const dayEnd    = dayStart + MS_PER_DAY;

    const daySales  = salesHistory.filter(
      (s) => s.timestamp >= dayStart && s.timestamp < dayEnd
    );

    return {
      date:       formatDate(dayStart),
      revenue:    daySales.reduce((sum, s) => sum + s.totalAmount, 0),
      orderCount: daySales.length,
    };
  });
}

export function calcPaymentSplit(salesHistory: AppSalesRecord[]): AdminPaymentSplit {
  return salesHistory.reduce<AdminPaymentSplit>(
    (acc, s) => {
      if (s.paymentMethod === PAY_CASH)  acc.cash  += s.totalAmount;
      if (s.paymentMethod === PAY_UPI)   acc.upi   += s.totalAmount;
      if (s.paymentMethod === PAY_CARD)  acc.card  += s.totalAmount;
      if (s.paymentMethod === PAY_SPLIT) acc.split += s.totalAmount;
      return acc;
    },
    { cash: 0, upi: 0, card: 0, split: 0 }
  );
}

export function calcKitchenSpeed(orders: AppOrder[]): number {
  const completed = orders.filter((o) => o.status === STATUS_COMPLETED);
  if (completed.length === 0) return 0;
  
  let total = 0;
  let count = 0;
  completed.forEach(o => {
    o.kots.forEach(k => k.items.forEach(i => {
      if (i.prepTimeMins) {
        total += i.prepTimeMins;
        count++;
      }
    }));
  });
  
  return count > 0 ? Math.round(total / count) : 0;
}
