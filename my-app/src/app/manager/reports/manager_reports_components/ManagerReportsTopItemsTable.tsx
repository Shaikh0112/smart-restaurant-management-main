// @ts-nocheck
﻿"use client";

// RESPONSIBILITY: Renders the top-selling items data table with rank badges and pagination.
// Receives pre-sorted topItems array via props — no data fetching or sorting logic.
// DATA FLOW: useManagerReports → manager_reports/page.tsx → ManagerReportsTopItemsTable

import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { AppPagination } from "@/components/ui/AppPagination";
import type { ManagerReportsTopItemsTableProps } from "@/app/manager/reports/manager_reports_types/ManagerReportsTypes";

// ─── Constants (Rule 35: No magic strings / numbers) ─────────────────────────

const RANK_STYLES: Record<number, string> = {
  1: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  2: "bg-slate-400/20 text-slate-300 border border-slate-400/30",
  3: "bg-orange-600/20 text-orange-400 border border-orange-600/30",
} as const;

const RANK_LABELS: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
} as const;

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Searchable, filterable, and paginated table of top-selling menu items.
 * Top 3 rows show gold/silver/bronze rank badges.
 * Columns: Rank | Item Name | Category | Qty Sold | Revenue
 *
 * @param topItems - Pre-sorted array of ManagerReportsTopItem from useManagerReports
 */
export function ManagerReportsTopItemsTable({ topItems }: ManagerReportsTopItemsTableProps) {
  const [search, setSearch] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const sortParam = searchParams.get("sort") || "totalRevenue_desc";
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

  // Extract unique categories for filter dropdown
  const categories = useMemo(() => {
    const set = new Set<string>();
    topItems.forEach((i) => set.add(i.category));
    return Array.from(set);
  }, [topItems]);

  // Filter items by search & category and apply sorting
  const filtered = useMemo(() => {
    const sorted = [...topItems].sort((a, b) => {
      const valA = a[sortKey as keyof typeof a];
      const valB = b[sortKey as keyof typeof b];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "ALL" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [topItems, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  // ── Empty state ────────────────────────────────────────────────────────────
  if (topItems.length === 0) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-text-secondary">
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
        <p className="text-[12px] font-semibold uppercase tracking-wide text-text-secondary">
          Top Selling Items
        </p>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative w-full sm:w-48">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-disabled" />
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
          <div className="flex items-center gap-1">
            <Filter size={14} className="text-text-disabled" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-md border border-border bg-input px-2 py-1.5 text-xs font-medium text-text-primary focus:border-border-focus focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table — horizontally scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {[
                { label: "Rank", key: "" },
                { label: "Item Name", key: "name" },
                { label: "Category", key: "category", extraClass: "hidden sm:table-cell" },
                { label: "Qty Sold", key: "totalQty", extraClass: "text-right" },
                { label: "Revenue", key: "totalRevenue", extraClass: "text-right" },
              ].map(({ label, key, extraClass }) => (
                <th
                  key={label}
                  onClick={() => { if (key) handleSort(key); }}
                  className={`pb-2 text-[11px] font-semibold uppercase tracking-wide text-text-secondary ${extraClass || "text-left"} ${key ? "cursor-pointer hover:bg-primary/10 select-none" : ""}`}
                >
                  <div className={`flex items-center gap-1 ${extraClass?.includes("text-right") ? "justify-end" : ""}`}>
                    {label}
                    {key && sortKey === key && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
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
                    onClick={() => {}}
                    className="border-b border-border/50 last:border-0 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 pr-3">
                      {rankStyle !== undefined ? (
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-[12px] font-bold ${rankStyle}`}
                        >
                          {rankLabel} {globalRank}
                        </span>
                      ) : (
                        <span className="text-[13px] font-medium text-text-secondary">
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
