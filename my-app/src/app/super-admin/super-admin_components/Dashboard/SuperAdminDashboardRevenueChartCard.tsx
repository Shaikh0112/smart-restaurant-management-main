// RESPONSIBILITY: Renders the Monthly Revenue Growth chart representation card for Super Admin Dashboard.
// DATA FLOW: useSuperAdminDashboard -> SuperAdminDashboardPage -> SuperAdminDashboardRevenueChartCard

import React from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import type { SuperAdminMonthlyRevenueStat } from "@/app/super-admin/super-admin_types/dashboard.types";

export interface SuperAdminDashboardRevenueChartCardProps {
  stats: SuperAdminMonthlyRevenueStat[];
}

export const SuperAdminDashboardRevenueChartCard: React.FC<SuperAdminDashboardRevenueChartCardProps> = ({ stats }) => {
  const maxRevenue = Math.max(...stats.map((s) => s.revenue), 10000);

  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between motion-safe:transition-all motion-safe:duration-200">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-text-primary" strokeWidth={2} />
            <h2 className="text-base font-semibold text-text-primary">Monthly Recurring Revenue (MRR) Growth</h2>
          </div>
          <span className="text-badge font-medium text-success bg-success-bg border border-success/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <TrendingUp size={10} strokeWidth={2} /> +24% YoY
          </span>
        </div>
        <p className="text-table-header text-text-secondary mb-6">Subscription fees collected from onboarded restaurant partners.</p>

        {/* Visual Bar Chart Representation */}
        <div className="flex items-end justify-between gap-3 h-48 pt-6 border-b border-border pb-2">
          {stats.map((item, idx) => {
            const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-micro text-text-secondary opacity-0 group-hover:opacity-100 motion-safe:transition-opacity">
                  ₹{(item.revenue / 1000).toFixed(1)}k
                </div>
                <div className="w-full bg-border rounded-t-md relative overflow-hidden flex items-end h-36">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-md motion-safe:transition-all motion-safe:duration-300 group-hover:brightness-110"
                  />
                </div>
                <span className="text-badge font-medium text-text-secondary group-hover:text-text-primary">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-table-header text-text-secondary pt-4">
        <span>Target: ₹1,00,000 / month MRR</span>
        <span className="text-text-primary font-medium">6 Months Trajectory</span>
      </div>
    </div>
  );
};
