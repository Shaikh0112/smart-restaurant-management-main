// RESPONSIBILITY: useCheckoutSales module logic and UI.
// DATA FLOW: Local component state -> External API
import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import type { AppSalesRecord, PaymentMethod } from "@/types/appTypes";
import type { CashierCheckoutPayload } from "@/app/cashier/cashier_types/CashierTypes";

function resolvePaymentMethod(
  paymentMode: CashierCheckoutPayload["paymentMode"],
  singleMethod: CashierCheckoutPayload["singleMethod"]
): PaymentMethod {
  if (paymentMode === "SINGLE") return singleMethod;
  return "SPLIT";
}

export function useCheckoutSales() {
  const [, setSalesHistory] = useLocalStorage<AppSalesRecord[]>(STORAGE_KEYS.SALES_HISTORY, []);

  const recordSale = useCallback((payload: CashierCheckoutPayload, saleId: string, timestamp: number, cashierId: string) => {
    const paymentMethod = resolvePaymentMethod(payload.paymentMode, payload.singleMethod);
    const splitDetails =
      paymentMethod === "SPLIT"
        ? { cash: payload.splitValues.cash, upi: payload.splitValues.upi, card: payload.splitValues.card }
        : null;

    const salesRecord: AppSalesRecord = {
      id: saleId,
      orderId: payload.orderId,
      tableNumber: payload.tableNumber,
      subtotal: payload.taxBreakdown.subtotal,
      cgst: payload.taxBreakdown.cgst,
      sgst: payload.taxBreakdown.sgst,
      serviceCharge: payload.taxBreakdown.serviceCharge,
      vat: payload.taxBreakdown.vat,
      discount: payload.taxBreakdown.discount,
      loyaltyRedeemed: payload.taxBreakdown.loyaltyRedeemed,
      totalAmount: payload.taxBreakdown.totalAmount,
      paymentMethod,
      splitDetails,
      cashierId,
      timestamp,
      customerPhone: payload.customerPhone || undefined,
    };

    setSalesHistory((prev) => [...prev, salesRecord]);
    return paymentMethod;
  }, [setSalesHistory]);

  return { recordSale };
}
