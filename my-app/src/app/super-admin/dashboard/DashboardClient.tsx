// RESPONSIBILITY: Super Admin Platform Command Center Dashboard View Layer.
// DATA FLOW: tenantService -> useSuperAdminDashboard -> SuperAdminDashboardPage -> Child View Components

"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Clock, CreditCard } from "lucide-react";
import { useSuperAdminDashboard } from "@/app/super-admin/super-admin_hooks/useSuperAdminDashboard";
import { SuperAdminDashboardKpiCards } from "@/app/super-admin/super-admin_components/Dashboard/SuperAdminDashboardKpiCards";
import { SuperAdminDashboardRevenueChartCard } from "@/app/super-admin/super-admin_components/Dashboard/SuperAdminDashboardRevenueChartCard";
import { SuperAdminDashboardTenantsTableCard } from "@/app/super-admin/super-admin_components/Dashboard/SuperAdminDashboardTenantsTableCard";

export default function SuperAdminDashboardPage() {
  const { tenants, kpis, monthlyRevenueStats, isLoading } = useSuperAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 motion-safe:animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Header & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-table-header text-text-secondary mb-1">
          <Link href="/super-admin/dashboard" className="hover:text-text-primary motion-safe:transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={12} strokeWidth={2} />
          <span className="text-text-primary font-medium">Overview</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-page-title font-bold text-text-primary">Platform Command Center</h1>
            <p className="text-table-header text-text-secondary">Global SaaS metrics and partner growth overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/super-admin/requests"
              className="flex items-center gap-2 rounded-md bg-warning-bg border border-warning/30 px-4 py-2 text-body font-medium text-warning motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Clock size={16} strokeWidth={2} />
              <span>Audit Requests ({kpis.pendingAuditCount})</span>
            </Link>
            <Link
              href="/super-admin/payments"
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body font-medium text-white hover:bg-primary-hover motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CreditCard size={16} strokeWidth={2} />
              <span>Verify Payments</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <SuperAdminDashboardKpiCards kpis={kpis} />

      {/* Analytics & Table Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SuperAdminDashboardRevenueChartCard stats={monthlyRevenueStats} />
        </div>
        <div className="lg:col-span-2">
          <SuperAdminDashboardTenantsTableCard tenants={tenants} />
        </div>
      </div>
    </div>
  );
}
