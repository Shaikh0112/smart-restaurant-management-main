// @ts-nocheck
"use client";

// RESPONSIBILITY: Inventory data table with inline stock editing, status badges,
// and expiry date color coding. Click-to-edit pattern (Pattern 5k) for currentStock.
// Pure display component — no localStorage access.
// DATA FLOW: useManagerInventory → admin/inventory/page.tsx → ManagerInventoryTable → UI

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Pencil, Search, Filter, Trash, PackageX, Ellipsis, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ManagerEmptyState } from "@/app/manager/manager_components/ManagerEmptyState";
import { AppPagination } from "@/components/ui/AppPagination";
import type { AppInventoryItem } from "@/types/appTypes";
import type { ManagerInventoryTableProps } from "@/app/manager/manager_types/ManagerTypes";

// ─── Constants (Rule 35: No magic strings) ────────────────────────────────────

const MS_PER_DAY          = 86_400_000 as const;
const EXPIRY_DANGER_DAYS  = 0          as const; // already expired
const EXPIRY_WARNING_DAYS = 3          as const;

// ─── Pure Helpers ─────────────────────────────────────────────────────────────

type StockStatus = "OK" | "LOW" | "EXPIRED";

function getStockStatus(item: AppInventoryItem): StockStatus {
  const today = new Date().toISOString().slice(0, 10);
  if (item.expiryDate < today) return "EXPIRED";
  if (item.currentStock < item.threshold) return "LOW";
  return "OK";
}

