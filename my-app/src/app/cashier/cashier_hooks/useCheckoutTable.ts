// RESPONSIBILITY: useCheckoutTable module logic and UI.
// DATA FLOW: Local component state -> External API
import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import type { AppTable } from "@/types/appTypes";

export function useCheckoutTable() {
  const [, setTables] = useLocalStorage<AppTable[]>(STORAGE_KEYS.TABLES, []);

  const freeTable = useCallback((tableNumber: string, orderId: string) => {
    const normKey = (s?: string) => (s || "").toLowerCase().trim().replace(/^(table|tbl|t)-?/i, "").trim().padStart(2, "0");
    const targetTableKey = normKey(tableNumber);

    setTables((prev) =>
      prev.map((t) => {
        const tKey = normKey(t.tableNumber || t.id);
        const isMatch = t.currentOrderId === orderId || tKey === targetTableKey;
        return isMatch ? { ...t, status: "CLEANING" as const, currentOrderId: null } : t;
      })
    );

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(`table_phone_${targetTableKey}`);
    }
  }, [setTables]);

  return { freeTable };
}
