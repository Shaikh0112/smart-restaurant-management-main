// RESPONSIBILITY: Types specific to the Kitchen Menu module.

import type { AppMenuItem, AppCombo, AppInventoryItem, KitchenStation } from "@/types/appTypes";

export interface KitchenRecipeSpec {
  itemId: string;
  name: string;
  station: KitchenStation;
  portionSize: string;
  prepTimeEstimateMins: number;
  ingredients: string[];
  instructions: string[];
  allergens: string[];
  spiceLevel?: "Mild" | "Medium" | "Spicy" | "Very Spicy";
}

export interface KitchenRecipeModalProps {
  isOpen: boolean;
  itemId: string | null;
  onClose: () => void;
}

export interface KitchenMenuFormValues {
  name:        string;
  price:       number;
  category:    string;
  station:     KitchenStation;
  isAvailable: boolean;
  isSpecial:   boolean;
  variants:    { name: string; price: number }[];
}

export interface KitchenDeleteConfirm {
  type:  "menu" | "combo";
  id:    string;
  label: string;
}

export interface UseKitchenMenuReturn {
  menuItems:      AppMenuItem[];
  combos:         AppCombo[];
  inventoryItems: AppInventoryItem[];
  isSubmitting:   boolean;
  addMenuItem:    (values: KitchenMenuFormValues) => void;
  updateMenuItem: (id: string, values: KitchenMenuFormValues) => void;
  deleteMenuItem: (id: string) => void;
  toggleAvailability: (id: string) => void;
  addCombo:       (combo: Omit<AppCombo, "id">) => void;
  updateCombo:    (id: string, updates: Omit<AppCombo, "id">) => void;
  deleteCombo:    (id: string) => void;
  saveRecipe:     (itemId: string, recipe: AppMenuItem["recipe"]) => void;
}

export interface KitchenMenuTableProps {
  menuItems:          AppMenuItem[];
  onEdit:             (item: AppMenuItem) => void;
  onDelete:           (id: string, name: string) => void;
  onToggleAvailability: (id: string) => void;
}

export interface KitchenMenuFormModalProps {
  isOpen:         boolean;
  editItem:       AppMenuItem | null;
  inventoryItems: AppInventoryItem[];
  onSave:         (values: KitchenMenuFormValues) => void;
  onSaveRecipe:   (itemId: string, recipe: AppMenuItem["recipe"]) => void;
  onClose:        () => void;
}

export interface KitchenRecipeEditorProps {
  itemId:         string;
  currentRecipe:  AppMenuItem["recipe"];
  inventoryItems: AppInventoryItem[];
  onSave:         (recipe: AppMenuItem["recipe"]) => void;
}

export interface KitchenComboEditorProps {
  combos:    AppCombo[];
  menuItems: AppMenuItem[];
  onAdd:     (combo: Omit<AppCombo, "id">) => void;
  onUpdate:  (id: string, updates: Omit<AppCombo, "id">) => void;
  onDelete:  (id: string, name: string) => void;
}
