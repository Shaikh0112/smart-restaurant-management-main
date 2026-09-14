// RESPONSIBILITY: Handle Low Stock Alerts and Full Stock Received mutations.
// Moves logic out of KitchenStockToggle component for cleaner separation of concerns.

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/lib/toastService";
import type { AppMenuItem, AppLowStockAlert } from "@/types/appTypes";

export function useKitchenStockMutations(stockAlerts: AppLowStockAlert[] = []) {
  const queryClient = useQueryClient();

  const sendLowStockAlertMutation = useMutation({
    mutationFn: async (item: AppMenuItem) => {
      const existingAlert = stockAlerts.find((a) => a.itemId === item.id && a.status === "ALERT_SENT");
      if (existingAlert) {
        throw new Error(`Low stock alert already sent for ${item.name}!`);
      }
      // Mocking the backend call to create the alert and dispatch notifications
      return { success: true, item };
    },
    onSuccess: (data) => {
      showToast({
        type: "warning",
        title: "Alert Sent 🚨",
        message: `Urgent: Low stock alert for ${data.item.name} sent to Cashier & Admin!`,
      });
      // Invalidate queries to fetch updated alerts
      queryClient.invalidateQueries({ queryKey: ["kitchen", "stockAlerts"] });
    },
    onError: (error: Error) => {
      showToast({ type: "info", message: error.message });
    },
  });

  const markFullStockReceivedMutation = useMutation({
    mutationFn: async (item: AppMenuItem) => {
      // Mocking the backend call to mark full stock received and clear notifications
      return { success: true, item };
    },
    onSuccess: (data) => {
      showToast({
        type: "success",
        title: "Full Stock Received 🟢",
        message: `Confirmed full stock received for ${data.item.name}. Item is back in stock!`,
      });
      // Invalidate queries to fetch updated alerts
      queryClient.invalidateQueries({ queryKey: ["kitchen", "stockAlerts"] });
    },
  });

  return {
    sendLowStockAlert: (item: AppMenuItem) => sendLowStockAlertMutation.mutate(item),
    markFullStockReceived: (item: AppMenuItem) => markFullStockReceivedMutation.mutate(item),
  };
}
