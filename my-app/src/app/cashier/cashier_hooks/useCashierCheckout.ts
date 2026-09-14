// RESPONSIBILITY: useCashierCheckout module logic and UI.
// DATA FLOW: Local component state -> External API
"use client";

import { useCallback } from "react";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import type { CashierCartItem, CashierTaxBreakdown, CashierCheckoutPayload, UseCashierCheckoutReturn } from "@/app/cashier/cashier_types/CashierTypes";
import { useCheckoutInventory } from "./useCheckoutInventory";
import { useCheckoutSales } from "./useCheckoutSales";
import { useCheckoutCrm } from "./useCheckoutCrm";
import { useCheckoutOrder } from "./useCheckoutOrder";
import { useCheckoutTable } from "./useCheckoutTable";
import { useCheckoutAudit } from "./useCheckoutAudit";
import { useCheckoutNotification } from "./useCheckoutNotification";
import { useTransaction } from "./useTransaction";
import { useCashierSession } from "./useCashierSession";

const WHATSAPP_BASE_URL = "https://wa.me/" as const;
const RECEIPT_DIVIDER   = "─────────────────────────" as const;

export function buildWhatsAppLink(phone: string, receiptText: string): string {
  const digits  = phone.replace(/\D/g, "");
  const e164    = digits.startsWith("91") ? digits : `91${digits}`;
  const encoded = encodeURIComponent(receiptText);
  return `${WHATSAPP_BASE_URL}${e164}?text=${encoded}`;
}

export function buildReceiptText(
  cartItems:    CashierCartItem[],
  taxBreakdown: CashierTaxBreakdown,
  tableNumber:  string,
  restaurantName?: string
): string {
  const now   = formatDateTime(Date.now());
  const lines: string[] = [
    `️ ${restaurantName}`,
    `Table: ${tableNumber}  |  ${now}`,
    RECEIPT_DIVIDER,
  ];

  for (const item of cartItems) {
    const itemTotal = formatCurrency(item.totalPrice);
    lines.push(`${item.name} x${item.qty}  ${itemTotal}`);
  }

  lines.push(RECEIPT_DIVIDER);
  lines.push(`Subtotal       ${formatCurrency(taxBreakdown.subtotal)}`);

  if (taxBreakdown.cgst > 0) lines.push(`CGST (2.5%)    ${formatCurrency(taxBreakdown.cgst)}`);
  if (taxBreakdown.sgst > 0) lines.push(`SGST (2.5%)    ${formatCurrency(taxBreakdown.sgst)}`);
  if (taxBreakdown.serviceCharge > 0) lines.push(`Service (5%)   ${formatCurrency(taxBreakdown.serviceCharge)}`);
  if (taxBreakdown.vat > 0) lines.push(`Liquor VAT     ${formatCurrency(taxBreakdown.vat)}`);
  if (taxBreakdown.discount > 0) lines.push(`Discount       -${formatCurrency(taxBreakdown.discount)}`);
  if (taxBreakdown.loyaltyRedeemed > 0) lines.push(`Loyalty        -${formatCurrency(taxBreakdown.loyaltyRedeemed)}`);
  if (taxBreakdown.roundOff !== 0) lines.push(`Round Off      ${formatCurrency(taxBreakdown.roundOff)}`);

  lines.push(RECEIPT_DIVIDER);
  lines.push(`*TOTAL  ${formatCurrency(taxBreakdown.totalAmount)}*`);
  lines.push(RECEIPT_DIVIDER);
  lines.push("Thank you for dining with us! ");

  return lines.join("\n");
}

export function useCashierCheckout(): UseCashierCheckoutReturn {
  const { deductInventory } = useCheckoutInventory();
  const { recordSale } = useCheckoutSales();
  const { updateCrm } = useCheckoutCrm();
  const { completeOrder } = useCheckoutOrder();
  const { freeTable } = useCheckoutTable();
  const { logAudit } = useCheckoutAudit();
  const { notifyWaiters } = useCheckoutNotification();
  const { status, execute } = useTransaction();
  
  // Read current user from session
  const { user } = useCashierSession();

  const processCheckout = useCallback(
    async (
      payload: CashierCheckoutPayload, 
      config?: { restaurantName?: string; waiterRoute?: string; cashierId?: string }
    ): Promise<boolean> => {
      if (status === "loading") return false;
      if (!payload.orderId || !payload.tableNumber) {
        console.warn("[useCashierCheckout] orderId or tableNumber missing — aborting checkout");
        return false;
      }

      const result = await execute(async () => {
        // Simulate backend transaction wrapper
        const saleId = `sale-${Date.now()}`;
        const timestamp = Date.now();
        const activeCashierId = config?.cashierId || user.id;

        deductInventory(payload.cartItems);
        const paymentMethod = recordSale(payload, saleId, timestamp, activeCashierId);
        updateCrm(payload.customerPhone, payload.loyaltyEarned, payload.redeemAmount, payload.tableNumber, saleId);
        completeOrder(payload.orderId);
        freeTable(payload.tableNumber, payload.orderId);
        logAudit(timestamp, payload.orderId, payload.tableNumber, payload.taxBreakdown.totalAmount, paymentMethod, user.role);
        notifyWaiters(payload.tableNumber, config?.waiterRoute || "/waiter");

        // Simulate network delay for backend authoritative wrapper
        await new Promise((res) => setTimeout(res, 500));
        return true;
      });

      return !!result;
    },
    [status, execute, deductInventory, recordSale, updateCrm, completeOrder, freeTable, logAudit, notifyWaiters, user]
  );

  return {
    status,
    processCheckout,
    buildWhatsAppLink,
    buildReceiptText,
  };
}
