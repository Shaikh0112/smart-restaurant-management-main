// @ts-nocheck
"use client";

// RESPONSIBILITY: All Menu CRUD logic for the Owner module.
// DATA FLOW: managerApi → useManagerMenu → ManagerMenuTable

import { useState, useCallback, useEffect } from "react";
import type { AppMenuItem, AppCombo, AppInventoryItem } from "@/types/appTypes";
import type { ManagerMenuFormValues, UseOwnerMenuReturn } from "@/app/manager/manager_types/ManagerTypes";
import { managerApi } from "../manager_api/manager_api";

export function useManagerMenu(): UseOwnerMenuReturn {
  const [menuItems, setMenuItems] = useState<AppMenuItem[]>([]);
  const [combos, setCombos] = useState<AppCombo[]>([]);
  const [inventoryItems, setInventoryItems] = useState<AppInventoryItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const tenantId = typeof window !== "undefined" ? window.localStorage.getItem("active_tenant_id") || "SUPER_ADMIN" : "SUPER_ADMIN";

  useEffect(() => {
    managerApi.getMenu(tenantId).then(res => {
      if (res.success && res.data) setMenuItems(res.data);
    });
    managerApi.getCombos(tenantId).then(res => {
      if (res.success && res.data) setCombos(res.data);
    });
    managerApi.getInventory(tenantId).then(res => {
      if (res.success && res.data) setInventoryItems(res.data);
    });
  }, [tenantId]);

  const addMenuItem = useCallback(async (values: ManagerMenuFormValues) => {
    setIsSubmitting(true);
    const res = await managerApi.createMenuItem(tenantId, values);
    if (res.success && res.data) {
      setMenuItems((prev) => [...prev, res.data as AppMenuItem]);
    }
    setIsSubmitting(false);
  }, [tenantId]);

  const updateMenuItem = useCallback(async (id: string, values: ManagerMenuFormValues) => {
    setIsSubmitting(true);
    const res = await managerApi.updateMenuItem(tenantId, id, values);
    if (res.success) {
      setMenuItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...values } : item))
      );
    }
    setIsSubmitting(false);
  }, [tenantId]);

  const deleteMenuItem = useCallback(async (id: string) => {
    const res = await managerApi.deleteMenuItem(tenantId, id);
    if (res.success) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    }
  }, [tenantId]);

  const toggleAvailability = useCallback(async (id: string) => {
    const item = menuItems.find(m => m.id === id);
    if (!item) return;
    const res = await managerApi.updateMenuItem(tenantId, id, { isAvailable: !item.isAvailable });
    if (res.success) {
      setMenuItems((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isAvailable: !m.isAvailable } : m))
      );
    }
  }, [tenantId, menuItems]);

  const saveRecipe = useCallback(async (itemId: string, recipe: AppMenuItem["recipe"]) => {
    const res = await managerApi.updateMenuItem(tenantId, itemId, { recipe });
    if (res.success) {
      setMenuItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, recipe } : item))
      );
    }
  }, [tenantId]);

  const addCombo = useCallback(async (combo: Omit<AppCombo, "id">) => {
    setIsSubmitting(true);
    const res = await managerApi.createCombo(tenantId, combo);
    if (res.success && res.data) {
      setCombos((prev) => [...prev, res.data]);
    }
    setIsSubmitting(false);
  }, [tenantId]);

  const updateCombo = useCallback(async (id: string, updates: Omit<AppCombo, "id">) => {
    setIsSubmitting(true);
    const res = await managerApi.updateCombo(tenantId, id, updates);
    if (res.success) {
      setCombos((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    }
    setIsSubmitting(false);
  }, [tenantId]);

  const deleteCombo = useCallback(async (id: string) => {
    const res = await managerApi.deleteCombo(tenantId, id);
    if (res.success) {
      setCombos((prev) => prev.filter((c) => c.id !== id));
    }
  }, [tenantId]);

  return {
    menuItems,
    combos,
    inventoryItems,
    isSubmitting,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    addCombo,
    updateCombo,
    deleteCombo,
    saveRecipe,
  };
}
