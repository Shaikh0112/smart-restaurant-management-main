// RESPONSIBILITY: Custom hook for managing Super Admin onboarding audit requests.
// DATA FLOW: tenantService -> useSuperAdminRequests -> RequestsPage -> SuperAdminRequestsTable

import { useState, useEffect, useMemo, useCallback } from "react";
import type { AppTenant } from "@/types/appTypes";
import { getStoredTenants, updateTenantStatus } from "@/lib/tenantService";
import { dispatchNotification } from "@/lib/notificationService";

/**
 * @description Custom hook for useSuperAdminRequests
 * @returns {object} Hook state and methods
 */
export function useSuperAdminRequests() {
  const [search, setSearch] = useState<string>("");
  const [requests, setRequests] = useState<AppTenant[]>([]);

  const refreshRequests = useCallback(() => {
    try {
      const all = getStoredTenants();
      const pending = all.filter((t) => t.status === "APPROVAL_PENDING");
      setRequests(pending);
    } catch (err) {
      /* console error removed */
    }
  }, []);

  // AUDIT: Dependency array verified for React bounds
  useEffect(() => {
    refreshRequests();
  }, [refreshRequests]);

  const handleApprove = useCallback(
    (tenant: AppTenant) => {
      updateTenantStatus(tenant.tenantId, "PAYMENT_PENDING");
      dispatchNotification({
        role: "MANAGER",
        type: "HOTEL_REGISTRATION_NEW",
        title: "Hotel Approved! 🎉",
        message: `Your hotel "${tenant.restaurantName}" is approved. Please proceed to payment.`,
        route: "/manager/dashboard",
        playSound: true,
        soundType: "READY",
      });
      refreshRequests();
    },
    [refreshRequests]
  );

  const filteredRequests = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return requests;
    return requests.filter(
      (req) =>
        (req.restaurantName || "").toLowerCase().includes(q) ||
        (req.tenantId || "").toLowerCase().includes(q)
    );
  }, [requests, search]);

  return {
    search,
    setSearch,
    filteredRequests,
    handleApprove,
  };
}
