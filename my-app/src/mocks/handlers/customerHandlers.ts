import { http, HttpResponse } from "msw";
import { getTenantMenu, getActiveCustomerOrder, submitCustomerOrderToSystem, submitCustomerFeedbackToSystem } from "@/lib/localStorageSeeder";

export const customerHandlers = [
  http.get("/api/customer/menu", ({ request }) => {
    const url = new URL(request.url);
    const tenantId = url.searchParams.get("tenant") || "tenant-royal-spice-01";
    
    // In a real app we'd fetch tenant menu. For MSW with localStorage mock:
    // we use a seeder or direct return
    const menu = getTenantMenu(tenantId);
    return HttpResponse.json(menu);
  }),

  http.get("/api/customer/order/active", ({ request }) => {
    const url = new URL(request.url);
    const tenantId = url.searchParams.get("tenant") || "tenant-royal-spice-01";
    const tableNumber = url.searchParams.get("table");
    
    if (!tableNumber) return new HttpResponse(null, { status: 400 });

    const order = getActiveCustomerOrder(tenantId, tableNumber);
    if (!order) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(order);
  }),

  http.post("/api/customer/order/submit", async ({ request }) => {
    const body = (await request.json()) as { tenantId: string; tableNumber: string; cart: any[] };
    
    try {
      const order = submitCustomerOrderToSystem(body.tenantId, body.tableNumber, body.cart);
      return HttpResponse.json(order);
    } catch (e: any) {
      return new HttpResponse(e.message, { status: 400 });
    }
  }),

  http.post("/api/customer/order/:orderId/feedback", async ({ request, params }) => {
    const { orderId } = params;
    const body = (await request.json()) as { tenantId: string; payload: any };
    
    try {
      const result = submitCustomerFeedbackToSystem(body.tenantId, orderId as string, body.payload);
      return HttpResponse.json(result);
    } catch (e: any) {
      return new HttpResponse(e.message, { status: 400 });
    }
  }),
];
