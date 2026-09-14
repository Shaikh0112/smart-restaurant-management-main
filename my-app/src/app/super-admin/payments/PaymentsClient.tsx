// RESPONSIBILITY: Super Admin SaaS Payments & Invoicing View Layer.
// DATA FLOW: tenantService -> useSuperAdminPayments -> PaymentsPage -> SuperAdminPaymentsTable

"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { useSuperAdminPayments } from "@/app/super-admin/super-admin_hooks/useSuperAdminPayments";
import { SuperAdminPaymentsTable } from "@/app/super-admin/super-admin_components/Payments/SuperAdminPaymentsTable";

export default function PaymentsPage() {
  const { search, setSearch, filteredPayments, handleVerify } = useSuperAdminPayments();

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">
      <div>
        <div className="flex items-center gap-2 text-table-header text-text-secondary mb-1">
          <Link href="/super-admin/dashboard" className="hover:text-text-primary motion-safe:transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={12} strokeWidth={2} />
          <span className="text-text-primary font-medium">Payments</span>
        </div>
        <div>
          <h1 className="text-page-title font-bold text-text-primary">Payment Verification & History</h1>
          <p className="text-table-header text-text-secondary">Verify submitted setup fees and track subscription payments.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-card/50">
          <div className="relative w-full sm:w-[320px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search hotel or transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-input border border-border focus:border-border-focus focus:ring-1 focus:ring-border-focus rounded-md pl-9 pr-4 py-2 text-body text-text-primary motion-safe:transition-all"
            />
          </div>
        </div>

        <SuperAdminPaymentsTable payments={filteredPayments} onVerify={handleVerify} />
      </div>
    </div>
  );
}
