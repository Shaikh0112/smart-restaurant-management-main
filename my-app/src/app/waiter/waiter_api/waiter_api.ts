// RESPONSIBILITY: Exposes all backend endpoints for the Waiter module.

import type { ApiResponse } from "../waiter_types/waiter_api.types";
import { WAITER_API_ROUTES } from "@/app/waiter/waiter_url_config";

// Core fetcher wrapper (for real API eventually, currently intercepted by MSW)
async function fetchClient<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const waiterApi = {
  fetchTables: () => fetchClient<any[]>(WAITER_API_ROUTES.TABLES),
  fetchOrders: () => fetchClient<any[]>(WAITER_API_ROUTES.ORDERS),
  fetchMenu: () => fetchClient<any[]>(WAITER_API_ROUTES.MENU),
  fetchServiceRequests: () => fetchClient<any[]>(WAITER_API_ROUTES.SERVICE_REQUESTS),
  fetchNotifications: () => fetchClient<any[]>(WAITER_API_ROUTES.NOTIFICATIONS),
  fetchReservations: () => fetchClient<any[]>(WAITER_API_ROUTES.RESERVATIONS),
  
  // Mutations
  submitKot: (payload: any) => fetchClient<any>(WAITER_API_ROUTES.SUBMIT_KOT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }),
  transferTable: (payload: any) => fetchClient<any>(WAITER_API_ROUTES.TRANSFER_TABLE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }),
  markServiceRequestResolved: (id: string) => fetchClient<any>(`${WAITER_API_ROUTES.SERVICE_REQUESTS}/${id}/resolve`, {
    method: "POST"
  }),
  createReservation: (payload: any) => fetchClient<any>(WAITER_API_ROUTES.RESERVATIONS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }),
  simulatePayment: (payload: any) => fetchClient<any>(WAITER_API_ROUTES.SIMULATE_PAYMENT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
};
