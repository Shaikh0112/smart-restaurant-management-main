// RESPONSIBILITY: Centralized API client for the Manager module.
// ENFORCES: Consistent base URLs, auth headers, tenant ID headers, and standard Response typing.

import type { AppUser, AppTenant, AppMenuItem, AppTable } from "@/types/appTypes";

// Standard API Response Wrapper
export interface ManagerApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

// Example Base URL (to be replaced with env variables later)
const API_BASE_URL = "/api/v1/manager";

// Helper to inject headers
const getHeaders = (tenantId?: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${localStorage.getItem("token") || ""}`, // Uncomment when auth is real
  };
  if (tenantId) {
    headers["x-tenant-id"] = tenantId;
  }
  return headers;
};

// Generic Fetch Wrapper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  tenantId?: string
): Promise<ManagerApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...getHeaders(tenantId), ...options.headers },
    });

    const data = await res.json();
    return {
      success: res.ok,
      data: res.ok ? data : undefined,
      error: !res.ok ? data.message || "An error occurred" : undefined,
      statusCode: res.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Network error",
      statusCode: 500,
    };
  }
}

export const managerApi = {
  // TENANT (RESTAURANT) API
  getTenantDetails: (tenantId: string) =>
    fetchApi<AppTenant>("/profile", {}, tenantId),
  
  updateTenantProfile: (tenantId: string, payload: Partial<AppTenant>) =>
    fetchApi<AppTenant>("/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }, tenantId),

  // MENU API
  getMenu: (tenantId: string) =>
    fetchApi<AppMenuItem[]>("/menu", {}, tenantId),
  
  createMenuItem: (tenantId: string, payload: Partial<AppMenuItem>) =>
    fetchApi<AppMenuItem>("/menu", {
      method: "POST",
      body: JSON.stringify(payload),
    }, tenantId),

  updateMenuItem: (tenantId: string, itemId: string, payload: Partial<AppMenuItem>) =>
    fetchApi<AppMenuItem>(`/menu/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }, tenantId),

  deleteMenuItem: (tenantId: string, itemId: string) =>
    fetchApi<void>(`/menu/${itemId}`, { method: "DELETE" }, tenantId),

  // COMBO API
  getCombos: (tenantId: string) =>
    fetchApi<any[]>("/combos", {}, tenantId),
  
  createCombo: (tenantId: string, payload: any) =>
    fetchApi<any>("/combos", { method: "POST", body: JSON.stringify(payload) }, tenantId),

  updateCombo: (tenantId: string, comboId: string, payload: any) =>
    fetchApi<any>(`/combos/${comboId}`, { method: "PATCH", body: JSON.stringify(payload) }, tenantId),

  deleteCombo: (tenantId: string, comboId: string) =>
    fetchApi<void>(`/combos/${comboId}`, { method: "DELETE" }, tenantId),

  // INVENTORY API
  getInventory: (tenantId: string) =>
    fetchApi<any[]>("/inventory", {}, tenantId),

  createInventoryItem: (tenantId: string, payload: any) =>
    fetchApi<any>("/inventory", { method: "POST", body: JSON.stringify(payload) }, tenantId),

  updateInventoryItem: (tenantId: string, itemId: string, payload: any) =>
    fetchApi<any>(`/inventory/${itemId}`, { method: "PATCH", body: JSON.stringify(payload) }, tenantId),

  deleteInventoryItem: (tenantId: string, itemId: string) =>
    fetchApi<void>(`/inventory/${itemId}`, { method: "DELETE" }, tenantId),

  // STAFF API
  getStaff: (tenantId: string) =>
    fetchApi<AppUser[]>("/staff", {}, tenantId),
  
  createStaff: (tenantId: string, payload: Partial<AppUser>) =>
    fetchApi<AppUser>("/staff", {
      method: "POST",
      body: JSON.stringify(payload),
    }, tenantId),

  updateStaff: (tenantId: string, staffId: string, payload: Partial<AppUser>) =>
    fetchApi<AppUser>(`/staff/${staffId}`, { method: "PATCH", body: JSON.stringify(payload) }, tenantId),

  getSalaryRecords: (tenantId: string) =>
    fetchApi<any[]>("/staff/salary", {}, tenantId),

  createSalaryRecord: (tenantId: string, payload: any) =>
    fetchApi<any>("/staff/salary", { method: "POST", body: JSON.stringify(payload) }, tenantId),

  getAttendanceRecords: (tenantId: string) =>
    fetchApi<any[]>("/staff/attendance", {}, tenantId),

  markAttendance: (tenantId: string, payload: any) =>
    fetchApi<any>("/staff/attendance", { method: "POST", body: JSON.stringify(payload) }, tenantId),

  // SHIFT API
  getShift: (tenantId: string) =>
    fetchApi<any>("/shift", {}, tenantId),

  openShift: (tenantId: string, payload: any) =>
    fetchApi<any>("/shift/open", { method: "POST", body: JSON.stringify(payload) }, tenantId),

  closeShift: (tenantId: string, payload: any) =>
    fetchApi<any>("/shift/close", { method: "POST", body: JSON.stringify(payload) }, tenantId),

  getSalesHistory: (tenantId: string) =>
    fetchApi<any[]>("/sales", {}, tenantId),

  // TABLES API
  getTables: (tenantId: string) =>
    fetchApi<AppTable[]>("/tables", {}, tenantId),

  // DATA EXPORT/IMPORT API
  exportData: (tenantId: string) =>
    fetchApi<any>("/data/export", {}, tenantId),

  importData: (tenantId: string, payload: any) =>
    fetchApi<any>("/data/import", { method: "POST", body: JSON.stringify(payload) }, tenantId),

  emergencyReset: (tenantId: string, pin: string) =>
    fetchApi<void>("/data/reset", { method: "POST", body: JSON.stringify({ pin }) }, tenantId),

  getStorageUsage: (tenantId: string) =>
    fetchApi<any>("/data/usage", {}, tenantId),
};
