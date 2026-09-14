// @ts-nocheck
﻿"use client";

// RESPONSIBILITY: Renders 4 KPI summary cards for the ManagerReports page.
// Receives pre-calculated summary data via props â€” no data fetching.
// DATA FLOW: useManagerReports â†’ manager_reports/page.tsx â†’ ManagerReportsSummaryCards â†’ UI

import { TrendingUp, ShoppingBag, IndianRupee, CreditCard, CalendarClock } from "lucide-react";
import { formatCurrencyCompact, formatCurrency } from "@/lib/formatters";
import type { ManagerReportsSummaryCardsProps } from "@/app/manager/reports/manager_reports_types/ManagerReportsTypes";

// â”€â”€â”€ Sub-component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// RESPONSIBILITY: Single KPI card â€” icon + label + value display.
interface ManagerReportsKpiCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}

function ManagerReportsKpiCard({ icon: Icon, label, value, sub }: ManagerReportsKpiCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-primary" />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
          {label}
        </span>
      </div>
      <p className="text-[26px] font-bold leading-none text-text-primary">{value}</p>
      {sub !== undefined && (
        <p className="text-[12px] text-text-secondary">{sub}</p>
      )}
    </div>
  );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Renders 4 KPI cards: Total Revenue, Total Orders, Avg Order Value, Top Payment Method.
 * Responsive: 2-column on mobile, 4-column on md+.
 *
 * @param summary - Pre-calculated ManagerReportsSummary from useManagerReports
 */
export function ManagerReportsSummaryCards({ summary }: ManagerReportsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <ManagerReportsKpiCard
        icon={IndianRupee}
        label="Total Revenue"
        value={formatCurrencyCompact(summary.totalRevenue)}
        sub={summary.periodLabel}
      />
      <ManagerReportsKpiCard
        icon={ShoppingBag}
        label="Total Orders"
        value={String(summary.totalOrders)}
        sub={summary.periodLabel}
      />
      <ManagerReportsKpiCard
        icon={TrendingUp}
        label="Avg Order Value"
        value={formatCurrency(summary.avgOrderValue)}
        sub="Per transaction"
      />
      <ManagerReportsKpiCard
        icon={CreditCard}
        label="Top Payment"
        value={summary.topPaymentMethod}
        sub="By revenue"
      />
      <ManagerReportsKpiCard
        icon={CalendarClock}
        label="Adv. Bookings"
        value={String(summary.advanceBookingCount)}
        sub={summary.periodLabel}
      />
      <ManagerReportsKpiCard
        icon={IndianRupee}
        label="Adv. Revenue"
        value={formatCurrencyCompact(summary.advanceBookingRevenue)}
        sub="From deposits"
      />
    </div>
  );
}
