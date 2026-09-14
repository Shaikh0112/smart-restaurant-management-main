// RESPONSIBILITY: Empty state for Table Grid.
import { LayoutGrid } from "lucide-react";

export function WaiterTableEmptyState() {
  return (
    <div className="flex h-64 flex-col items-center justify-center text-center text-text-disabled border border-dashed border-border rounded-xl">
      <LayoutGrid size={18} className="mb-4 opacity-50" />
      <p className="text-lg font-bold">No Tables Found</p>
      <p className="text-sm">Try adjusting your section filters or search query.</p>
    </div>
  );
}
