"use client";
import { CashierActiveOrderPanel } from "@/app/cashier/cashier_components/CashierActiveOrderPanel";
import { CashierKeyboardManager } from "@/app/cashier/cashier_components/CashierKeyboardManager";
// @ts-nocheck

// RESPONSIBILITY: Cashier POS page shell.
import { useState, useEffect, useCallback, useMemo } from "react";
import { Split } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import { useCashierOrder } from "@/app/cashier/cashier_hooks/useCashierOrder";
import { useCashierCheckout } from "@/app/cashier/cashier_hooks/useCashierCheckout";

import { useCashierCustomerSync } from "@/app/cashier/cashier_hooks/useCashierCustomerSync";
import { useCashierShiftMetrics } from "@/app/cashier/cashier_shift/useCashierShiftMetrics";

import { CashierTableSelector } from "@/app/cashier/cashier_components/CashierTableSelector";
import { CashierOrderSummary } from "@/app/cashier/cashier_components/CashierOrderSummary";
import { CashierDiscountPanel } from "@/app/cashier/cashier_components/CashierDiscountPanel";
import { CashierCrmPanel } from "@/app/cashier/cashier_components/CashierCrmPanel";
import { CashierSplitPaymentPanel } from "@/app/cashier/cashier_components/CashierSplitPaymentPanel";
import { CashierExtraChargesPanel } from "@/app/cashier/cashier_components/CashierExtraChargesPanel";
import { CashierShiftSummaryBar } from "@/app/cashier/cashier_components/CashierShiftSummaryBar";
import { CashierModals } from "@/app/cashier/cashier_components/CashierModals";

import { CashierPageHeader } from "@/app/cashier/cashier_shift/CashierPageHeader";
import { Calculator, ShieldCheck, Printer, Keyboard, DollarSign, KeyRound, Package } from "lucide-react";

import type {
  CashierPaymentMode,
  CashierSingleMethod,
  CashierSplitPaymentValues,
} from "@/app/cashier/cashier_types/CashierTypes";
import type { AppCrmCustomer, AppServiceRequest, AppLowStockAlert } from "@/types/appTypes";

const SKELETON_ROWS = 3 as const;

