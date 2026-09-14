// RESPONSIBILITY: Custom hook for managing SaaS platform subscriptions and renewals.
// DATA FLOW: useSuperAdminSubscriptions -> SubscriptionsPage -> SuperAdminSubscriptionsTable

import { useState, useMemo } from "react";

export interface SuperAdminSubscription {
  id: string;
  hotel: string;
  plan: string;
  amount: string;
  status: "ACTIVE" | "EXPIRING" | "EXPIRED";
  expiresIn: string;
}

/**
 * @description Custom hook for useSuperAdminSubscriptions
 * @returns {object} Hook state and methods
 */
export function useSuperAdminSubscriptions() {
  const [search, setSearch] = useState<string>("");

  const mockSubs: SuperAdminSubscription[] = useMemo(
    () => [
      {
        id: "SUB-001",
        hotel: "Spicy Route",
        plan: "Annual Pro",
        amount: "₹2,999",
        status: "ACTIVE",
        expiresIn: "340 days",
      },
      {
        id: "SUB-002",
        hotel: "Burger Hub",
        plan: "Annual Pro",
        amount: "₹2,999",
        status: "EXPIRING",
        expiresIn: "5 days",
      },
    ],
    []
  );

  const filteredSubs = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return mockSubs;
    return mockSubs.filter(
      (sub) =>
        sub.hotel.toLowerCase().includes(q) ||
        sub.id.toLowerCase().includes(q) ||
        sub.plan.toLowerCase().includes(q)
    );
  }, [mockSubs, search]);

  return {
    search,
    setSearch,
    filteredSubs,
  };
}
