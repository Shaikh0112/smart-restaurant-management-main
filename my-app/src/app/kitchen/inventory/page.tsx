// RESPONSIBILITY: Kitchen Stock Inventory page route.
// Strictly a Server Component. Passes control to KitchenInventoryOrchestrator.

import { KitchenInventoryOrchestrator } from "@/app/kitchen/kitchen_components/Inventory/KitchenInventoryOrchestrator";

export default function KitchenInventoryPage() {
  return (
    <KitchenInventoryOrchestrator />
  );
}
