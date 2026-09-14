// RESPONSIBILITY: Kitchen Menu & Item Master page route.
// Strictly a Server Component. Passes control to KitchenMenuOrchestrator.

import { KitchenMenuOrchestrator } from "@/app/kitchen/kitchen_components/Menu/KitchenMenuOrchestrator";

export default function KitchenMenuPage() {
  return (
    <KitchenMenuOrchestrator />
  );
}
