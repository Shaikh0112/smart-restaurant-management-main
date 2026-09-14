// RESPONSIBILITY: CashierModals module logic and UI.
import { CashierGuestSplitModal } from "./CashierGuestSplitModal";
import { CashierShiftReconciliationModal } from "./CashierShiftReconciliationModal";
import { CashierUpiQrModal } from "./CashierUpiQrModal";
import { CashierReceiptModal } from "./CashierReceiptModal";
import { CashierCashDenominationModal } from "./CashierCashDenominationModal";
import { CashierApprovalCenterModal } from "./CashierApprovalCenterModal";
import { CashierManagerPinModal } from "./CashierManagerPinModal";
import { CashierThermalReceiptPreviewModal } from "./CashierThermalReceiptPreviewModal";
import { CashierKeyboardShortcutsModal } from "./CashierKeyboardShortcutsModal";
import { CashierCashCalculatorModal } from "./CashierCashCalculatorModal";
import { CashierStockRecoveryModal } from "./CashierStockRecoveryModal";

export function CashierModals({
  // Guest Split
  isGuestSplitOpen, setIsGuestSplitOpen,
  selectedTableNumber, cartItems, taxBreakdown,
  
  // Shift Reconcile
  isReconcileOpen, setIsReconcileOpen, shiftMetrics,

  // UPI
  isUpiQrOpen, setIsUpiQrOpen, handleUpiConfirm,

  // Receipt
  isReceiptOpen, receiptCustomerName, crmCustomerName, receiptCustomerPhone, crmCustomerPhone, receiptWaLink, handleSaveCustomerWhatsApp, handleReceiptClose,

  // Denomination
  isDenomOpen, setIsDenomOpen,

  // Approval
  isApprovalOpen, setIsApprovalOpen,

  // Manager PIN
  isManagerPinOpen, setIsManagerPinOpen,

  // Thermal Preview
  isThermalPreviewOpen, setIsThermalPreviewOpen,

  // Shortcuts
  isShortcutsOpen, setIsShortcutsOpen,

  // Cash Calc
  isCashCalcOpen, setIsCashCalcOpen, handleProceedToPayment,

  // Stock Recovery
  isStockRecoveryOpen, setIsStockRecoveryOpen
}: any) {
  return (
    <>
      <CashierGuestSplitModal
        isOpen={isGuestSplitOpen}
        tableNumber={selectedTableNumber}
        cartItems={cartItems}
        taxBreakdown={taxBreakdown}
        onClose={() => setIsGuestSplitOpen(false)}
      />
      <CashierShiftReconciliationModal
        isOpen={isReconcileOpen}
        metrics={shiftMetrics}
        onClose={() => setIsReconcileOpen(false)}
      />
      <CashierUpiQrModal
        isOpen={isUpiQrOpen}
        amount={taxBreakdown.totalAmount}
        tableNumber={selectedTableNumber}
        onConfirm={handleUpiConfirm}
        onClose={() => setIsUpiQrOpen(false)}
      />
      <CashierReceiptModal
        isOpen={isReceiptOpen}
        cartItems={cartItems}
        taxBreakdown={taxBreakdown}
        tableNumber={selectedTableNumber}
        customerName={receiptCustomerName || crmCustomerName}
        customerPhone={receiptCustomerPhone || crmCustomerPhone}
        whatsAppLink={receiptWaLink}
        onSaveCustomerWhatsApp={handleSaveCustomerWhatsApp}
        onClose={handleReceiptClose}
      />
      <CashierCashDenominationModal
        isOpen={isDenomOpen}
        onClose={() => setIsDenomOpen(false)}
        expectedCash={shiftMetrics.cashCollected}
      />
      <CashierApprovalCenterModal
        isOpen={isApprovalOpen}
        onClose={() => setIsApprovalOpen(false)}
      />
      <CashierManagerPinModal
        isOpen={isManagerPinOpen}
        onClose={() => setIsManagerPinOpen(false)}
        onSuccess={() => undefined}
      />
      <CashierThermalReceiptPreviewModal
        isOpen={isThermalPreviewOpen}
        onClose={() => setIsThermalPreviewOpen(false)}
        tableNumber={selectedTableNumber}
        cartItems={cartItems}
        taxBreakdown={taxBreakdown}
        customerPhone={crmCustomerPhone}
        customerName={crmCustomerName}
      />
      <CashierKeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
      <CashierCashCalculatorModal
        isOpen={isCashCalcOpen}
        onClose={() => setIsCashCalcOpen(false)}
        payableAmount={taxBreakdown.totalAmount}
        onConfirmPayment={handleProceedToPayment}
      />
      <CashierStockRecoveryModal
        isOpen={isStockRecoveryOpen}
        onClose={() => setIsStockRecoveryOpen(false)}
      />
    </>
  );
}
