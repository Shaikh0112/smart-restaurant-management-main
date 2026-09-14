// RESPONSIBILITY: Centralized URL configuration for the Waiter module.

export const WAITER_ROUTES = {
  BASE: '/waiter',
  DASHBOARD: '/waiter/dashboard',
  RESERVATIONS: '/waiter/reservations',
  BOOK_RESERVATION: '/waiter/reservations/book', // FIXED incorrect route
};

export const WAITER_API_ROUTES = {
  TABLES: '/api/waiter/tables',
  ORDERS: '/api/waiter/orders',
  MENU: '/api/waiter/menu',
  SERVICE_REQUESTS: '/api/waiter/service-requests',
  NOTIFICATIONS: '/api/waiter/notifications',
  SUBMIT_KOT: '/api/waiter/submit-kot',
  TRANSFER_TABLE: '/api/waiter/transfer-table',
  RESERVATIONS: '/api/waiter/reservations',
  SIMULATE_PAYMENT: '/api/waiter/reservations/payment',
};
