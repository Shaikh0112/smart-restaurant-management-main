import type { AppOrder, AppFeedback } from "@/types/appTypes";
import type { CustomerCartItem } from "@/app/customer/customer_types/CustomerTypes";

// In a real implementation, this would use fetch or axios.
// For now, it defines the contract that MSW will intercept.

export async function fetchCustomerMenu(tenantId: string) {
  const res = await fetch(`/api/customer/menu?tenant=${tenantId}`);
  if (!res.ok) throw new Error("Failed to fetch menu");
  return res.json();
}

export async function fetchActiveOrder(tenantId: string, tableNumber: string) {
  const res = await fetch(`/api/customer/order/active?tenant=${tenantId}&table=${tableNumber}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch active order");
  return res.json();
}

export async function submitCustomerOrder(tenantId: string, tableNumber: string, cart: CustomerCartItem[]) {
  const res = await fetch(`/api/customer/order/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tenantId, tableNumber, cart }),
  });
  if (!res.ok) throw new Error("Failed to submit order");
  return res.json();
}

export async function submitCustomerFeedback(tenantId: string, orderId: string, payload: AppFeedback) {
  const res = await fetch(`/api/customer/order/${orderId}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tenantId, payload }),
  });
  if (!res.ok) throw new Error("Failed to submit feedback");
  return res.json();
}
