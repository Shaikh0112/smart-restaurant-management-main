// RESPONSIBILITY: Custom hook managing SaaS subscription payments and verification for Super Admin.
// DATA FLOW: tenantService -> useSuperAdminPayments -> PaymentsPage -> SuperAdminPaymentsTable

import { useState, useEffect, useMemo, useCallback } from "react";
import type { AppTenant } from "@/types/appTypes";
import { getStoredTenants, updateTenantStatus } from "@/lib/tenantService";
import { dispatchNotification } from "@/lib/notificationService";

/**
 * @description Custom hook for useSuperAdminPayments
 * @returns {object} Hook state and methods
 */
export function useSuperAdminPayments() {
  const [search, setSearch] = useState<string>("");
  const [payments, setPayments] = useState<AppTenant[]>([]);

  const refreshPayments = useCallback(() => {
    try {
      const all = getStoredTenants();
      const pendingVerif = all.filter((t) => t.status === "PAYMENT_SUBMITTED" || t.status === "ACTIVE");
      setPayments(pendingVerif);
    } catch (err) {
      /* console error removed */
    }
  }, []);

  // AUDIT: Dependency array verified for React bounds
  useEffect(() => {
    refreshPayments();
  }, [refreshPayments]);

  const handleVerify = useCallback(
    (tenant: AppTenant) => {
      updateTenantStatus(tenant.tenantId, "ACTIVE");
      dispatchNotification({
        role: "MANAGER",
        type: "PAYMENT_VERIFIED",
        title: "Payment Verified! 🎉",
        message: `Your hotel request and payment success. Now fill the list hotel form and list your hotel.`,
        route: "/admin/list-hotel",
        playSound: true,
        soundType: "READY",
      });
      refreshPayments();
    },
    [refreshPayments]
  );

  const filteredPayments = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return payments;
    return payments.filter(
      (pay) =>
        (pay.restaurantName || "").toLowerCase().includes(q) ||
        (pay.txnRefId && pay.txnRefId.toLowerCase().includes(q))
    );
  }, [payments, search]);

  return {
    search,
    setSearch,
    filteredPayments,
    handleVerify,
  };
}
