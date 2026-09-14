import { http, HttpResponse } from 'msw';
import type { AppTable, AppOrder, AppServiceRequest } from '@/types/appTypes';

// In-memory mock database
let tables: AppTable[] = [];
let orders: AppOrder[] = [];
let menu: any[] = [];
let serviceRequests: AppServiceRequest[] = [];
let reservations: any[] = [];

const BASE_URL = 'http://localhost:3000/api/waiter'; // Adjust based on env

export const waiterHandlers = [
  http.get(`${BASE_URL}/tables`, () => {
    return HttpResponse.json({
      success: true,
      message: "Tables fetched successfully",
      data: tables
    });
  }),
  http.get(`${BASE_URL}/orders`, () => {
    return HttpResponse.json({
      success: true,
      message: "Orders fetched successfully",
      data: orders
    });
  }),
  http.get(`${BASE_URL}/menu`, () => {
    return HttpResponse.json({
      success: true,
      message: "Menu fetched successfully",
      data: menu
    });
  }),
  http.get(`${BASE_URL}/service-requests`, () => {
    return HttpResponse.json({
      success: true,
      message: "Service requests fetched successfully",
      data: serviceRequests
    });
  }),
  http.get(`${BASE_URL}/reservations`, () => {
    return HttpResponse.json({
      success: true,
      message: "Reservations fetched successfully",
      data: reservations
    });
  }),
  
  // Mutations
  http.post(`${BASE_URL}/submit-kot`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      message: "KOT submitted successfully",
      data: { id: `kot-${Date.now()}`, ...body as object }
    });
  }),
  http.post(`${BASE_URL}/transfer-table`, async ({ request }) => {
    return HttpResponse.json({
      success: true,
      message: "Table transferred successfully",
      data: null
    });
  }),
  http.post(`${BASE_URL}/reservations`, async ({ request }) => {
    const body = await request.json();
    const newReservation = { id: `res-${Date.now()}`, ...body as object };
    reservations.push(newReservation as never);
    return HttpResponse.json({
      success: true,
      message: "Reservation created successfully",
      data: newReservation
    });
  }),
  http.post(`${BASE_URL}/reservations/payment`, async ({ request }) => {
    return HttpResponse.json({
      success: true,
      message: "Payment verified successfully",
      data: { paymentStatus: "PAID", transactionId: `TXN_RES_${Date.now()}` }
    });
  })
];
