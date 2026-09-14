// RESPONSIBILITY: Mobile-friendly card stack view for Inventory Items.

import { Trash } from "lucide-react";
import { EditableStockCell } from "./EditableStockCell";
import { EditableExpiryCell } from "./EditableExpiryCell";
import { 
  StatusBadge, 
  getStockStatus, 
  getExpiryClass 
} from "./KitchenInventoryTableCells";
import type { AppInventoryItem } from "@/types/appTypes";

interface KitchenInventoryMobileCardProps {
  item: AppInventoryItem;
  onUpdateStock: (id: string, qty: number) => void;
  onUpdateExpiry: (id: string, newDate: string) => void;
  onDelete: (id: string, name: string) => void;
}

export function KitchenInventoryMobileCard({ item, onUpdateStock, onUpdateExpiry, onDelete }: KitchenInventoryMobileCardProps) {
  const status = getStockStatus(item);
  const expiryClass = getExpiryClass(item.expiryDate);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:hidden">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[15px] font-bold text-text-primary">{item.name}</h3>
          <p className="text-[11px] text-text-secondary">Threshold: {item.threshold} {item.unit}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      
      <div className="grid grid-cols-2 gap-2 bg-page p-3 rounded-lg border border-border/50">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-text-secondary">Current Stock</span>
          <EditableStockCell
            itemId={item.id}
            currentStock={item.currentStock}
            unit={item.unit}
            onSave={onUpdateStock}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-text-secondary">Expiry Date</span>
          <div className={expiryClass}>
            <EditableExpiryCell
              itemId={item.id}
              expiryDate={item.expiryDate}
              onSave={onUpdateExpiry}
              isEditable={expiryClass !== "text-text-secondary"}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-border/40">
        <button
          onClick={() => onDelete(item.id, item.name)}
          className="flex items-center gap-1 text-[11px] font-bold text-danger hover:text-danger/80 p-1"
        >
          <Trash size={13} /> Remove
        </button>
      </div>
    </div>
  );
}
