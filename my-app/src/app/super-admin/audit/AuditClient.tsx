// RESPONSIBILITY: Super Admin System Audit Logs View Layer.
// DATA FLOW: useSuperAdminAudit -> AuditPage -> SuperAdminAuditLogsTable

"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Search, Filter, Download, Clock } from "lucide-react";
import { useSuperAdminAudit } from "@/app/super-admin/super-admin_hooks/useSuperAdminAudit";
import { SuperAdminAuditLogsTable } from "@/app/super-admin/super-admin_components/Audit/SuperAdminAuditLogsTable";

export default function AuditPage() {
  const { search, setSearch, severityFilter, setSeverityFilter, filteredLogs, totalCount } = useSuperAdminAudit();

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Page Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-table-header text-text-secondary mb-1">
          <Link href="/super-admin/dashboard" className="hover:text-text-primary motion-safe:transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={12} strokeWidth={2} />
          <span className="text-text-primary font-medium">Audit Logs</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-page-title font-bold text-text-primary">System Audit Logs</h1>
            <p className="text-table-header text-text-secondary">
              Immutable chronological record of all global system events and administrative actions.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-md bg-card border border-border px-4 py-2 text-body font-medium text-text-primary hover:bg-border/50 motion-safe:transition-all motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page">
            <Download size={16} strokeWidth={2} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Action Bar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50">
          <div className="relative w-full sm:w-[320px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search user, action, or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-input border border-border focus:border-border-focus focus:ring-1 focus:ring-border-focus rounded-md pl-9 pr-4 py-2 text-body text-text-primary placeholder:text-text-secondary motion-safe:transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-input border border-border rounded-md px-3 py-2">
              <Filter size={16} className="text-text-secondary" strokeWidth={2} />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-transparent border-none text-small text-text-primary focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="WARNING">Warning</option>
                <option value="INFO">Info</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-input border border-border rounded-md px-3 py-2">
              <Clock size={16} className="text-text-secondary" strokeWidth={2} />
              <select className="bg-transparent border-none text-small text-text-primary focus:outline-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page">
                <option value="7D">Last 7 Days</option>
                <option value="30D">Last 30 Days</option>
                <option value="ALL">All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <SuperAdminAuditLogsTable logs={filteredLogs} />

        {/* Pagination Bar */}
        <div className="p-4 border-t border-border flex items-center justify-between text-small text-text-secondary bg-card/50">
          <span>Showing 1 to {filteredLogs.length} of {totalCount} logs</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border border-border hover:bg-border disabled:opacity-50 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page" disabled>
              Previous
            </button>
            <button className="px-3 py-1 rounded border border-border hover:bg-border disabled:opacity-50 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
