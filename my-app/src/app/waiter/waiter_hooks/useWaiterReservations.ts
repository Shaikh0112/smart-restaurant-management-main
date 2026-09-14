// RESPONSIBILITY: Wrapper around useWaiterReservations query for client components.
"use client";

import { useWaiterReservations as useReservationsQuery } from "./useWaiterQueries";
import { useCreateReservationMutation } from "./useWaiterMutations";

export function useWaiterReservations() {
  const { data: reservations = [], isLoading, error } = useReservationsQuery();
  const createMutation = useCreateReservationMutation();

  return {
    reservations,
    isLoading,
    error,
    createReservation: createMutation.mutateAsync,
    isCreating: createMutation.isPending
  };
}
