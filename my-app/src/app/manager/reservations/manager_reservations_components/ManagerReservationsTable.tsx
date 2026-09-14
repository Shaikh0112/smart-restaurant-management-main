// @ts-nocheck
﻿"use client";

// RESPONSIBILITY: Renders the manager_reservations data table with status badges,
// inline cancel confirm dialog (pessimistic UI), and per-tab empty state.
// Pure display component — no localStorage access.
// DATA FLOW: useManagerReservations → manager_reservations/page.tsx → ManagerReservationsTable → UI

import React, { useState, useMemo } from "react";
import { XCircle, Loader2, CalendarX, Search, Filter, Ellipsis, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ManagerEmptyState } from "@/app/manager/manager_components/ManagerEmptyState";
import { formatDateTime } from "@/lib/formatters";
import { AppPagination } from "@/components/ui/AppPagination";
import type { ManagerReservationsTableProps } from "@/app/manager/reservations/manager_reservations_types/ManagerReservationsTypes";

// ─── Constants (Rule 35: No magic strings) ────────────────────────────────────

const STATUS_CONFIRMED = "CONFIRMED" as const;
const STATUS_CANCELLED = "CANCELLED" as const;

const STATUS_BADGE: Record<string, string> = {
  [STATUS_CONFIRMED]: "bg-info-bg text-info",
  [STATUS_CANCELLED]: "bg-danger-bg text-danger",
} as const;

const EMPTY_MESSAGES: Record<string, string> = {
  UPCOMING: "No upcoming manager_reservations",
  PAST:     "No past manager_reservations",
} as const;

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Searchable, filterable, and paginated manager_reservations data table.
 * Columns: Slot Time | Customer | Phone | Table | Guests | Status | Actions
 * Cancel action shows an inline confirm row before executing (pessimistic UI).
 *
 * @param manager_reservations - Filtered list (upcoming or past) from useManagerReservations
 * @param tab          - Active tab — used for empty state message
 * @param cancellingId - ID of reservation currently being cancelled
 * @param onCancel     - Callback to execute cancellation
 */
