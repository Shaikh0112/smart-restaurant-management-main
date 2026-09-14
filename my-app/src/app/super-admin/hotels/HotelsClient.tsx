// RESPONSIBILITY: Super Admin Hotel/Restaurant Directory Page View Layer.
// DATA FLOW: tenantService -> useSuperAdminHotels -> HotelsPage -> SuperAdminHotelsTable

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Filter, Building2, AlertTriangle } from "lucide-react";
import { useSuperAdminHotels } from "@/app/super-admin/super-admin_hooks/useSuperAdminHotels";
import { SuperAdminHotelsTable } from "@/app/super-admin/super-admin_components/Hotels/SuperAdminHotelsTable";
import { TablePagination } from "@/app/super-admin/super-admin_components/Shared/TablePagination";

export default function HotelsPage() {
  const {
    filteredTenants,
    pagination,
    sorting,
    handleSort,
    setPage,
    setLimit,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedTenantToSuspend,
    setSelectedTenantToSuspend,
    handleSuspendTenant,
  } = useSuperAdminHotels();

  const [confirmText, setConfirmText] = useState("");

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Breadcrumb & Title */}
      <div>
        <div className="flex items-center gap-2 text-table-header text-text-secondary mb-1">
          <Link href="/super-admin/dashboard" className="hover:text-text-primary motion-safe:transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={12} strokeWidth={2} />
          <span className="text-text-primary font-medium">Hotel List</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-page-title font-bold text-text-primary">Hotel Directory</h1>
            <p className="text-table-header text-text-secondary">
              Manage and monitor all onboarded restaurants and active POS terminals.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body font-medium text-white hover:bg-primary-hover motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page">
            <Building2 size={16} strokeWidth={2} />
            <span>Register New Hotel</span>
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Filter Action Bar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50">
          <div className="relative w-full sm:w-[320px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search hotel, city, owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-input border border-border focus:border-border-focus focus:ring-1 focus:ring-border-focus rounded-md pl-9 pr-4 py-2 text-body text-text-primary placeholder:text-text-secondary motion-safe:transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-input border border-border rounded-md px-3 py-2">
              <Filter size={16} className="text-text-secondary" strokeWidth={2} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none text-small text-text-primary focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active POS</option>
                <option value="APPROVAL_PENDING">Pending Audit</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table Component */}
        <SuperAdminHotelsTable 
          tenants={filteredTenants} 
          onSelectSuspend={setSelectedTenantToSuspend} 
          sorting={sorting}
          onSort={handleSort}
        />

        {/* Pagination Bar */}
        <TablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.limit}
          onPageChange={setPage}
          onItemsPerPageChange={setLimit}
        />
      </div>

      {/* Double Verification Suspension Dialog (Rule 71) */}
      {selectedTenantToSuspend && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-overlay backdrop-blur-sm p-4">
          <div className="bg-overlay border border-border rounded-xl p-6 max-w-md w-full shadow-2xl motion-safe:animate-in">
            <div className="flex items-center gap-3 text-danger mb-3">
              <div className="h-10 w-10 rounded-full bg-danger-bg flex items-center justify-center shrink-0">
                <AlertTriangle size={20} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">Suspend Hotel Access?</h3>
                <p className="text-table-header text-text-secondary">Irreversible action for tenant POS.</p>
              </div>
            </div>
            <p className="text-small text-text-secondary mb-4">
              Are you sure you want to suspend access for{" "}
              <strong className="text-text-primary">
                {selectedTenantToSuspend.restaurantName}
              </strong>
              ? Their POS terminals and waiter apps will be blocked immediately.
            </p>
            <div className="mb-6">
              <label className="block text-table-header text-text-secondary mb-2">
                Type <span className="font-bold text-text-primary">SUSPEND</span> to confirm
              </label>
              <input 
                type="text" 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full bg-input border border-border focus:border-danger rounded-md px-3 py-2 text-body text-text-primary outline-none"
                placeholder="SUSPEND"
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedTenantToSuspend(null);
                  setConfirmText("");
                }}
                className="px-4 py-2 rounded-md border border-border text-small font-medium text-text-primary hover:bg-border motion-safe:transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={confirmText !== "SUSPEND"}
                onClick={() => {
                  handleSuspendTenant(selectedTenantToSuspend.tenantId);
                  setConfirmText("");
                }}
                className="px-4 py-2 rounded-md bg-danger text-white text-small font-medium hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed motion-safe:transition-all"
              >
                Confirm Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
