"use client";

// RESPONSIBILITY: Renders the emergency stock toggle & waste management panel for Kitchen KDS.
// Composes KitchenStockFilterBar, KitchenStockItemCard, and KitchenStockPagination.
// DATA FLOW: useKitchenStock -> KitchenStockToggle -> toggleItemAvailability / batchToggle -> UI

import React, { useState, useMemo, useEffect } from "react";
import { UtensilsCrossed } from "lucide-react";
import { useKitchenStock } from "@/app/kitchen/kitchen_hooks/useKitchenStock";
import { useKitchenStockMutations } from "@/app/kitchen/kitchen_hooks/useKitchenStockMutations";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import { showToast } from "@/lib/toastService";
import { KitchenStockFilterBar } from "./KitchenStockFilterBar";
import { KitchenStockItemCard } from "./KitchenStockItemCard";
import { KitchenStockPagination } from "./KitchenStockPagination";
import type { KitchenStockToggleProps } from "@/app/kitchen/kitchen_types/KitchenTypes";
import type { AppMenuItem, AppLowStockAlert } from "@/types/appTypes";

export function KitchenStockToggle({
  onOpenWasteLog,
  onOpenRecipe,
  initialFilter = "ALL",
}: KitchenStockToggleProps) {
  const { menuItems, togglingId, toggleItemAvailability, batchToggleAvailability } = useKitchenStock();
  
  // We'll migrate these to TanStack Query next. For now, they serve as the data source for mutations.
  const [stockAlerts] = useLocalStorage<AppLowStockAlert[]>(STORAGE_KEYS.STOCK_ALERTS, []);
  
  const { sendLowStockAlert, markFullStockReceived } = useKitchenStockMutations(stockAlerts);

  const [search, setSearch] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<"ALL" | "IN_STOCK" | "OUT_OF_STOCK">(initialFilter);
  const [selectedStation, setSelectedStation] = useState<string>("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

  // Filtered menu items calculation
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);

      const matchesStock =
        stockFilter === "ALL" ||
        (stockFilter === "IN_STOCK" && item.isAvailable) ||
        (stockFilter === "OUT_OF_STOCK" && !item.isAvailable);

      const matchesStation = selectedStation === "All" || item.station === selectedStation;

      return matchesSearch && matchesStock && matchesStation;
    });
  }, [menuItems, search, stockFilter, selectedStation]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, stockFilter, selectedStation, pageSize]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredItems.length);

  const paginatedItems = useMemo(() => {
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, startIndex, endIndex]);

  const totalCount = menuItems.length;
  const inStockCount = menuItems.filter((i) => i.isAvailable).length;
  const outOfStockCount = menuItems.filter((i) => !i.isAvailable).length;

  const handleToggle = (item: AppMenuItem) => {
    if (togglingId === item.id) return;

    toggleItemAvailability(item.id);
    const newAvailable = !item.isAvailable;

    showToast({
      type: newAvailable ? "success" : "warning",
      title: `${item.name}`,
      message: `${item.name} marked ${newAvailable ? "IN STOCK 🟢" : "OUT OF STOCK 🔴"}.`,
      actionLabel: "Undo ↩",
      onAction: () => {
        toggleItemAvailability(item.id);
        showToast({ type: "info", message: `Reverted ${item.name} availability.` });
      },
    });
  };

  const handleBatchToggle = (isAvailable: boolean) => {
    if (batchToggleAvailability) {
      batchToggleAvailability(selectedStation, isAvailable);
      showToast({
        type: isAvailable ? "success" : "warning",
        message: `Marked all ${selectedStation} items as ${isAvailable ? "IN STOCK" : "OUT OF STOCK"}.`,
      });
    }
  };

  if (menuItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-text-secondary">
        <UtensilsCrossed size={40} strokeWidth={1.5} />
        <p className="text-sm font-medium">No menu items found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <KitchenStockFilterBar
        search={search}
        setSearch={setSearch}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
        onOpenWasteLog={onOpenWasteLog}
        totalCount={totalCount}
        inStockCount={inStockCount}
        outOfStockCount={outOfStockCount}
        handleBatchToggle={handleBatchToggle}
      />

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 rounded-2xl border border-border bg-card text-text-muted">
          <UtensilsCrossed size={32} strokeWidth={1.5} />
          <p className="text-sm font-medium">No items match your filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paginatedItems.map((item) => (
            <KitchenStockItemCard
              key={item.id}
              item={item}
              togglingId={togglingId}
              stockAlerts={stockAlerts}
              onToggle={handleToggle}
              onOpenRecipe={onOpenRecipe}
              onSendLowStockAlert={(item) => sendLowStockAlert(item)}
              onMarkFullStockReceived={(item) => {
                markFullStockReceived(item);
                if (!item.isAvailable) toggleItemAvailability(item.id);
              }}
            />
          ))}
        </div>
      )}

      <KitchenStockPagination
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={filteredItems.length}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={validCurrentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
