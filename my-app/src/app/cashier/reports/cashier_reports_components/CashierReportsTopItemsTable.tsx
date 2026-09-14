// @ts-nocheck
﻿"use client";

// RESPONSIBILITY: Renders the top-selling items data table with rank badges and pagination.
// Receives pre-sorted topItems array via props — no data fetching or sorting logic.
// DATA FLOW: useCashierReports → cashier_reports/page.tsx → CashierReportsTopItemsTable

import { useState, useMemo, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Filter, ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { AppPagination } from "@/components/ui/AppPagination";
import { SearchableDropdown } from "@/components/ui/SearchableDropdown";
import type { CashierReportsTopItemsTableProps } from "@/app/cashier/reports/cashier_reports_types/CashierReportsTypes";

// ─── Constants (Rule 35: No magic strings / numbers) ─────────────────────────

const RANK_STYLES: Record<number, string> = {
  1: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  2: "bg-slate-400/20 text-slate-300 border border-slate-400/30",
  3: "bg-orange-600/20 text-orange-400 border border-orange-600/30",
} as const;

const RANK_LABELS: Record<number, string> = {
  1: "",
  2: "",
  3: "",
} as const;

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Searchable, filterable, and paginated table of top-selling menu items.
 * Top 3 rows show gold/silver/bronze rank badges.
 * Columns: Rank | Item Name | Category | Qty Sold | Revenue
 *
 * @param topItems - Pre-sorted array of CashierReportsTopItem from useCashierReports
 */
export function CashierReportsTopItemsTable({ topItems }: CashierReportsTopItemsTableProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "ALL";
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;
  const sortKey = (searchParams.get("sort") || "totalRevenue") as "name" | "totalQty" | "totalRevenue";
  const sortOrder = (searchParams.get("order") || "desc") as "asc" | "desc";

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL" && value !== "1" && value !== "10" && value !== "totalRevenue" && value !== "desc") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const setSearch = (val: string) => updateParam("search", val);
  const setCategoryFilter = (val: string) => updateParam("category", val);
  const setCurrentPage = (val: number) => updateParam("page", val.toString());
  const setPageSize = (val: number) => updateParam("limit", val.toString());
  const handleSort = (key: "name" | "totalQty" | "totalRevenue") => {
    if (sortKey === key) {
      updateParam("order", sortOrder === "asc" ? "desc" : "asc");
    } else {
      updateParam("sort", key);
      updateParam("order", "desc");
    }
  };

  const SortIcon = ({ column }: { column: "name" | "totalQty" | "totalRevenue" }) => {
    if (sortKey !== column) return null;
    return sortOrder === "asc" ? <ArrowUp className="inline ml-1 h-3 w-3" /> : <ArrowDown className="inline ml-1 h-3 w-3" />;
  };

  // Extract unique categories for filter dropdown
  const categories = useMemo(() => {
    const set = new Set<string>();
    topItems.forEach((i) => set.add(i.category));
    return Array.from(set);
  }, [topItems]);

  // Filter items by search & category
  const filtered = useMemo(() => {
    let result = topItems.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "ALL" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [topItems, search, categoryFilter, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  // ── Empty state ────────────────────────────────────────────────────────────
  if (topItems.length === 0) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Top Selling Items
        </p>
        <div className="flex flex-col items-center gap-2 py-10 text-text-secondary">
          <p className="text-sm">No sales data for this period</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      {/* Header & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Top Selling Items
        </p>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative w-full sm:w-48">
            <Search size={18} strokeWidth={2} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-disabled" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search items..."
              className="w-full rounded-md border border-border bg-input py-1.5 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-disabled focus:border-border-focus focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1 w-[200px]">
            <Filter size={18} strokeWidth={2} className="text-text-disabled" />
            <SearchableDropdown
              value={categoryFilter}
              onChange={(val) => {
                setCategoryFilter(val);
                setCurrentPage(1);
              }}
              options={[
                { value: "ALL", label: "All Categories" },
                ...categories.map(c => ({ value: c, label: c }))
              ]}
            />
          </div>
        </div>
      </div>

      {/* Table — horizontally scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Rank
              </th>
              <th 
                className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary cursor-pointer select-none hover:text-primary motion-safe:transition-colors"
                onClick={() => handleSort("name")}
              >
                Item Name <SortIcon column="name" />
              </th>
              <th className="hidden pb-2 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary sm:table-cell">
                Category
              </th>
              <th 
                className="pb-2 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary cursor-pointer select-none hover:text-primary motion-safe:transition-colors"
                onClick={() => handleSort("totalQty")}
              >
                Qty Sold <SortIcon column="totalQty" />
              </th>
              <th 
                className="pb-2 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary cursor-pointer select-none hover:text-primary motion-safe:transition-colors"
                onClick={() => handleSort("totalRevenue")}
              >
                Revenue <SortIcon column="totalRevenue" />
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-text-secondary">
                  No items match search or category filter.
                </td>
              </tr>
            ) : (
              pageItems.map((item, idx) => {
                const globalRank = (safePage - 1) * pageSize + idx + 1;
                const rankStyle = RANK_STYLES[globalRank];
                const rankLabel = RANK_LABELS[globalRank];

                return (
                  <tr
                    key={item.itemId}
                    className="border-b border-border/50 last:border-0 hover:bg-primary-subtle/30"
                  >
                    <td className="py-3 pr-3">
                      {rankStyle !== undefined ? (
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold ${rankStyle}`}
                        >
                          {rankLabel} {globalRank}
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-text-secondary">
                          {globalRank}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-3 font-medium text-text-primary">{item.name}</td>
                    <td className="hidden py-3 pr-3 text-text-secondary sm:table-cell">
                      {item.category}
                    </td>
                    <td className="py-3 pr-3 text-right text-text-primary">{item.totalQty}</td>
                    <td className="py-3 text-right font-semibold text-text-primary">
                      {formatCurrency(item.totalRevenue)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AppPagination
        currentPage={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filtered.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
      />
    </div>
  );
}
