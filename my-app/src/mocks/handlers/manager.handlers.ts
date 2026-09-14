import { http, HttpResponse } from "msw";
import type { AppTenant, AppMenuItem, AppTable, AppUser } from "@/types/appTypes";
import { getStoredTenants } from "@/lib/tenantService"; // Existing localstorage helpers for the mock DB
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";

const API_BASE_URL = "/api/v1/manager";

// Mock Database Initialization using localStorage helpers
const getMockTenants = () => getStoredTenants();
const saveMockTenants = (tenants: AppTenant[]) => localStorage.setItem(STORAGE_KEYS.SAAS_TENANTS, JSON.stringify(tenants));

export const managerHandlers = [
  // 1. GET Tenant Details
  http.get(`${API_BASE_URL}/profile`, ({ request }) => {
    const tenantId = request.headers.get("x-tenant-id");
    if (!tenantId) {
      return HttpResponse.json({ success: false, message: "Missing tenant ID" }, { status: 400 });
    }
    const tenant = getMockTenants().find((t) => t.tenantId === tenantId);
    if (!tenant) {
      return HttpResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: tenant }, { status: 200 });
  }),

  // 2. PATCH Tenant Profile
  http.patch(`${API_BASE_URL}/profile`, async ({ request }) => {
    const tenantId = request.headers.get("x-tenant-id");
    if (!tenantId) {
      return HttpResponse.json({ success: false, message: "Missing tenant ID" }, { status: 400 });
    }
    const updatePayload = await request.json() as Partial<AppTenant>;
    
    let updatedTenant: AppTenant | null = null;
    const allTenants = getMockTenants().map((t) => {
      if (t.tenantId === tenantId) {
        updatedTenant = { ...t, ...updatePayload };
        return updatedTenant;
      }
      return t;
    });

    if (!updatedTenant) {
      return HttpResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    saveMockTenants(allTenants);
    return HttpResponse.json({ success: true, data: updatedTenant }, { status: 200 });
  }),

  // Add more endpoints as needed...
];
