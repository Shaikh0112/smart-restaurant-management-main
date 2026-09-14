import { http, HttpResponse } from "msw";


export const customerHandlers = [
  http.get("/api/customer/menu", ({ request }) => {
    return HttpResponse.json([]);
  }),

  http.get("/api/customer/order/active", ({ request }) => {
    return HttpResponse.json(null);
  }),

  http.post("/api/customer/order/submit", async ({ request }) => {
    return HttpResponse.json({ success: true });
  }),

  http.post("/api/customer/order/:orderId/feedback", async ({ request, params }) => {
    return HttpResponse.json({ success: true });
  }),
];
