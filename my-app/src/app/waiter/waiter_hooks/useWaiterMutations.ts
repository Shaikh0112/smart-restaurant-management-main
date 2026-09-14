// DATA FLOW: Components → useWaiterMutations → waiter_api
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { waiterApi } from "@/app/waiter/waiter_api/waiter_api";
import { waiterKeys } from './useWaiterQueries';

export function useSubmitKotMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: any) => waiterApi.submitKot(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waiterKeys.orders() });
      queryClient.invalidateQueries({ queryKey: waiterKeys.tables() });
    }
  });
}

export function useTransferTableMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: any) => waiterApi.transferTable(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waiterKeys.orders() });
      queryClient.invalidateQueries({ queryKey: waiterKeys.tables() });
    }
  });
}

export function useCreateReservationMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: any) => waiterApi.createReservation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waiterKeys.reservations() });
    }
  });
}

export function useSimulatePaymentMutation() {
  return useMutation({
    mutationFn: (payload: any) => waiterApi.simulatePayment(payload)
  });
}
