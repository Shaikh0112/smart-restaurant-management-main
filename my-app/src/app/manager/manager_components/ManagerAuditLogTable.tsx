// @ts-nocheck
﻿"use client";

// RESPONSIBILITY: Audit log data table with action badge colors, search filter,
// and pagination (10 rows per page). Sorted newest first.
// Pure display component — no localStorage access.
// DATA FLOW: admin/audit/page.tsx → ManagerAuditLogTable → UI

import { useState, useMemo } from "react";
import { Search, Filter, ClipboardList } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ManagerEmptyState } from "@/app/manager/manager_components/ManagerEmptyState";
import { formatDateTime } from "@/lib/formatters";
import { AppPagination } from "@/components/ui/AppPagination";
import type { ManagerAuditLogTableProps } from "@/app/manager/manager_types/ManagerTypes";

// ─── Constants (Rule 35: No magic strings) ────────────────────────────────────

const PAGE_SIZE = 10 as const;

const ACTION_BADGE_STYLES: Record<string, string> = {
  CHECKOUT_COMPLETED: "bg-success-bg text-success",
  DISCOUNT_APPLIED:   "bg-warning-bg text-warning",
  ITEM_VOID:          "bg-danger-bg text-danger",
  VOID_REQUESTED:     "bg-danger-bg text-danger",
  LOYALTY_REDEEMED:   "bg-info-bg text-info",
  STOCK_TOGGLE:       "bg-warning-bg text-warning",
  SHIFT_OPENED:       "bg-info-bg text-info",
  SHIFT_CLOSED:       "bg-success-bg text-success",
} as const;

const DEFAULT_BADGE = "bg-card text-text-secondary" as const;

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Audit log table — sorted newest first, searchable by action type,
 * filtered by action type, paginated with AppPagination.
 */
export function ManagerAuditLogTable({ auditLogs }: ManagerAuditLogTableProps) {
  const [search, setPageSearch] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const sortParam = searchParams.get("sort") || "timestamp_desc";
  const [sortKey, sortOrder] = sortParam.split("_");
  
  const updateQueryParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const setCurrentPage = (p: number) => {
    updateQueryParams({ page: p.toString() });
  };

  const handleSort = (key: string) => {
    const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    updateQueryParams({ sort: `${key}_${newOrder}` });
  };
  const [pageSize, setPageSize] = useState<number>(10);

  // Extract unique action types
  const actionTypes = useMemo(() => {
    const set = new Set<string>();
    auditLogs.forEach((l) => set.add(l.action));
    return Array.from(set);
  }, [auditLogs]);

  // Sort based on URL params, then filter by search & action type
  const filtered = useMemo(() => {
    const sorted = [...auditLogs].sort((a, b) => {
      const valA = a[sortKey as keyof typeof a];
      const valB = b[sortKey as keyof typeof b];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted.filter((log) => {
      const q = search.trim().toUpperCase();
      const matchesSearch =
        !q ||
        log.action.toUpperCase().includes(q) ||
        log.details.toUpperCase().includes(q) ||
        log.userRole.toUpperCase().includes(q);
      const matchesAction =
        actionFilter === "ALL" || log.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [auditLogs, search, actionFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(pageStart, pageStart + pageSize);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPageSearch(e.target.value);
    setCurrentPage(1);
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (auditLogs.length === 0) {
    return (
      <ManagerEmptyState
        title="No audit log entries"
        description="Audit logs will appear here when actions are taken in the system."
        icon={ClipboardList}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Action Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by action, details, or role…"
            className="w-full rounded-lg border border-border bg-input py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-disabled focus:border-border-focus focus:outline-none"
          />
        </div>

        {/* Action Type Filter */}
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-text-disabled" />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-border bg-input px-3 py-1.5 text-xs font-semibold text-text-primary focus:border-border-focus focus:outline-none"
          >
            <option value="ALL">All Action Types</option>
            {actionTypes.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-primary/5">
              {[
                { label: "Timestamp", key: "timestamp" },
                { label: "Action", key: "action" },
                { label: "Details", key: "details" },
                { label: "User Role", key: "userRole" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-secondary cursor-pointer hover:bg-primary/10 select-none"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {sortKey === key && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[13px] text-text-secondary">
                  No results for &quot;{search}&quot;
                </td>
              </tr>
            ) : (
              pageRows.map((log) => {
                const badgeStyle = ACTION_BADGE_STYLES[log.action] ?? DEFAULT_BADGE;
                return (
                  <tr
                    key={log.id}
                    onClick={() => {}}
                    className="border-b border-border last:border-0 odd:bg-card even:bg-page hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-[12px] text-text-secondary whitespace-nowrap">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeStyle}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary max-w-xs">
                      {log.details}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-medium text-text-primary">
                      {log.userRole}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <AppPagination
        currentPage={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filtered.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
