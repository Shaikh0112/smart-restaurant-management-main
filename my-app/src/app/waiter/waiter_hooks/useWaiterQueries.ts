// DATA FLOW: waiter_api → useWaiterQueries → Components
import { useQuery } from '@tanstack/react-query';
import { waiterApi } from "@/app/waiter/waiter_api/waiter_api";

export const waiterKeys = {
  all: ['waiter'] as const,
  tables: () => [...waiterKeys.all, 'tables'] as const,
  orders: () => [...waiterKeys.all, 'orders'] as const,
  menu: () => [...waiterKeys.all, 'menu'] as const,
  serviceRequests: () => [...waiterKeys.all, 'serviceRequests'] as const,
  notifications: () => [...waiterKeys.all, 'notifications'] as const,
  reservations: () => [...waiterKeys.all, 'reservations'] as const,
};

export function useWaiterTables() {
  return useQuery({
    queryKey: waiterKeys.tables(),
    queryFn: () => waiterApi.fetchTables().then((res) => res.data || [])
  });
}

export function useWaiterOrders() {
  return useQuery({
    queryKey: waiterKeys.orders(),
    queryFn: () => waiterApi.fetchOrders().then((res) => res.data || [])
  });
}

export function useWaiterMenu() {
  return useQuery({
    queryKey: waiterKeys.menu(),
    queryFn: () => waiterApi.fetchMenu().then((res) => res.data || []),
    staleTime: 1000 * 60 * 5, // Cache menu for 5 mins
  });
}

export function useWaiterServiceRequests() {
  return useQuery({
    queryKey: waiterKeys.serviceRequests(),
    queryFn: () => waiterApi.fetchServiceRequests().then((res) => res.data || [])
  });
}

export function useWaiterReservations() {
  return useQuery({
    queryKey: waiterKeys.reservations(),
    queryFn: () => waiterApi.fetchReservations().then((res) => res.data || [])
  });
}
