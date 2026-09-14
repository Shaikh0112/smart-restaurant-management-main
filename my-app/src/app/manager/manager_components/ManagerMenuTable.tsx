// @ts-nocheck
﻿"use client";

// RESPONSIBILITY: Renders the menu items data table for the Owner Menu CRUD page.
// Columns: Name | Category | Station | Price | Variants | Available | Actions.
// Row actions: Edit, Delete (with "Type DELETE" confirm dialog), Toggle availability.
// Pure display component — no localStorage access, no calculations.
// DATA FLOW: useManagerMenu → admin/menu/page.tsx → ManagerMenuTable → UI
import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, CheckCircle, XCircle, Search, Filter, UtensilsCrossed, Ellipsis, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ManagerEmptyState } from "@/app/manager/manager_components/ManagerEmptyState";
import { formatCurrency } from "@/lib/formatters";
import { AppPagination } from "@/components/ui/AppPagination";
import type { AppMenuItem } from "@/types/appTypes";
import type { ManagerMenuTableProps } from "@/app/manager/manager_types/ManagerTypes";

// ─── Constants (Rule 35: No magic strings) ────────────────────────────────────

const DELETE_CONFIRM_WORD = "DELETE" as const;
const STATION_COLORS = {
  Kitchen: "bg-info-bg text-info",
  Bar:     "bg-pay-upi-bg text-pay-upi",
  Bakery:  "bg-warning-bg text-warning",
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

// RESPONSIBILITY: Delete confirmation dialog — requires typing "DELETE" to confirm.
interface DeleteDialogProps {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteDialog({ itemName, onConfirm, onCancel }: DeleteDialogProps) {
  const [input, setInput] = useState<string>("");
  const isConfirmed = input === DELETE_CONFIRM_WORD;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <div
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-card border border-border p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-bold text-text-primary">Delete Menu Item</h3>
          <p className="text-[13px] text-text-secondary">
            This will permanently delete <span className="font-semibold text-text-primary">{itemName}</span>.
            Type <span className="font-mono font-bold text-danger">DELETE</span> to confirm.
          </p>
        </div>
        <input
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type DELETE"
          className="rounded-lg border border-border bg-input px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled focus:border-border-focus focus:outline-none font-mono"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-border px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:bg-page transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!isConfirmed}
            onClick={onConfirm}
            className="rounded-lg bg-danger px-3 py-1.5 text-[13px] font-medium text-white hover:bg-danger-hover disabled:opacity-40 transition-colors"
          >
            Delete Item
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Menu items data table with edit, delete, and availability toggle actions.
 * Delete requires typing "DELETE" to confirm (Rule 13.2 — sensitive action guard).
 */
export function ManagerMenuTable({
  menuItems,
  onEdit,
  onDelete,
  onToggleAvailability,
}: ManagerMenuTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [search, setSearch] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [stationFilter, setStationFilter] = useState<string>("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("ALL");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentSort = searchParams.get("sort") || "";
  
  const setCurrentPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  
  const handleSort = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const isAsc = currentSort === `${key}_asc`;
    params.set("sort", isAsc ? `${key}_desc` : `${key}_asc`);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [pageSize, setPageSize] = useState<number>(10);

  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: string }) => {
    const isActive = currentSort.startsWith(sortKey);
    const isAsc = currentSort === `${sortKey}_asc`;
    return (
      <th
        onClick={() => handleSort(sortKey)}
        className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-secondary cursor-pointer hover:text-text-primary transition-colors select-none group"
      >
        <div className="flex items-center gap-1">
          {label}
          {isActive ? (
            isAsc ? <ArrowUp size={12} /> : <ArrowDown size={12} />
          ) : (
            <ArrowUp size={12} className="opacity-0 group-hover:opacity-30" />
          )}
        </div>
      </th>
    );
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    menuItems.forEach((i) => set.add(i.category));
    return Array.from(set);
  }, [menuItems]);

  // Filter and sort items
  const filtered = useMemo(() => {
    let result = menuItems.filter((item) => {
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

    if (currentSort) {
      const [key, dir] = currentSort.split("_");
      const mult = dir === "desc" ? -1 : 1;
      result = [...result].sort((a, b) => {
        if (key === "name") return a.name.localeCompare(b.name) * mult;
        if (key === "category") return a.category.localeCompare(b.category) * mult;
        if (key === "station") return a.station.localeCompare(b.station) * mult;
        if (key === "price") return (a.price - b.price) * mult;
        if (key === "variants") return (a.variants.length - b.variants.length) * mult;
        if (key === "available") return (Number(a.isAvailable) - Number(b.isAvailable)) * mult;
        return 0;
      });
    }

    return result;
  }, [menuItems, search, categoryFilter, stationFilter, availabilityFilter, currentSort]);

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

  // ── Empty state ────────────────────────────────────────────────────────────
  if (menuItems.length === 0) {
    return (
      <ManagerEmptyState
        title="No menu items found"
        description="Click '+ Add Item' to create the first item in your menu."
        icon={UtensilsCrossed}
      />
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
            className="w-full rounded-lg border border-border bg-input py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-disabled focus:border-border-focus focus:outline-none"
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
              className="rounded-lg border border-border bg-input px-2.5 py-1.5 text-xs font-semibold text-text-primary focus:border-border-focus focus:outline-none"
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
            className="rounded-lg border border-border bg-input px-2.5 py-1.5 text-xs font-semibold text-text-primary focus:border-border-focus focus:outline-none"
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
            className="rounded-lg border border-border bg-input px-2.5 py-1.5 text-xs font-semibold text-text-primary focus:border-border-focus focus:outline-none"
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
              <SortableHeader label="Name" sortKey="name" />
              <SortableHeader label="Category" sortKey="category" />
              <SortableHeader label="Station" sortKey="station" />
              <SortableHeader label="Price" sortKey="price" />
              <SortableHeader label="Variants" sortKey="variants" />
              <SortableHeader label="Available" sortKey="available" />
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-secondary text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item, index) => {
              const stationStyle = STATION_COLORS[item.station] ?? "bg-card text-text-secondary";
              return (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button, input, [role="menu"]')) return;
                    onEdit(item);
                  }}
                  className="group border-b border-border last:border-0 odd:bg-card even:bg-page hover:bg-muted/50 transition-colors cursor-pointer relative"
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-text-primary">{item.name}</p>
                    {item.isSpecial && (
                      <span className="text-[10px] font-semibold text-warning">★ Special</span>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{item.category}</td>

                  {/* Station */}
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${stationStyle}`}>
                      {item.station}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-[13px] font-medium text-text-primary">
                    {formatCurrency(item.price)}
                  </td>

                  {/* Variants */}
                  <td className="px-4 py-3 text-[12px] text-text-secondary">
                    {item.variants.length > 0
                      ? item.variants.map((v) => v.name).join(", ")
                      : "—"}
                  </td>

                  {/* Available toggle */}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleAvailability(item.id)}
                      aria-label={item.isAvailable ? "Mark unavailable" : "Mark available"}
                      className="flex items-center gap-1 text-[12px] font-medium transition-opacity hover:opacity-70"
                    >
                      {item.isAvailable ? (
                        <>
                          <CheckCircle size={15} className="text-success" />
                          <span className="text-success">Yes</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={15} className="text-danger" />
                          <span className="text-danger">No</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="relative flex justify-end" ref={openMenuId === item.id ? menuRef : null}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                        className="rounded-lg p-1.5 text-text-secondary hover:bg-primary/10 hover:text-text-primary transition-colors"
                      >
                        <Ellipsis size={16} />
                      </button>
                      
                      {openMenuId === item.id && (
                        <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-xl border border-border bg-card p-1 shadow-xl">
                          <button
                            onClick={() => {
                              onEdit(item);
                              setOpenMenuId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-text-primary hover:bg-primary/5 transition-colors"
                          >
                            <Pencil size={14} className="text-text-secondary" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteClick(item.id, item.name);
                              setOpenMenuId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-danger hover:bg-danger-bg transition-colors"
                          >
                            <Trash2 size={14} className="text-danger" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
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
        totalItems={menuItems.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
      />

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <DeleteDialog
          itemName={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
