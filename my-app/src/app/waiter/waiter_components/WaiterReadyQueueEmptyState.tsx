// RESPONSIBILITY: Empty state for Ready Queue.
import { ChefHat } from "lucide-react";

export function WaiterReadyQueueEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center text-text-disabled">
      <ChefHat size={18} className="mb-2 opacity-50" />
      <p className="text-sm font-semibold">Kitchen is clear</p>
      <p className="text-[11px]">No items waiting for pickup</p>
    </div>
  );
}
