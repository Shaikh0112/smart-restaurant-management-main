// RESPONSIBILITY: Server Component root for Waiter Terminal.
// Fetches initial data limits and passes them to the orchestrator. No "use client" allowed.

import { WaiterDashboardOrchestrator } from "@/app/waiter/waiter_components/WaiterDashboardOrchestrator";

export default function WaiterPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-screen">
      <WaiterDashboardOrchestrator />
    </main>
  );
}
