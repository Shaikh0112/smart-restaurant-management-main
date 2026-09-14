import { getStatusConfig } from "@/config/statusBadgeConfig";
// RESPONSIBILITY: Renders the Recent Tenants Table Card on the Super Admin Dashboard.
// DATA FLOW: useSuperAdminDashboard -> SuperAdminDashboardPage -> SuperAdminDashboardTenantsTableCard

import React from "react";
import Link from "next/link";
import { Building2, ChevronRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { AppTenant } from "@/types/appTypes";

export interface SuperAdminDashboardTenantsTableCardProps {
  tenants: AppTenant[];
}

export const SuperAdminDashboardTenantsTableCard: React.FC<SuperAdminDashboardTenantsTableCardProps> = ({ tenants }) => {
  const recentTenants = tenants.slice(0, 5);

  const getStatusBadge = (status: string) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-badge font-semibold border ${config.bgClass} ${config.textClass}`}>
        {Icon && <Icon size={12} strokeWidth={2} />}
        {config.label}
      </span>
    );
  };


  return (
    <div className="bg-card border border-border rounded-lg p-5 motion-safe:transition-all motion-safe:duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Recent Onboarded Hotels</h2>
          <p className="text-table-header text-text-secondary">Latest restaurant partners registered on the SaaS platform.</p>
        </div>
        <Link
          href="/super-admin/hotels"
          className="flex items-center gap-1 text-table-header font-medium text-text-primary hover:underline"
        >
          <span>View All Directory</span>
          <ChevronRight size={14} strokeWidth={2} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-primary-subtle/20 text-table-header font-semibold text-text-secondary uppercase tracking-wider">
              <th className="py-3 px-4">Hotel Name</th>
              <th className="py-3 px-4">Owner & Phone</th>
              <th className="py-3 px-4">City</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Fee Paid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-body">
            {recentTenants.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-text-secondary">
                  No registered hotel partners found.
                </td>
              </tr>
            ) : (
              recentTenants.map((t) => (
                <tr
                  key={t.tenantId}
                  className="hover:bg-primary-subtle/10 cursor-pointer motion-safe:transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-border text-text-primary font-bold shrink-0">
                        <Building2 size={16} strokeWidth={2} />
                      </div>
                      <div className="truncate max-w-[180px]">
                        <p className="font-semibold text-text-primary truncate">{t.restaurantName}</p>
                        <p className="text-badge text-text-secondary truncate">ID: {t.tenantId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-text-primary">{t.ownerName}</p>
                    <p className="text-badge text-text-secondary">{t.ownerPhone}</p>
                  </td>
                  <td className="py-3 px-4 text-text-secondary">{t.city}</td>
                  <td className="py-3 px-4 text-center">{getStatusBadge(t.status)}</td>
                  <td className="py-3 px-4 text-right font-bold text-text-primary">
                    ₹{(t.advanceFeePaid || 2999).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
