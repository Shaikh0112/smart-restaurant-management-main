// RESPONSIBILITY: useCheckoutOrder module logic and UI.
// DATA FLOW: Local component state -> External API
import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import type { AppOrder } from "@/types/appTypes";

export function useCheckoutOrder() {
  const [, setOrders] = useLocalStorage<AppOrder[]>(STORAGE_KEYS.ORDERS, []);

  const completeOrder = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "COMPLETED" as const } : o))
    );
  }, [setOrders]);

  return { completeOrder };
}