export function ManagerReservationsTable({
  manager_reservations,
  tab,
  cancellingId,
  onCancel,
  onEdit,
  onView,
}: ManagerReservationsTableProps & { onEdit?: (id: string) => void; onView?: (id: string) => void }) {
  // confirmId: which row is showing the inline confirm prompt
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page")) || 1;
  
  const setCurrentPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const [pageSize, setPageSize] = useState<number>(10);

  // Filter and Sort manager_reservations
  const filtered = useMemo(() => {
    let result = manager_reservations.filter((res) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        res.customerName.toLowerCase().includes(q) ||
        res.phone.includes(q) ||
        res.tableId.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" || res.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    const sortParam = searchParams.get("sort");
    if (sortParam) {
      const [field, order] = sortParam.split("_");
      result = [...result].sort((a, b) => {
        let valA = a[field as keyof typeof a];
        let valB = b[field as keyof typeof b];
        
        if (field === "slotTime") {
          valA = new Date(valA as string).getTime() as any;
          valB = new Date(valB as string).getTime() as any;
        }
        
        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [manager_reservations, search, statusFilter, searchParams]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function handleCancelClick(id: string): void {
    setConfirmId(id);
  }

  function handleConfirm(id: string): void {
    setConfirmId(null);
    onCancel(id);
  }

  function handleDismiss(): void {
    setConfirmId(null);
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (manager_reservations.length === 0) {
    return (
      <ManagerEmptyState
        title={EMPTY_MESSAGES[tab] ?? "No reservations"}
        description="There are currently no reservations to display here."
        icon={CalendarX}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Status Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search name, phone, table..."
            className="w-full rounded-lg border border-border bg-input py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-disabled focus:border-border-focus focus:outline-none"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-text-disabled" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-border bg-input px-3 py-1.5 text-xs font-semibold text-text-primary focus:border-border-focus focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed Only</option>
            <option value="CANCELLED">Cancelled Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-primary/5">
              {[
                { label: "Slot Time", field: "slotTime", sortable: true },
                { label: "Customer", field: "customerName", sortable: true },
                { label: "Phone", field: "phone", sortable: false },
                { label: "Table", field: "tableId", sortable: true },
                { label: "Guests", field: "guestCount", sortable: true },
                { label: "Status", field: "status", sortable: true },
                { label: "", field: "", sortable: false }
              ].map(
                (col, i) => {
                  const isSorted = searchParams.get("sort")?.startsWith(col.field + "_");
                  const sortOrder = isSorted ? searchParams.get("sort")?.split("_")[1] : null;
                  
                  return (
                    <th
                      key={i}
                      onClick={() => {
                        if (!col.sortable) return;
                        const params = new URLSearchParams(searchParams.toString());
                        const newOrder = isSorted && sortOrder === "asc" ? "desc" : "asc";
                        params.set("sort", `${col.field}_${newOrder}`);
                        router.push(`${pathname}?${params.toString()}`, { scroll: false });
                      }}
                      className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-secondary ${col.sortable ? "cursor-pointer hover:bg-primary/10 select-none" : ""}`}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {col.sortable && isSorted && (
                          sortOrder === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                        )}
                      </div>
                    </th>
                  );
                }
              )}
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-text-secondary">
                  No manager_reservations match your search or filter.
                </td>
              </tr>
            ) : (
              pageItems.map((res) => {
                const isConfirming = confirmId === res.id;
                const isCancelling = cancellingId === res.id;
                const badgeStyle = STATUS_BADGE[res.status] ?? "bg-card text-text-secondary";

                return (
                  <React.Fragment key={res.id}>
                    {/* Main data row */}
                    <tr 
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button, input, [role="menu"]')) return;
                        if (onEdit) onEdit(res.id);
                        else if (onView) onView(res.id);
                      }}
                      className="cursor-pointer hover:bg-muted/50 border-b border-border last:border-0 odd:bg-card even:bg-page transition-colors"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-[12px] text-text-secondary">
                        {formatDateTime(new Date(res.slotTime).getTime())}
                      </td>
                      <td className="px-4 py-3 font-medium text-text-primary">
                        {res.customerName}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-text-secondary">
                        {res.phone}
                      </td>
                      <td className="px-4 py-3 text-[12px] font-medium text-text-primary">
                        {res.tableId}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-text-secondary">
                        {res.guestCount}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeStyle}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 relative text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setMenuOpenId(menuOpenId === res.id ? null : res.id)}
                          className="p-1.5 rounded-md hover:bg-border/50 text-text-secondary transition-colors"
                        >
                          <Ellipsis size={16} />
                        </button>
                        
                        {menuOpenId === res.id && (
                          <div className="absolute right-8 top-10 z-10 w-36 rounded-md border border-border bg-card shadow-lg py-1 text-left">
                            {res.status === STATUS_CONFIRMED && (
                              <button
                                onClick={() => {
                                  setMenuOpenId(null);
                                  handleCancelClick(res.id);
                                }}
                                disabled={isCancelling}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger-bg disabled:opacity-50 transition-colors"
                              >
                                {isCancelling ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                                Cancel
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setMenuOpenId(null);
                                if (onEdit) onEdit(res.id);
                                else if (onView) onView(res.id);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-primary/5 transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* Inline confirm row — shown below the target row */}
                    {isConfirming && (
                      <tr className="border-b border-danger/30 bg-danger-bg">
                        <td colSpan={7} className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="text-[13px] font-medium text-danger">
                              Cancel reservation for <span className="font-bold">{res.customerName}</span>? This will free the table.
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleConfirm(res.id)}
                                className="rounded-lg bg-danger px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-danger/80 transition-colors"
                              >
                                Yes, Cancel
                              </button>
                              <button
                                onClick={handleDismiss}
                                className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold text-text-primary hover:bg-card transition-colors"
                              >
                                Keep
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
