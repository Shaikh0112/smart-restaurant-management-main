// RESPONSIBILITY: Helper cells and badges for the Kitchen Inventory Table.

import type { AppInventoryItem } from "@/types/appTypes";

export type StockStatus = "OK" | "LOW" | "EXPIRED";

export const MS_PER_DAY = 86_400_000;
export const EXPIRY_WARNING_DAYS = 3;

export function getStockStatus(item: AppInventoryItem): StockStatus {
  const today = new Date().toISOString().slice(0, 10);
  if (item.expiryDate < today) return "EXPIRED";
  if (item.currentStock < item.threshold) return "LOW";
  return "OK";
}

export function getExpiryClass(expiryDate: string): string {
  const today      = new Date().toISOString().slice(0, 10);
  const cutoff     = new Date(Date.now() + EXPIRY_WARNING_DAYS * MS_PER_DAY)
    .toISOString()
    .slice(0, 10);

  if (expiryDate < today)   return "text-danger font-semibold";
  if (expiryDate <= cutoff) return "text-warning font-semibold";
  return "text-text-secondary";
}

export function StatusBadge({ status }: { status: StockStatus }) {
  const styles: Record<StockStatus, string> = {
    OK:      "bg-success-bg text-success",
    LOW:     "bg-warning-bg text-warning",
    EXPIRED: "bg-danger-bg text-danger",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${styles[status]}`}>
      {status === "OK" ? "Fresh" : status === "LOW" ? "Low Stock" : "Expired"}
    </span>
  );
}
