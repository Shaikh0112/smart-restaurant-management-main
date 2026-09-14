"use client";

// RESPONSIBILITY: Renders the menu items data table for the Admin Menu CRUD page.
// Columns: Name | Category | Station | Price | Variants | Available | Actions.
// Row actions: Edit, Delete (with "Type DELETE" confirm dialog), Toggle availability.
// Pure display component --- no localStorage access, no calculations.
// DATA FLOW: useAdminMenu --- admin/menu/page.tsx --- AdminMenuTable --- UI
import { useState, useMemo } from "react";
import { Pencil, Trash2, CheckCircle, XCircle, Search, Filter } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { AppPagination } from "@/components/ui/AppPagination";
import type { AppMenuItem } from "@/types/appTypes";
import type { AdminMenuTableProps } from "@/app/admin/admin_types/AdminTypes";

// --------- Constants (Rule 35: No magic strings) ------------------------------------------------------------------------------------------------------------

const DELETE_CONFIRM_WORD = "DELETE" as const;

// --------- Sub-components ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

import { AdminActionDialog } from "@/app/admin/admin_components/AdminActionDialog";
import { AdminMenuTableRow } from "./AdminMenuTableRow";

// --------- Main Component ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Menu items data table with edit, delete, and availability toggle actions.
 * Delete requires typing "DELETE" to confirm (Rule 13.2 --- sensitive action guard).
 */
export function AdminMenuTable({
  menuItems,
  onEdit,
  onDelete,
  onToggleAvailability,
}: AdminMenuTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [search, setSearch] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [stationFilter, setStationFilter] = useState<string>("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    menuItems.forEach((i) => set.add(i.category));
    return Array.from(set);
  }, [menuItems]);

  // Filter items by search, category, station, and availability
  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "ALL" || item.category === categoryFilter;
      const matchesStation =
        stationFilter === "ALL" || item.station === stationFilter;
      const matchesAvailability =
        availabilityFilter === "ALL" ||
        (availabilityFilter === "AVAILABLE" ? item.isAvailable : !item.isAvailable);

      return matchesSearch && matchesCategory && matchesStation && matchesAvailability;
    });
  }, [menuItems, search, categoryFilter, stationFilter, availabilityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function handleDeleteClick(id: string, name: string) {
    setDeleteTarget({ id, name });
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    onDelete(deleteTarget.id, deleteTarget.name);
    setDeleteTarget(null);
  }

  // ------ Empty state ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  if (menuItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-text-secondary">
        <p className="text-sm font-medium">No menu items found</p>
        <p className="text-[12px]">Click &quot;+ Add Item&quot; to create the first item</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Contextual Filter Controls Bar */}
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
            placeholder="Search dish or category..."
            className="w-full rounded-lg border border-border bg-input py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-disabled focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <Filter size={13} className="text-text-disabled" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-border bg-input px-2.5 py-1.5 text-xs font-semibold text-text-primary focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Station Filter */}
          <select
            value={stationFilter}
            onChange={(e) => {
              setStationFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-border bg-input px-2.5 py-1.5 text-xs font-semibold text-text-primary focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="ALL">All Stations</option>
            <option value="Kitchen">Main Kitchen</option>
            <option value="Bar">Bar / Drinks</option>
            <option value="Bakery">Bakery / Desserts</option>
          </select>

          {/* Availability Filter */}
          <select
            value={availabilityFilter}
            onChange={(e) => {
              setAvailabilityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-border bg-input px-2.5 py-1.5 text-xs font-semibold text-text-primary focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="ALL">All Availability</option>
            <option value="AVAILABLE">Available Only</option>
            <option value="UNAVAILABLE">Unavailable Only</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-primary/5">
              {["Name", "Category", "Station", "Price", "Variants", "Available", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-secondary"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item) => (
              <AdminMenuTableRow
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDeleteClick={handleDeleteClick}
                onToggleAvailability={onToggleAvailability}
              />
            ))}
          </tbody>
        </table>
      </div>

      <AppPagination
        currentPage={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={menuItems.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
      />

      {deleteTarget && (
        <AdminActionDialog
          itemName={deleteTarget.name}
          title="Delete Menu Item"
          actionWord="DELETE"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
