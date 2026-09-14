// RESPONSIBILITY: Module-scoped UI state for Waiter (no API data here).
import { create } from 'zustand';

interface WaiterState {
  viewMode: 'grid' | 'floor-map';
  setViewMode: (mode: 'grid' | 'floor-map') => void;
  
  activeTableId: string | null;
  setActiveTableId: (id: string | null) => void;
  
  isTableActionsDrawerOpen: boolean;
  setTableActionsDrawerOpen: (isOpen: boolean) => void;
  
  isOrderModalOpen: boolean;
  setOrderModalOpen: (isOpen: boolean) => void;
}

export const useWaiterStore = create<WaiterState>((set) => ({
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),
  
  activeTableId: null,
  setActiveTableId: (id) => set({ activeTableId: id }),
  
  isTableActionsDrawerOpen: false,
  setTableActionsDrawerOpen: (isOpen) => set({ isTableActionsDrawerOpen: isOpen }),
  
  isOrderModalOpen: false,
  setOrderModalOpen: (isOpen) => set({ isOrderModalOpen: isOpen })
}));
