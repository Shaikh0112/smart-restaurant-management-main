// RESPONSIBILITY: Types specific to the Kitchen Inventory module.

import type { AppInventoryItem, AppMenuItem } from "@/types/appTypes";

export interface KitchenStockToggleProps {
  onOpenWasteLog: () => void;
  onOpenRecipe?: (itemId: string) => void;
  initialFilter?: "ALL" | "IN_STOCK" | "OUT_OF_STOCK";
}

export interface KitchenWasteLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface WasteLogFormValues {
  ingredientId: string;
  qty: number;
  reason: string;
}

export interface UseKitchenStockReturn {
  menuItems: AppMenuItem[];
  inventoryItems: AppInventoryItem[];
  togglingId: string;
  toggleItemAvailability: (itemId: string) => void;
  batchToggleAvailability?: (station: string, isAvailable: boolean) => void;
  logWaste: (ingredientId: string, qty: number, reason: string) => void;
}

export interface UseKitchenInventoryReturn {
  inventoryItems: AppInventoryItem[];
  lowStockItems:  AppInventoryItem[];
  expiringItems:  AppInventoryItem[];
  updateStock:    (id: string, newQty: number) => void;
  addInventoryItem: (item: Omit<AppInventoryItem, "id">) => void;
  deleteInventoryItem: (id: string) => void;
  updateExpiryDate: (id: string, newDate: string) => void;
}

export interface KitchenInventoryTableProps {
  inventoryItems: AppInventoryItem[];
  onUpdateStock:  (id: string, newQty: number) => void;
  onDelete: (id: string, name: string) => void;
  onUpdateExpiry: (id: string, newDate: string) => void;
}
