// RESPONSIBILITY: Super Admin SaaS Subscriptions Management View Layer.
// DATA FLOW: useSuperAdminSubscriptions -> SubscriptionsPage -> SuperAdminSubscriptionsTable

"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { useSuperAdminSubscriptions } from "@/app/super-admin/super-admin_hooks/useSuperAdminSubscriptions";
import { SuperAdminSubscriptionsTable } from "@/app/super-admin/super-admin_components/Subscriptions/SuperAdminSubscriptionsTable";

export default function SubscriptionsPage() {
  const { search, setSearch, filteredSubs } = useSuperAdminSubscriptions();

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">
      <div>
        <div className="flex items-center gap-2 text-table-header text-text-secondary mb-1">
          <Link href="/super-admin/dashboard" className="hover:text-text-primary motion-safe:transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={12} strokeWidth={2} />
          <span className="text-text-primary font-medium">Subscriptions</span>
        </div>
        <div>
          <h1 className="text-page-title font-bold text-text-primary">SaaS Subscriptions</h1>
          <p className="text-table-header text-text-secondary">Manage active subscriptions, renewals, and expirations.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50">
          <div className="relative w-full sm:w-[320px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search hotel or subscription ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-input border border-border focus:border-border-focus focus:ring-1 focus:ring-border-focus rounded-md pl-9 pr-4 py-2 text-body text-text-primary motion-safe:transition-all"
            />
          </div>
        </div>
        <SuperAdminSubscriptionsTable subscriptions={filteredSubs} />
      </div>
    </div>
  );
}
