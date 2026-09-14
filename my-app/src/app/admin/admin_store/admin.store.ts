// RESPONSIBILITY: Utility or types for admin.store.ts.
// DATA FLOW: N/A

import { create } from "zustand";

interface AdminState {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;
  activeModal: string | null;
  setActiveModal: (modalId: string | null) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isSidebarCollapsed: false,
  setSidebarCollapsed: (val) => set({ isSidebarCollapsed: val }),
  activeModal: null,
  setActiveModal: (modalId) => set({ activeModal: modalId }),
}));
