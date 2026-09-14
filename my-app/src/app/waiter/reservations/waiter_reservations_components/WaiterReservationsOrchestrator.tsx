"use client";

import { useState } from "react";
import { WaiterReservationsTable } from "./WaiterReservationsTable";
import { useWaiterReservations } from "@/app/waiter/waiter_hooks/useWaiterQueries";
import { showToast } from "@/lib/toastService";
import type { WaiterReservationsTab } from "@/app/waiter/reservations/waiter_reservations_types/WaiterReservationsTypes";

export function WaiterReservationsOrchestrator({ tab }: { tab: WaiterReservationsTab }) {
  const { data: reservations = [], isLoading } = useWaiterReservations();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const filteredReservations = reservations.filter(res => {
    const isPast = new Date(res.slotTime).getTime() < Date.now();
    return tab === "UPCOMING" ? !isPast : isPast;
  });

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    // Simulate API call for now
    setTimeout(() => {
      showToast({ type: "success", message: "Reservation cancelled successfully" });
      setCancellingId(null);
    }, 1000);
  };

  if (isLoading) {
    return <div className="skeleton h-96 w-full rounded-xl"></div>;
  }

  return (
    <WaiterReservationsTable
      tab={tab}
      waiter_reservations={filteredReservations}
      cancellingId={cancellingId}
      onCancel={handleCancel}
    />
  );
}
