// RESPONSIBILITY: Super Admin Staff & User Management View Layer.
// DATA FLOW: useSuperAdminUsers -> UsersPage -> SuperAdminUsersTable

"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Search, Plus } from "lucide-react";
import { useSuperAdminUsers } from "@/app/super-admin/super-admin_hooks/useSuperAdminUsers";
import { SuperAdminUsersTable } from "@/app/super-admin/super-admin_components/Users/SuperAdminUsersTable";

export default function UsersPage() {
  const { search, setSearch, filteredUsers } = useSuperAdminUsers();

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Page Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-table-header text-text-secondary mb-1">
          <Link href="/super-admin/dashboard" className="hover:text-text-primary motion-safe:transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={12} strokeWidth={2} />
          <span className="text-text-primary font-medium">Staff & Users</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-page-title font-bold text-text-primary">User Management</h1>
            <p className="text-table-header text-text-secondary">Manage platform access, roles, and permissions.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body font-medium text-white hover:bg-primary-hover motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page">
              <Plus size={16} strokeWidth={2} />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Action Bar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50">
          <div className="relative w-full sm:w-[320px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-input border border-border focus:border-border-focus focus:ring-1 focus:ring-border-focus rounded-md pl-9 pr-4 py-2 text-body text-text-primary placeholder:text-text-secondary motion-safe:transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <SuperAdminUsersTable users={filteredUsers} />
      </div>
    </div>
  );
}
