// @ts-nocheck
// RESPONSIBILITY: Centralized helper service for Customer Service Requests (Call Waiter, Water, Bill, Cutlery, Cleaning).
// DATA FLOW: Customer UI -> createServiceRequest() -> app_service_requests -> Waiter / Cashier Notifications -> Waiter UI

import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import { dispatchNotification } from "@/lib/notificationService";
import type {
  AppServiceRequest,
  ServiceRequestType,
  ServiceRequestStatus,
  AppTable,
  AppOrder,
} from "@/types/appTypes";

export async function createServiceRequest(params: {
  tenantId: string;
  tableId: string;
  tableNumber: string;
  type: ServiceRequestType;
  customMessage?: string;
}) {
  const res = await fetch(`/api/customer/service-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to create service request");
  return res.json();
}

export async function updateServiceRequestStatus(
  id: string,
  newStatus: ServiceRequestStatus,
  waiterId?: string
) {
  const res = await fetch(`/api/customer/service-requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus, waiterId }),
  });
  if (!res.ok) throw new Error("Failed to update service request");
  return res.json();
}