function getExpiryClass(expiryDate: string): string {
  const today      = new Date().toISOString().slice(0, 10);
  const cutoff     = new Date(Date.now() + EXPIRY_WARNING_DAYS * MS_PER_DAY)
    .toISOString()
    .slice(0, 10);

  if (expiryDate < today)   return "text-danger font-semibold";
  if (expiryDate <= cutoff) return "text-warning font-semibold";
  return "text-text-secondary";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// RESPONSIBILITY: Status badge for a single inventory row.
function StatusBadge({ status }: { status: StockStatus }) {
  const styles: Record<StockStatus, string> = {
    OK:      "bg-success-bg text-success",
    LOW:     "bg-warning-bg text-warning",
    EXPIRED: "bg-danger-bg text-danger",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${styles[status]}`}>
      {status === "OK" ? "Fresh" : status === "LOW" ? "Low Stock" : "Expired"}
    </span>
  );
}

// RESPONSIBILITY: Inline editable stock qty cell — click pencil to edit, check to save.
interface EditableCellProps {
  itemId:        string;
  currentStock:  number;
  unit:          string;
  onSave:        (id: string, qty: number) => void;
}

function EditableStockCell({ itemId, currentStock, unit, onSave }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState<string>(String(currentStock));

  function handleSave() {
    const parsed = parseFloat(draft);
    if (!isNaN(parsed) && parsed >= 0) onSave(itemId, parsed);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          type="number"
          min={0}
          step={0.1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-20 rounded-lg border border-border-focus bg-input px-2 py-1 text-[12px] text-text-primary focus:outline-none"
        />
        <span className="text-[11px] text-text-secondary">{unit}</span>
        <button
          onClick={handleSave}
          className="rounded-lg p-1 text-success hover:bg-success-bg transition-colors"
          aria-label="Save stock"
        >
          <Check size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      <span className="text-[13px] font-medium text-text-primary">
        {currentStock} {unit}
      </span>
      <button
        onClick={() => { setDraft(String(currentStock)); setEditing(true); }}
        className="rounded p-0.5 text-text-disabled hover:text-text-secondary transition-colors"
        aria-label="Edit stock"
      >
        <Pencil size={11} />
      </button>
    </div>
  );
}

// Editable expiry date cell – click pencil to edit when near expiry
interface EditableExpiryProps {
  itemId: string;
  expiryDate: string; // YYYY-MM-DD
  onSave: (id: string, newDate: string) => void;
  isEditable: boolean;
}
function EditableExpiryCell({ itemId, expiryDate, onSave, isEditable }: EditableExpiryProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string>(expiryDate);

  function handleSave() {
    if (draft) onSave(itemId, draft);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <input
          type="date"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="rounded-lg border border-border-focus bg-input px-2 py-1 text-[12px]"
        />
        <button
          onClick={handleSave}
          className="rounded-lg p-1 text-success hover:bg-success-bg transition-colors"
          aria-label="Save expiry"
        >
          <Check size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      <span className="text-[12px]">{expiryDate}</span>
      {isEditable && (
        <button
          onClick={() => setEditing(true)}
          className="rounded p-0.5 text-text-disabled hover:text-text-secondary transition-colors"
          aria-label="Edit expiry"
        >
          <Pencil size={11} />
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Inventory data table with inline stock editing and status/expiry color coding.
 * Click pencil icon on any stock cell to edit inline.
 */
export function ManagerInventoryTable({ inventoryItems, onUpdateStock, onDelete, onUpdateExpiry, onEdit }: ManagerInventoryTableProps & { onEdit?: (item: AppInventoryItem) => void }) {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentPage = Number(searchParams.get("page")) || 1;
  const sortParam = searchParams.get("sort") || "name_asc";
  const [sortField, sortOrder] = sortParam.split("_");
  
  const setCurrentPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", `${field}_${newOrder}`);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [pageSize, setPageSize] = useState<number>(10);

  // Close menu on click outside
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Filter & Sort inventory items
  const filtered = useMemo(() => {
    let result = inventoryItems.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.unit.toLowerCase().includes(search.toLowerCase());
      const status = getStockStatus(item);
      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result = result.sort((a, b) => {
      let aValue: any = a[sortField as keyof AppInventoryItem];
      let bValue: any = b[sortField as keyof AppInventoryItem];

      if (sortField === "status") {
        aValue = getStockStatus(a);
        bValue = getStockStatus(b);
      } else if (sortField === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [inventoryItems, search, statusFilter, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  if (inventoryItems.length === 0) {
    return (
      <ManagerEmptyState
        title="No inventory items found"
        description="Your inventory is currently empty."
        icon={PackageX}
      />
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
            className="w-full rounded-lg border border-border bg-input py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-disabled focus:border-border-focus focus:outline-none"
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
            className="rounded-lg border border-border bg-input px-3 py-1.5 text-xs font-semibold text-text-primary focus:border-border-focus focus:outline-none"
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
            {[
              { key: "name", label: "Ingredient", sortable: true },
              { key: "currentStock", label: "Current Stock", sortable: true },
              { key: "threshold", label: "Threshold", sortable: true },
              { key: "expiryDate", label: "Expiry Date", sortable: true },
              { key: "status", label: "Status", sortable: true },
              { key: "actions", label: "Actions", sortable: false },
            ].map((h) => (
              <th
                key={h.key}
                onClick={() => h.sortable && handleSort(h.key)}
                className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-secondary ${h.sortable ? 'cursor-pointer hover:text-text-primary select-none' : ''}`}
              >
                <div className="flex items-center gap-1">
                  {h.label}
                  {h.sortable && sortField === h.key && (
                    sortOrder === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageItems.map((item, index) => {
            const status      = getStockStatus(item);
            const expiryClass = getExpiryClass(item.expiryDate);
            return (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button, input, [role="menu"]')) return;
                  if (onEdit) onEdit(item);
                }}
                className="border-b border-border last:border-0 odd:bg-card even:bg-page hover:bg-muted/50 transition-colors cursor-pointer relative"
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
                <td className="px-4 py-3 relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === item.id ? null : item.id);
                    }}
                    className="rounded p-1 text-text-secondary hover:bg-primary/10 transition-colors"
                    aria-label="Actions"
                  >
                    <Ellipsis size={16} />
                  </button>
                  {openMenuId === item.id && (
                    <div className="absolute right-4 top-10 z-10 w-32 rounded-lg border border-border bg-card shadow-lg flex flex-col py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id, item.name);
                          setOpenMenuId(null);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-danger hover:bg-danger-bg text-left transition-colors"
                      >
                        <Trash size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </motion.tr>
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
    </div>
  );
}
