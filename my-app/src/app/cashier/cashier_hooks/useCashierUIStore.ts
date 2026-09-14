// RESPONSIBILITY: useCashierUIStore module logic and UI.
// DATA FLOW: Local component state -> External API
import { create } from 'zustand';

interface CashierUIState {
  isGuestSplitOpen: boolean;
  isReconcileOpen: boolean;
  isUpiQrOpen: boolean;
  isReceiptOpen: boolean;
  isDenomOpen: boolean;
  isApprovalOpen: boolean;
  isManagerPinOpen: boolean;
  isThermalPreviewOpen: boolean;
  isShortcutsOpen: boolean;
  isCashCalcOpen: boolean;
  isStockRecoveryOpen: boolean;

  setModalOpen: (modalName: keyof Omit<CashierUIState, 'setModalOpen' | 'closeAll'>, isOpen: boolean) => void;
  closeAll: () => void;
}

export const useCashierUIStore = create<CashierUIState>((set) => ({
  isGuestSplitOpen: false,
  isReconcileOpen: false,
  isUpiQrOpen: false,
  isReceiptOpen: false,
  isDenomOpen: false,
  isApprovalOpen: false,
  isManagerPinOpen: false,
  isThermalPreviewOpen: false,
  isShortcutsOpen: false,
  isCashCalcOpen: false,
  isStockRecoveryOpen: false,

  setModalOpen: (modalName, isOpen) => set((state) => ({ ...state, [modalName]: isOpen })),
  closeAll: () => set({
    isGuestSplitOpen: false,
    isReconcileOpen: false,
    isUpiQrOpen: false,
    isReceiptOpen: false,
    isDenomOpen: false,
    isApprovalOpen: false,
    isManagerPinOpen: false,
    isThermalPreviewOpen: false,
    isShortcutsOpen: false,
    isCashCalcOpen: false,
    isStockRecoveryOpen: false,
  })
}));
