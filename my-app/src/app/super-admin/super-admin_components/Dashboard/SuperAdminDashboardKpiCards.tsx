// RESPONSIBILITY: Renders the KPI Card Grid for Super Admin SaaS Command Center.
// DATA FLOW: useSuperAdminDashboard -> SuperAdminDashboardPage -> SuperAdminDashboardKpiCards

import React from "react";
import {
  IndianRupee,
  Building2,
  Zap,
  Clock,
  CreditCard,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import type { SuperAdminDashboardKpi } from "@/app/super-admin/super-admin_types/dashboard.types";
import { SuperAdminKpiCard } from "./SuperAdminKpiCard";

export interface SuperAdminDashboardKpiCardsProps {
  kpis: SuperAdminDashboardKpi;
}

export const SuperAdminDashboardKpiCards: React.FC<SuperAdminDashboardKpiCardsProps> = ({ kpis }) => {
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);

  const handleFilter = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <SuperAdminKpiCard
        title="Total Revenue"
        value={`₹${kpis.totalRevenue.toLocaleString("en-IN")}`}
        subtitle=""
        icon={IndianRupee}
        iconBgClass="bg-success-bg"
        iconTextClass="text-success"
        trendIcon={<TrendingUp size={12} strokeWidth={2} />}
        trendText="↑ 12% vs last month"
        isActive={activeFilter === 'revenue'}
        onClick={() => handleFilter('revenue')}
      />
      <SuperAdminKpiCard
        title="Total Hotels"
        value={kpis.totalHotels}
        subtitle="Onboarded across cities"
        icon={Building2}
        iconBgClass="bg-info-bg"
        iconTextClass="text-info"
        isActive={activeFilter === 'hotels'}
        onClick={() => handleFilter('hotels')}
      />
      <SuperAdminKpiCard
        title="Joined Today"
        value={`+${kpis.joinedToday}`}
        subtitle="New partner signups"
        icon={Zap}
        iconBgClass="bg-primary-subtle"
        iconTextClass="text-text-primary"
        isActive={activeFilter === 'joined'}
        onClick={() => handleFilter('joined')}
      />
      <SuperAdminKpiCard
        title="Pending Audit"
        value={kpis.pendingAuditCount}
        subtitle="Awaiting FSSAI checks"
        icon={Clock}
        iconBgClass="bg-warning-bg"
        iconTextClass="text-warning"
        isActive={activeFilter === 'audit'}
        onClick={() => handleFilter('audit')}
      />
      <SuperAdminKpiCard
        title="Paid Hotels"
        value={kpis.paidHotelsCount}
        subtitle="₹2,999 fee collected"
        icon={CreditCard}
        iconBgClass="bg-primary-subtle"
        iconTextClass="text-text-primary"
        isActive={activeFilter === 'paid'}
        onClick={() => handleFilter('paid')}
      />
      <SuperAdminKpiCard
        title="Active POS"
        value={kpis.activePosCount}
        subtitle="Live terminals"
        icon={CheckCircle2}
        iconBgClass="bg-success-bg"
        iconTextClass="text-success"
        isActive={activeFilter === 'active'}
        onClick={() => handleFilter('active')}
      />
    </div>
  );
};