export function CashierOrchestrator() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [crmCustomers, setCrmCustomers] = useLocalStorage<AppCrmCustomer[]>(STORAGE_KEYS.CRM_CUSTOMERS, []);
  const [serviceRequests]               = useLocalStorage<AppServiceRequest[]>(STORAGE_KEYS.SERVICE_REQUESTS, []);

  const {
    cashierTables,
    selectedTableId,
    cartItems,
    taxBreakdown,
    includeServiceCharge,
    appliedDiscount,
    customTip,
    packagingCharge,
    selectTable,
    toggleServiceCharge,
    applyDiscount,
    clearDiscount,
    setLoyaltyRedeemed,
    setCustomTip,
    setPackagingCharge,
  } = useCashierOrder();

  const { status, processCheckout, buildWhatsAppLink, buildReceiptText } = useCashierCheckout();

  // Modal & Panel States
  const [paymentMode,   setPaymentMode]   = useState<CashierPaymentMode>("SINGLE");
  const [singleMethod,  setSingleMethod]  = useState<CashierSingleMethod>("CASH");
  const [splitValues,   setSplitValues]   = useState<CashierSplitPaymentValues>({ cash: 0, upi: 0, card: 0 });
  const [isUpiQrOpen,   setIsUpiQrOpen]   = useState<boolean>(false);
  const [isGuestSplitOpen, setIsGuestSplitOpen] = useState<boolean>(false);
  const [isReconcileOpen, setIsReconcileOpen]   = useState<boolean>(false);
  const [isDenomOpen, setIsDenomOpen]         = useState<boolean>(false);
  const [isApprovalOpen, setIsApprovalOpen]     = useState<boolean>(false);

  // New Enterprise POS Modal States
  const [isManagerPinOpen, setIsManagerPinOpen]   = useState<boolean>(false);
  const [isThermalPreviewOpen, setIsThermalPreviewOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen]     = useState<boolean>(false);
  const [isCashCalcOpen, setIsCashCalcOpen]       = useState<boolean>(false);

  // Stock Recovery Hub State
  const [stockAlerts] = useLocalStorage<AppLowStockAlert[]>(STORAGE_KEYS.STOCK_ALERTS, []);
  const [isStockRecoveryOpen, setIsStockRecoveryOpen] = useState<boolean>(false);
  const activeStockAlertsCount = useMemo(
    () => stockAlerts.filter((a) => a.status !== "RESTOCKED").length,
    [stockAlerts]
  );

  // Receipt modal state
  const [isReceiptOpen,  setIsReceiptOpen]  = useState<boolean>(false);
  const [receiptWaLink,  setReceiptWaLink]  = useState<string>("");

  // CRM customer state
  const [crmCustomerPhone, setCrmCustomerPhone] = useState<string>("");
  const [crmCustomerName,  setCrmCustomerName]  = useState<string>("");
  const [crmRedeemAmount,  setCrmRedeemAmount]  = useState<number>(0);

  // Snapshot customer info specifically for receipt modal
  const [receiptCustomerPhone, setReceiptCustomerPhone] = useState<string>("");
  const [receiptCustomerName,  setReceiptCustomerName]  = useState<string>("");

  const selectedTableInfo   = cashierTables.find((bt) => bt.table.id === selectedTableId);
  const selectedTableNumber = selectedTableInfo?.table.tableNumber ?? "";
  const selectedOrderId     = selectedTableInfo?.order.id ?? "";

  const { shiftMetrics } = useCashierShiftMetrics();

  const handlePaymentReady = useCallback(
    (mode: CashierPaymentMode, method: CashierSingleMethod, split: CashierSplitPaymentValues) => {
      setPaymentMode(mode);
      setSingleMethod(method);
      setSplitValues(split);
    },
    []
  );

  const { resolveCustomerPhoneForCheckout, clearCustomerData, normKey } = useCashierCustomerSync({
    selectedTableId,
    selectedTableNumber,
    serviceRequests,
    selectedTableInfo,
    setCrmCustomerPhone,
    setCrmCustomerName,
  });

  const handleCheckout = useCallback(async () => {
    const resolvedPhone = resolveCustomerPhoneForCheckout(crmCustomerPhone);
    const targetPhone = resolvedPhone || "";
    
    const normSelNum = normKey(selectedTableNumber);
    const targetName  = crmCustomerName || (targetPhone ? `Guest (Table ${selectedTableNumber || normSelNum})` : "");

    setReceiptCustomerPhone(targetPhone);
    setReceiptCustomerName(targetName);
    if (targetPhone) setCrmCustomerPhone(targetPhone);

    const success = await processCheckout({
      orderId:       selectedOrderId,
      tableNumber:   selectedTableNumber,
      taxBreakdown,
      cartItems,
      paymentMode,
      singleMethod,
      splitValues,
      customerPhone: targetPhone,
      loyaltyEarned: Math.floor(taxBreakdown.totalAmount * 0.05),
      redeemAmount:  crmRedeemAmount,
    });

    if (!success) return;

    if (targetPhone && targetPhone.length >= 10) {
      const receiptText = buildReceiptText(cartItems, taxBreakdown, selectedTableNumber);
      const link = buildWhatsAppLink(targetPhone, receiptText);
      setReceiptWaLink(link);
    } else {
      setReceiptWaLink("");
    }

    setIsReceiptOpen(true);
  }, [
    processCheckout, selectedOrderId, selectedTableNumber, taxBreakdown, cartItems,
    paymentMode, singleMethod, splitValues, crmCustomerPhone, crmCustomerName,
    crmRedeemAmount, buildReceiptText, buildWhatsAppLink, resolveCustomerPhoneForCheckout, normKey
  ]);

  // Task 38: Implement useBeforeUnload to prevent accidental loss of state
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (selectedTableId || cartItems.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [selectedTableId, cartItems.length]);

  function handleProceedToPayment() {
    if (!selectedOrderId || !selectedTableNumber) return;
    if (singleMethod === "UPI" && paymentMode === "SINGLE") {
      setIsUpiQrOpen(true);
      return;
    }
    void handleCheckout();
  }



  function handleUpiConfirm() {
    setIsUpiQrOpen(false);
    void handleCheckout();
  }

  function handleReceiptClose() {
    clearCustomerData();
    setIsReceiptOpen(false);
    setReceiptWaLink("");
    setReceiptCustomerPhone("");
    setReceiptCustomerName("");
    setCrmCustomerPhone("");
    setCrmCustomerName("");
    setCrmRedeemAmount(0);
    selectTable("");
  }

  function handleSaveCustomerWhatsApp(phone: string) {
    setCrmCustomers((prev) => {
      if (prev.some((c) => c.phone === phone)) return prev;
      return [
        ...prev,
        {
          name: "Guest",
          phone,
          loyaltyPoints: 0,
          totalVisits: 0,
          history: [],
        },
      ];
    });
  }

  if (!isMounted) {
    return (
      <div className="rounded-xl border border-primary/20 bg-white/10 backdrop-blur-lg p-6 shadow-lg flex flex-col gap-6">
        <CashierPageHeader />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <div className="flex flex-col gap-2">
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-lg" />
            ))}
          </div>
          <div className="skeleton h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-white/10 backdrop-blur-lg p-6 shadow-lg flex flex-col gap-6">
      <CashierPageHeader
        onOpenDenom={() => setIsDenomOpen(true)}
        onOpenApproval={() => setIsApprovalOpen(true)}
        onOpenPin={() => setIsManagerPinOpen(true)}
        onOpenHotkeys={() => setIsShortcutsOpen(true)}
        onOpenStockRecovery={() => setIsStockRecoveryOpen(true)}
        activeStockAlertsCount={activeStockAlertsCount}
      />

      <CashierShiftSummaryBar
        metrics={shiftMetrics}
        onOpenReconciliation={() => setIsReconcileOpen(true)}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Pending Tables ({cashierTables.length})
          </p>
          <CashierTableSelector
            tables={cashierTables}
            selectedTableId={selectedTableId}
            onSelect={selectTable}
          />
        </div>

        <CashierActiveOrderPanel
          selectedTableId={selectedTableId}
          selectedTableNumber={selectedTableNumber}
          cartItems={cartItems}
          taxBreakdown={taxBreakdown}
          includeServiceCharge={includeServiceCharge}
          customTip={customTip}
          packagingCharge={packagingCharge}
          appliedDiscount={appliedDiscount}
          crmCustomerPhone={crmCustomerPhone}
          crmCustomerName={crmCustomerName}
          toggleServiceCharge={toggleServiceCharge}
          handleProceedToPayment={handleProceedToPayment}
          setIsThermalPreviewOpen={setIsThermalPreviewOpen}
          setIsCashCalcOpen={setIsCashCalcOpen}
          setIsGuestSplitOpen={setIsGuestSplitOpen}
          setCustomTip={setCustomTip}
          setPackagingCharge={setPackagingCharge}
          applyDiscount={applyDiscount}
          clearDiscount={clearDiscount}
          setLoyaltyRedeemed={setLoyaltyRedeemed}
          setCrmRedeemAmount={setCrmRedeemAmount}
          setCrmCustomerPhone={setCrmCustomerPhone}
          setCrmCustomerName={setCrmCustomerName}
          handlePaymentReady={handlePaymentReady}
          isProcessing={status === 'loading'}
        />
      </div>

      <CashierModals
        isGuestSplitOpen={isGuestSplitOpen} setIsGuestSplitOpen={setIsGuestSplitOpen}
        selectedTableNumber={selectedTableNumber} cartItems={cartItems} taxBreakdown={taxBreakdown}
        isReconcileOpen={isReconcileOpen} setIsReconcileOpen={setIsReconcileOpen} shiftMetrics={shiftMetrics}
        isUpiQrOpen={isUpiQrOpen} setIsUpiQrOpen={setIsUpiQrOpen} handleUpiConfirm={handleUpiConfirm}
        isReceiptOpen={isReceiptOpen} receiptCustomerName={receiptCustomerName} crmCustomerName={crmCustomerName}
        receiptCustomerPhone={receiptCustomerPhone} crmCustomerPhone={crmCustomerPhone} receiptWaLink={receiptWaLink}
        handleSaveCustomerWhatsApp={handleSaveCustomerWhatsApp} handleReceiptClose={handleReceiptClose}
        isDenomOpen={isDenomOpen} setIsDenomOpen={setIsDenomOpen}
        isApprovalOpen={isApprovalOpen} setIsApprovalOpen={setIsApprovalOpen}
        isManagerPinOpen={isManagerPinOpen} setIsManagerPinOpen={setIsManagerPinOpen}
        isThermalPreviewOpen={isThermalPreviewOpen} setIsThermalPreviewOpen={setIsThermalPreviewOpen}
        isShortcutsOpen={isShortcutsOpen} setIsShortcutsOpen={setIsShortcutsOpen}
        isCashCalcOpen={isCashCalcOpen} setIsCashCalcOpen={setIsCashCalcOpen} handleProceedToPayment={handleProceedToPayment}
        isStockRecoveryOpen={isStockRecoveryOpen} setIsStockRecoveryOpen={setIsStockRecoveryOpen}
      />
    
      <CashierKeyboardManager
        onManagerPinOpen={() => setIsManagerPinOpen(true)}
        onProceedToPayment={handleProceedToPayment}
        onCashCalcOpen={() => setIsCashCalcOpen(true)}
      />
    </div>
  );
}
