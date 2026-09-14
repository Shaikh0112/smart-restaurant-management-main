// @ts-nocheck
"use client";

// RESPONSIBILITY: All inventory management logic for the Manager module.
// DATA FLOW: localStorage → useManagerInventory → ManagerInventoryTable

import { useState, useMemo, useCallback, useEffect } from "react";
import type { AppInventoryItem, FetchState } from "@/types/appTypes";
import type { UseOwnerInventoryReturn } from "@/app/manager/manager_types/ManagerTypes";
import { useLocalStorage, getActiveTenantId } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";

const MS_PER_DAY          = 86_400_000 as const;
const EXPIRY_WARNING_DAYS = 3          as const;

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

export function useManagerInventory(): UseOwnerInventoryReturn {
  const [inventoryItems, setInventoryItems] = useLocalStorage<AppInventoryItem[]>(
    STORAGE_KEYS.INVENTORY,
    []
  );

  const lowStockItems = useMemo(
    () => inventoryItems.filter((item) => item.currentStock < item.threshold),
    [inventoryItems]
  );

  const expiringItems = useMemo(() => {
    const now         = Date.now();
    const cutoffMs    = now + EXPIRY_WARNING_DAYS * MS_PER_DAY;
    const cutoffDate  = new Date(cutoffMs).toISOString().slice(0, 10);
    const todayDate   = new Date(now).toISOString().slice(0, 10);
    return inventoryItems.filter(
      (item) => item.expiryDate >= todayDate && item.expiryDate <= cutoffDate
    );
  }, [inventoryItems]);

  const updateStock = useCallback(
    async (id: string, newQty: number) => {
      setInventoryItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, currentStock: newQty } : item
        )
      );
    },
    [setInventoryItems]
  );

  const deleteInventoryItem = useCallback(
    async (id: string) => {
      setInventoryItems((prev) => prev.filter((item) => item.id !== id));
    },
    [setInventoryItems]
  );

  const updateExpiryDate = useCallback(
    async (id: string, newDate: string) => {
      setInventoryItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, expiryDate: newDate } : item
        )
      );
    },
    [setInventoryItems]
  );

  const addInventoryItem = useCallback(async (itemData: Omit<AppInventoryItem, "id">) => {
    setInventoryItems((prev) => [
      ...prev,
      {
        id: generateId("inv"),
        ...itemData,
      } as AppInventoryItem,
    ]);
  }, [setInventoryItems]);

  return {
    inventoryItems,
    lowStockItems,
    expiringItems,
    updateStock,
    addInventoryItem,
    deleteInventoryItem,
    updateExpiryDate,
  };
}
