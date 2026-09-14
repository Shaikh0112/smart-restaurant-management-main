// @ts-nocheck
"use client";

// RESPONSIBILITY: All Customer QR Self-Ordering logic.
// Now migrated to Server State Architecture using TanStack Query.

import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchCustomerMenu, 
  fetchActiveOrder, 
  submitCustomerOrder, 
  submitCustomerFeedback 
} from "@/app/customer/customer_api/customerOrder.api";
import type { AppMenuItem, AppOrder, AppFeedback } from "@/types/appTypes";
import type {
  CustomerCartItem,
  CustomerPageView,
  UseCustomerOrderReturn,
} from "@/app/customer/customer_types/CustomerTypes";

const STATUS_POLL_INTERVAL_MS = 3_000 as const;
const STATUS_COMPLETED        = "COMPLETED" as const;

function readTableParam(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get("table") ?? "";
}

function deriveOrderPhase(order: AppOrder): "RECEIVED" | "COOKING" | "READY" {
  const allItems = order.kots.flatMap((k) => k.items);
  const visible  = allItems.filter((i) => i.status !== "VOIDED");
  if (visible.length === 0) return "RECEIVED";
  const allReady   = visible.every((i) => i.status === "READY");
  const anyCooking = visible.some((i) => i.status === "COOKING");
  if (allReady) return "READY";
  if (anyCooking) return "COOKING";
  return "RECEIVED";
}

export function useCustomerOrder(): UseCustomerOrderReturn {
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  const [tableNumber, setTableNumber] = useState<string>("");
  const [pageView, setPageView] = useState<CustomerPageView>("MENU");
  const [cart, setCart] = useState<CustomerCartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTableNumber(readTableParam());
  }, []);

  // Use a hardcoded tenant for now as per previous behavior, or extract from URL if needed.
  // In a real app this would come from a context or domain parsing.
  const tenantId = "default_tenant"; 

  // Server State: Menu
  const { data: menuItems = [] } = useQuery<AppMenuItem[]>({
    queryKey: ["customerMenu", tenantId],
    queryFn: () => fetchCustomerMenu(tenantId),
    enabled: isMounted,
  });

  // Server State: Active Order
  const { data: activeOrder = null } = useQuery<AppOrder | null>({
    queryKey: ["customerOrder", tenantId, tableNumber],
    queryFn: () => fetchActiveOrder(tenantId, tableNumber),
    enabled: isMounted && !!tableNumber && pageView !== "THANK_YOU",
    refetchInterval: pageView === "ORDER_STATUS" ? STATUS_POLL_INTERVAL_MS : false,
  });

  // Live status polling effect
  useEffect(() => {
    if (pageView !== "ORDER_STATUS" || !activeOrder) return;
    const phase = deriveOrderPhase(activeOrder);
    if (phase === "READY" && activeOrder.status === STATUS_COMPLETED) {
      setPageView("FEEDBACK");
    }
  }, [activeOrder, pageView]);

  const addToCart = useCallback((itemId: string) => {
    const menuItem = menuItems.find((m) => m.id === itemId);
    if (!menuItem || !menuItem.isAvailable) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.itemId === itemId);
      if (existing) {
        return prev.map((c) => c.itemId === itemId ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { itemId, name: menuItem.name, qty: 1, unitPrice: menuItem.price, notes: "" }];
    });
  }, [menuItems]);

  const updateQty = useCallback((itemId: string, delta: number) => {
    setCart((prev) => prev.map((c) => c.itemId === itemId ? { ...c, qty: c.qty + delta } : c).filter((c) => c.qty > 0));
  }, []);

  const updateNotes = useCallback((itemId: string, notes: string) => {
    setCart((prev) => prev.map((c) => (c.itemId === itemId ? { ...c, notes } : c)));
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((c) => c.itemId !== itemId));
  }, []);

  const submitOrderMutation = useMutation({
    mutationFn: (currentCart: CustomerCartItem[]) => submitCustomerOrder(tenantId, tableNumber, currentCart),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerOrder", tenantId, tableNumber] });
      setCart([]);
      setPageView("ORDER_STATUS");
    },
    onSettled: () => setIsSubmitting(false),
  });

  const submitOrder = useCallback(async (): Promise<void> => {
    if (isSubmitting || cart.length === 0 || !tableNumber) return;
    setIsSubmitting(true);
    submitOrderMutation.mutate(cart);
  }, [cart, isSubmitting, tableNumber, submitOrderMutation]);

  const submitFeedbackMutation = useMutation({
    mutationFn: (payload: AppFeedback) => submitCustomerFeedback(tenantId, activeOrder?.id || "", payload),
    onSuccess: () => {
      setPageView("THANK_YOU");
    },
    onSettled: () => setIsSubmitting(false),
  });

  const submitFeedback = useCallback(async (rating: number, comment: string): Promise<void> => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    submitFeedbackMutation.mutate({
      id: `fb-${Date.now()}`,
      orderId: activeOrder?.id || "",
      rating,
      comment,
      timestamp: Date.now(),
    });
  }, [isSubmitting, activeOrder, submitFeedbackMutation]);

  const handleComplete = useCallback(() => {
    setPageView("FEEDBACK");
  }, []);

  const openMenu = useCallback(() => {
    setPageView("MENU");
  }, []);

  const viewOrderStatus = useCallback(() => {
    setPageView("ORDER_STATUS");
  }, []);

  return {
    tableNumber,
    menuItems,
    cart,
    activeOrder,
    pageView,
    isSubmitting,
    isMounted,
    addToCart,
    updateQty,
    updateNotes,
    removeFromCart,
    submitOrder,
    submitFeedback,
    handleComplete,
    openMenu,
    viewOrderStatus,
  };
}
