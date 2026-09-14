// RESPONSIBILITY: Server Component root for Waiter Reservations.

import { Suspense } from "react";
import { WaiterReservationsOrchestrator } from "@/app/waiter/reservations/waiter_reservations_components/WaiterReservationsOrchestrator";

import type { WaiterReservationsTab } from "@/app/waiter/reservations/waiter_reservations_types/WaiterReservationsTypes";

export default async function WaiterReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; search?: string }>;
}) {
  const params = await searchParams;
  const activeTab = (params.tab as WaiterReservationsTab) || "UPCOMING";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-bold text-text-primary">Reservations</h1>
          <p className="text-sm text-text-secondary">Manage upcoming table bookings and guest arrivals</p>
        </div>
      </div>
      
      <Suspense fallback={<div className="skeleton h-96 w-full rounded-xl"></div>}>
        <WaiterReservationsOrchestrator tab={activeTab} />
      </Suspense>
    </div>
  );
}
