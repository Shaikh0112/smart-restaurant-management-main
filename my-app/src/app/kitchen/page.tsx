// RESPONSIBILITY: Kitchen KDS page route.
// Strictly a Server Component. Passes control to KitchenKdsOrchestrator.

import { KitchenKdsOrchestrator } from "@/app/kitchen/kitchen_components/KdsFeed/KitchenKdsOrchestrator";

export default function KitchenPage() {
  return (
    <KitchenKdsOrchestrator />
  );
}
