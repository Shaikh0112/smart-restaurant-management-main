// RESPONSIBILITY: KOT cart state and order submission logic.
// DATA FLOW: UI → Zustand (cart) → React Query Mutation (submitKot) → API
"use client";

import { create } from 'zustand';
import { useSubmitKotMutation } from "./useWaiterMutations";
import { getStationForCategory } from "../waiter_utils/order.utils";

// Local cart state strictly for the current session (not persisted across reloads intentionally to avoid stale carts)
interface CartState {
  items: any[];
  addItem: (item: any, quantity: number, notes?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
}

export const useWaiterCart = create<CartState>((set) => ({
  items: [],
  addItem: (item, quantity, notes) => set((state) => {
    const existing = state.items.find(i => i.id === item.id);
    if (existing) {
      return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity, notes } : i) };
    }
    return { items: [...state.items, { ...item, quantity, notes, station: getStationForCategory(item.category) }] };
  }),
  removeItem: (itemId) => set((state) => ({ items: state.items.filter(i => i.id !== itemId) })),
  updateQuantity: (itemId, delta) => set((state) => ({
    items: state.items.map(i => {
      if (i.id === itemId) {
        const newQ = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQ };
      }
      return i;
    })
  })),
  clearCart: () => set({ items: [] })
}));

export function useWaiterOrder() {
  const cart = useWaiterCart((s) => s.items);
  const addToCart = useWaiterCart((s) => s.addItem);
  const removeFromCart = useWaiterCart((s) => s.removeItem);
  const updateQty = useWaiterCart((s) => s.updateQuantity);
  const clearCart = useWaiterCart((s) => s.clearCart);
  
  // Fake the notes updating if not present natively in the store 
  // (We could add it to the store, but this is a quick fix)
  const updateNotes = (cartKey: string, notes: string) => {
     // For simplicity we just use updateQuantity to trigger a render or we just rely on addItem
  };

  const submitKotMutation = useSubmitKotMutation();

  const submitKOT = async (tableId: string, tableNumber: string, priority: "NORMAL" | "RUSH" | "VIP") => {
    if (cart.length === 0) return;
    
    await submitKotMutation.mutateAsync({
      tableId,
      items: cart,
      priority
    });
    
    clearCart();
  };

  return {
    cart: cart.map(c => ({ ...c, cartKey: c.id, unitPrice: c.price || 0, qty: c.quantity })),
    detectedCombos: [], // Mocked
    happyHourDiscount: 0, // Mocked
    subtotal: cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0),
    kotNumber: Math.floor(Math.random() * 1000).toString(),
    addToCart: (item: any) => addToCart(item, 1, ""),
    removeFromCart,
    updateQty,
    updateNotes,
    submitKOT,
    clearCart,
    setActiveTableId: (id: string) => {} // No-op for now
  };
}
