// RESPONSIBILITY: Renders the active order panels including summary, extra charges, discounts, CRM, and split payment.
// DATA FLOW: Props from CashierOrchestrator -> CashierActiveOrderPanel -> Individual Panels

"use client";

import { Printer, DollarSign, Split } from "lucide-react";
import { CashierOrderSummary } from "@/app/cashier/cashier_components/CashierOrderSummary";
import { CashierExtraChargesPanel } from "@/app/cashier/cashier_components/CashierExtraChargesPanel";
import { CashierDiscountPanel } from "@/app/cashier/cashier_components/CashierDiscountPanel";
import { CashierCrmPanel } from "@/app/cashier/cashier_components/CashierCrmPanel";
import { CashierSplitPaymentPanel } from "@/app/cashier/cashier_components/CashierSplitPaymentPanel";

export function CashierActiveOrderPanel({
  selectedTableId,
  selectedTableNumber,
  cartItems,
  taxBreakdown,
  includeServiceCharge,
  customTip,
  packagingCharge,
  appliedDiscount,
  crmCustomerPhone,
  crmCustomerName,
  toggleServiceCharge,
  handleProceedToPayment,
  setIsThermalPreviewOpen,
  setIsCashCalcOpen,
  setIsGuestSplitOpen,
  setCustomTip,
  setPackagingCharge,
  applyDiscount,
  clearDiscount,
  setLoyaltyRedeemed,
  setCrmRedeemAmount,
  setCrmCustomerPhone,
  setCrmCustomerName,
  handlePaymentReady,
  isProcessing,
}: any) {
  return (
    <div className="flex flex-col gap-4">
      {selectedTableId && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Bill Summary & Breakdown
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsThermalPreviewOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-page px-2.5 py-1 text-xs font-bold text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
            >
              <Printer size={18} strokeWidth={2} className="text-primary" />
              <span>80mm Thermal Receipt</span>
            </button>

            <button
              onClick={() => setIsCashCalcOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-500 hover:bg-emerald-500/20 motion-safe:transition-colors"
            >
              <DollarSign size={18} strokeWidth={2} />
              <span>Cash Calc [F9]</span>
            </button>

            <button
              onClick={() => setIsGuestSplitOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20 motion-safe:transition-colors"
            >
              <Split size={18} strokeWidth={2} />
              <span>Guest Split</span>
            </button>
          </div>
        </div>
      )}

      <CashierOrderSummary
        cartItems={cartItems}
        taxBreakdown={taxBreakdown}
        includeServiceCharge={includeServiceCharge}
        onToggleServiceCharge={toggleServiceCharge}
        onProceedToPayment={handleProceedToPayment}
        isProcessing={isProcessing}
      />

      {selectedTableId && cartItems.length > 0 && (
        <>
          <CashierExtraChargesPanel
            customTip={customTip}
            packagingCharge={packagingCharge}
            onSetTip={setCustomTip}
            onSetPackaging={setPackagingCharge}
          />
          <CashierDiscountPanel
            appliedDiscount={appliedDiscount}
            onApply={applyDiscount}
            onClear={clearDiscount}
          />
          <CashierCrmPanel
            totalAmount={taxBreakdown.totalAmount}
            customerPhone={crmCustomerPhone}
            onRedeemChange={(amount: number) => {
              setLoyaltyRedeemed(amount);
              setCrmRedeemAmount(amount);
            }}
            onCustomerChange={(phone: string, name: string) => {
              setCrmCustomerPhone(phone);
              setCrmCustomerName(name);
            }}
          />
          <CashierSplitPaymentPanel
            totalAmount={taxBreakdown.totalAmount}
            onPaymentReady={handlePaymentReady}
          />
        </>
      )}
    </div>
  );
}
