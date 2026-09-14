// RESPONSIBILITY: useCheckoutInventory module logic and UI.
// DATA FLOW: Local component state -> External API
import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import type { AppMenuItem, AppInventoryItem } from "@/types/appTypes";
import type { CashierCartItem } from "@/app/cashier/cashier_types/CashierTypes";

export function useCheckoutInventory() {
  const [menu] = useLocalStorage<AppMenuItem[]>(STORAGE_KEYS.MENU, []);
  const [, setInventory] = useLocalStorage<AppInventoryItem[]>(STORAGE_KEYS.INVENTORY, []);

  const deductInventory = useCallback((cartItems: CashierCartItem[]) => {
    setInventory((prevInventory) => {
      let newInventory = [...prevInventory];
      cartItems.forEach((cartItem) => {
        const menuItem = menu.find(m => m.id === cartItem.itemId || m.name === cartItem.name);
        if (menuItem?.recipe && menuItem.recipe.length > 0) {
          menuItem.recipe.forEach(recipeItem => {
            const totalDeduction = recipeItem.qty * cartItem.qty;
            newInventory = newInventory.map(invItem => 
              invItem.id === recipeItem.ingredientId 
                ? { ...invItem, currentStock: Math.max(0, invItem.currentStock - totalDeduction) }
                : invItem
            );
          });
        }
      });
      return newInventory;
    });
  }, [menu, setInventory]);

  return { deductInventory };
}
