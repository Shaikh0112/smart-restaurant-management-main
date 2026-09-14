// RESPONSIBILITY: useCheckoutNotification module logic and UI.
// DATA FLOW: Local component state -> External API
import { useCallback } from "react";
import { dispatchNotification } from "@/lib/notificationService";
import { createServiceRequest } from "../cashier_utils/cashier_serviceRequestService";

export function useCheckoutNotification() {
  const notifyWaiters = useCallback((tableNumber: string, targetRoute: string = "/waiter") => {
    dispatchNotification({
      role: "WAITER",
      type: "SERVICE_REQUEST",
      title: `Clean Table ${tableNumber} `,
      message: `Bill paid for Table ${tableNumber}. Please clean table & reset for next guests!`,
      entityId: tableNumber,
      entityType: "TABLE",
      route: targetRoute,
      playSound: true,
      soundType: "BELL",
    });

    createServiceRequest({
      tableId: tableNumber,
      tableNumber: tableNumber,
      type: "CLEANING",
      customMessage: `Bill paid. Please clean table & reset for next guests.`,
    });
  }, []);

  return { notifyWaiters };
}
