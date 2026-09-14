// RESPONSIBILITY: useCheckoutAudit module logic and UI.
// DATA FLOW: Local component state -> External API
import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import { formatCurrency } from "@/lib/formatters";
import type { AppAuditLog } from "@/types/appTypes";

export function useCheckoutAudit() {
  const [, setAuditLogs] = useLocalStorage<AppAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);

  const logAudit = useCallback((
    timestamp: number, 
    orderId: string, 
    tableNumber: string, 
    totalAmount: number, 
    paymentMethod: string,
    role: string = "CASHIER"
  ) => {
    const auditEntry: AppAuditLog = {
      id: `log-${timestamp}`,
      action: "CHECKOUT_COMPLETED",
      details: `Order ${orderId} checked out. Table ${tableNumber}. Total: ${formatCurrency(totalAmount)}. Payment: ${paymentMethod}.`,
      userRole: role as any,
      timestamp,
    };
    setAuditLogs((prev) => [...prev, auditEntry]);
  }, [setAuditLogs]);

  return { logAudit };
}
