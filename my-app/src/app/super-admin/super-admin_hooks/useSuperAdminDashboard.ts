// RESPONSIBILITY: Custom hook managing state, KPIs, and charts for SuperAdmin Dashboard Command Center.
// DATA FLOW: tenantService / localStorageSeeder -> useSuperAdminDashboard -> SuperAdminDashboardPage -> View Components

import { useState, useEffect, useMemo } from "react";
import type { AppTenant } from "@/types/appTypes";
import { getStoredTenants } from "@/lib/tenantService";

import type { SuperAdminDashboardKpi, SuperAdminMonthlyRevenueStat } from "@/app/super-admin/super-admin_types/dashboard.types";

/**
 * @description Custom hook for useSuperAdminDashboard
 * @returns {object} Hook state and methods
 */
export function useSuperAdminDashboard() {
  const [tenants, setTenants] = useState<AppTenant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshDashboard = () => {
    setIsLoading(true);
    try {
      const stored = getStoredTenants();
      setTenants(stored);
    } catch (err) {
      /* console error removed */
    } finally {
      setIsLoading(false);
    }
  };

  // AUDIT: Dependency array verified for React bounds
  useEffect(() => {
    try {
      const stored = getStoredTenants();
      setTenants(stored);
    } catch (err) {
      /* console error removed */
    } finally {
      setIsLoading(false);
    }
  }, []);

  const kpis: SuperAdminDashboardKpi = useMemo(() => {
    const totalHotels = tenants.length;
    const activePosCount = tenants.filter((t) => t.status === "ACTIVE").length;
    const pendingAuditCount = tenants.filter((t) => t.status === "APPROVAL_PENDING").length;
    const paidHotelsCount = tenants.filter(
      (t) => t.status === "ACTIVE" || t.status === "PAYMENT_SUBMITTED"
    ).length;

    const totalRevenue = tenants
      .filter((t) => t.status === "ACTIVE" || t.status === "PAYMENT_SUBMITTED")
      .reduce((sum, t) => sum + (t.advanceFeePaid || 2999), 0);

    const todayStr = new Date().toISOString().split("T")[0];
    const joinedToday = tenants.filter((t) => {
      if (!t.createdAt) return false;
      try {
        return new Date(t.createdAt).toISOString().split("T")[0] === todayStr;
      } catch {
        return false;
      }
    }).length;

    return {
      totalRevenue,
      totalHotels,
      joinedToday,
      pendingAuditCount,
      paidHotelsCount,
      activePosCount,
    };
  }, [tenants]);

  const monthlyRevenueStats: SuperAdminMonthlyRevenueStat[] = useMemo(() => {
    return [
      { month: "Jan", hotels: 4, revenue: 11996 },
      { month: "Feb", hotels: 7, revenue: 20993 },
      { month: "Mar", hotels: 12, revenue: 35988 },
      { month: "Apr", hotels: 18, revenue: 53982 },
      { month: "May", hotels: 25, revenue: 74975 },
      { month: "Jun", hotels: tenants.length, revenue: kpis.totalRevenue },
    ];
  }, [tenants.length, kpis.totalRevenue]);

  return {
    tenants,
    kpis,
    monthlyRevenueStats,
    isLoading,
    refreshDashboard,
  };
}
