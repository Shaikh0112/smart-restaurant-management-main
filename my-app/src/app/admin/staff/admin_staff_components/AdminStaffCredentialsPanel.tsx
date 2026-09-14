"use client";

// RESPONSIBILITY: Admin Staff Management & Credentials Generator panel.
// Allows Admin to view staff, generate IDs/Passwords for Cashier, Waiter, Kitchen roles, and toggle status.
// DATA FLOW: Admin inputs -> AdminStaffCredentialsPanel.tsx -> app_users localStorage -> Auth & Audit logs

import React, { useState } from "react";
import type { AppUser } from "@/types/appTypes";
import { useLocalStorage, getActiveTenantId } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import { UserPlus, Shield, Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AppPagination } from "@/components/ui/AppPagination";
import { StaffAddModal } from "./StaffAddModal";
import { AdminStaffCredentialsTable } from "./AdminStaffCredentialsTable";
import { useDebounce } from "@/hooks/useDebounce";
import { AdminActionDialog } from "@/app/admin/admin_components/AdminActionDialog";

export function AdminStaffCredentialsPanel(): React.JSX.Element {
  const [users, setUsers] = useLocalStorage<AppUser[]>(STORAGE_KEYS.USERS, []);
  const [auditLogs, setAuditLogs] = useLocalStorage<any[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial state from URL or fallback
  const urlSearch = searchParams.get("search") || "";
  const urlRole = searchParams.get("role") || "ALL";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlPageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const [searchTerm, setSearchTerm] = useState<string>(urlSearch);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [roleFilter, setRoleFilter] = useState<string>(urlRole);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(urlPage);
  const [pageSize, setPageSize] = useState<number>(urlPageSize);
  const [deactivateTarget, setDeactivateTarget] = useState<{ id: string; name: string } | null>(null);

  // Sync state to URL when debounced values change
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);
    else params.delete("search");
    
    if (roleFilter !== "ALL") params.set("role", roleFilter);
    else params.delete("role");

    params.set("page", currentPage.toString());
    params.set("pageSize", pageSize.toString());

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, roleFilter, currentPage, pageSize, pathname, router, searchParams]);

  // Handle staff creation submit from modal
  const handleAddStaff = (newStaffData: { username: string; passwordHash: string; staffRole: string; staffName: string; staffPhone: string }) => {
    const cleanUsername = newStaffData.username.trim().toLowerCase();
    const existing = users.find((u) => u.username.toLowerCase() === cleanUsername);

    if (existing) {
      return { success: false, error: "Username already exists. Please choose a different username." };
    }

    const tid = getActiveTenantId();
    const newStaff: AppUser = {
      id: `usr-${newStaffData.staffRole.toLowerCase()}-${Date.now()}`,
      username: cleanUsername,
      passwordHash: newStaffData.passwordHash.trim(),
      role: newStaffData.staffRole as "CASHIER" | "WAITER" | "KITCHEN" | "MANAGER",
      name: newStaffData.staffName.trim(),
      phone: newStaffData.staffPhone.trim() || null,
      createdByAdmin: true,
      createdAt: Date.now(),
      isActive: true,
      tenantId: (tid && tid !== "SUPER_ADMIN") ? tid : undefined,
    };

    setUsers([...users, newStaff]);
    writeAuditLog(`STAFF_CREATED`, `Created ${newStaffData.staffRole} account '${cleanUsername}' for ${newStaffData.staffName.trim()}`);
    return { success: true };
  };

  const handleToggleStatus = (userId: string) => {
    const userToToggle = users.find((u) => u.id === userId);
    if (!userToToggle) return;

    if (userToToggle.isActive) {
      setDeactivateTarget({ id: userToToggle.id, name: userToToggle.name });
    } else {
      executeToggleStatus(userId);
    }
  };

  const executeToggleStatus = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const nextStatus = !u.isActive;
        writeAuditLog(
          `STAFF_STATUS_CHANGED`,
          `Updated status of '${u.username}' to ${nextStatus ? "ACTIVE" : "INACTIVE"}`
        );
        return { ...u, isActive: nextStatus };
      }
      return u;
    });
    setUsers(updated);
  };

  interface AuditLogEntry {
    id: string;
    action: string;
    details: string;
    userRole: string;
    timestamp: number;
  }

  // Audit log helper
  const writeAuditLog = (action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      action,
      details,
      userRole: "ADMIN",
      timestamp: Date.now(),
    };
    setAuditLogs((prev: AuditLogEntry[]) => [newLog, ...(Array.isArray(prev) ? prev : [])]);
  };

  // Filter staff list (excludes Admin and Customer by default in staff view)
  const staffList = React.useMemo(() => {
    return users.filter((u) => {
      const isStaffRole = u.role === "CASHIER" || u.role === "WAITER" || u.role === "KITCHEN";
      if (!isStaffRole) return false;

      const tid = getActiveTenantId();
      if (tid && tid !== "SUPER_ADMIN" && u.tenantId !== tid) return false;

      if (roleFilter !== "ALL" && u.role !== roleFilter) return false;

      if (debouncedSearch) {
        const lower = debouncedSearch.toLowerCase();
        const matchName = u.name.toLowerCase().includes(lower);
        const matchUsername = u.username.toLowerCase().includes(lower);
        if (!matchName && !matchUsername) return false;
      }

      return true;
    });
  }, [users, roleFilter, debouncedSearch]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(staffList.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pageStaff = staffList.slice(startIndex, startIndex + pageSize);

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
            <Shield className="h-5 w-5 text-primary" size={18} strokeWidth={2} />
            Staff Credentials
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Manage access for {staffList.length} staff member{staffList.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-sm motion-safe:transition-all hover:bg-primary-hover active:scale-95"
        >
          <UserPlus size={16} />
          <span>Generate New Staff Credentials</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search staff name or ID..."
            className="w-full rounded-lg border border-border bg-input py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-disabled focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {/* Role Tabs Filter */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-page p-1">
          {["ALL", "CASHIER", "WAITER", "KITCHEN"].map((r) => (
            <button
              key={r}
              onClick={() => {
                setRoleFilter(r);
                setCurrentPage(1);
              }}
              className={`rounded-md px-3 py-1 text-xs font-semibold motion-safe:transition-all ${
                roleFilter === r
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <AdminStaffCredentialsTable
        staffList={staffList}
        pageStaff={pageStaff}
        safePage={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        handleToggleStatus={handleToggleStatus}
      />

      <StaffAddModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddStaff} 
      />

      {deactivateTarget && (
        <AdminActionDialog
          itemName={deactivateTarget.name}
          title="Deactivate Staff Member"
          actionWord="DEACTIVATE"
          onConfirm={() => {
            executeToggleStatus(deactivateTarget.id);
            setDeactivateTarget(null);
          }}
          onCancel={() => setDeactivateTarget(null)}
        />
      )}
    </div>
  );
}
