"use client";

// RESPONSIBILITY: Inventory data table with inline stock editing, status badges,
// and expiry date color coding. Click-to-edit pattern (Pattern 5k) for currentStock.
// Pure display component --- no localStorage access.
// DATA FLOW: useAdminInventory --- admin/inventory/page.tsx --- AdminInventoryTable --- UI

import { useState, useMemo } from "react";
import { Search, Filter, Trash } from "lucide-react";
import { AppPagination } from "@/components/ui/AppPagination";
import type { AppInventoryItem } from "@/types/appTypes";
import { StatusBadge, EditableStockCell, EditableExpiryCell, type StockStatus, getStockStatus, getExpiryClass } from "./AdminInventoryTableCells";
import type { AdminInventoryTableProps } from "@/app/admin/admin_types/AdminTypes";
import { AdminActionDialog } from "@/app/admin/admin_components/AdminActionDialog";

// --------- Constants (Rule 35: No magic strings) ------------------------------------------------------------------------------------------------------------

const MS_PER_DAY          = 86_400_000 as const;
const EXPIRY_DANGER_DAYS  = 0          as const; // already expired
const EXPIRY_WARNING_DAYS = 3          as const;

// --------- Main Component ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Inventory data table with inline stock editing and status/expiry color coding.
 * Click pencil icon on any stock cell to edit inline.
 */
export function AdminInventoryTable({ inventoryItems, onUpdateStock, onDelete, onUpdateExpiry }: AdminInventoryTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Filter inventory items by search & status
  const filtered = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.unit.toLowerCase().includes(search.toLowerCase());
      const status = getStockStatus(item);
      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inventoryItems, search, statusFilter]);

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

  if (inventoryItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-text-secondary">
        <p className="text-sm">No inventory items found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Status Filter Controls Bar */}
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
            placeholder="Search ingredient or unit..."
            className="w-full rounded-lg border border-border bg-input py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-disabled focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {/* Status Filter Tabs / Dropdown */}
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-text-disabled" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-border bg-input px-3 py-1.5 text-xs font-semibold text-text-primary focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="ALL">All Stock Status</option>
            <option value="OK">OK Stock</option>
            <option value="LOW">Low Stock Warning</option>
            <option value="EXPIRED">Expired Items</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border bg-primary/5">
            {["Ingredient", "Current Stock", "Threshold", "Expiry Date", "Status", "Actions"].map((h) => (
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
          {pageItems.map((item) => {
            const status      = getStockStatus(item);
            const expiryClass = getExpiryClass(item.expiryDate);
            return (
              <tr
                key={item.id}
                className="border-b border-border last:border-0 odd:bg-card even:bg-page hover:bg-primary/5 motion-safe:transition-colors"
              >
                <td className="px-4 py-3 text-[13px] font-medium text-text-primary">
                  {item.name}
                </td>
                <td className="px-4 py-3">
                  <EditableStockCell
                    itemId={item.id}
                    currentStock={item.currentStock}
                    unit={item.unit}
                    onSave={onUpdateStock}
                  />
                </td>
                <td className="px-4 py-3 text-[12px] text-text-secondary">
                  {item.threshold} {item.unit}
                </td>
                <td className={`px-4 py-3 text-[12px] ${expiryClass}`}>
                  <EditableExpiryCell
                    itemId={item.id}
                    expiryDate={item.expiryDate}
                    onSave={onUpdateExpiry}
                    isEditable={expiryClass !== "text-text-secondary"}
                  />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={status} />
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDeleteClick(item.id, item.name)} className="text-danger hover:text-danger/80">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
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
      {deleteTarget && (
        <AdminActionDialog
          itemName={deleteTarget.name}
          title="Delete Item"
          actionWord="DELETE"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
