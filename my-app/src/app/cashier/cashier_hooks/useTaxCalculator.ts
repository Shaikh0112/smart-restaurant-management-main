// RESPONSIBILITY: useTaxCalculator module logic and UI.
// DATA FLOW: Local component state -> External API
// @ts-nocheck
"use client";

import { useMemo, useState } from "react";
import type { CashierCartItem, CashierTaxBreakdown, CashierDiscount } from "@/app/cashier/cashier_types/CashierTypes";

const BAR_STATION = "Bar" as const;

// Default config that will eventually be fetched from backend
const DEFAULT_TAX_CONFIG = {
  cgstRate: 0.025,
  sgstRate: 0.025,
  serviceChargeRate: 0.05,
  liquorVatRate: 0.18,
};

export function calculateTax(
  items: CashierCartItem[],
  includeServiceCharge: boolean,
  discount: CashierDiscount | null,
  loyaltyRedeemed: number,
  customTip: number = 0,
  packagingCharge: number = 0,
  taxConfig = DEFAULT_TAX_CONFIG
): CashierTaxBreakdown {
  const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);

  const barSubtotal = items
    .filter((i) => i.station === BAR_STATION)
    .reduce((sum, i) => sum + i.totalPrice, 0);
  
  const vat = barSubtotal * taxConfig.liquorVatRate;
  const cgst = subtotal * taxConfig.cgstRate;
  const sgst = subtotal * taxConfig.sgstRate;
  const serviceCharge = includeServiceCharge ? subtotal * taxConfig.serviceChargeRate : 0;

  let discountAmount = 0;
  if (discount) {
    if (discount.type === "PERCENT") {
      discountAmount = (subtotal * discount.value) / 100;
    } else if (discount.type === "FLAT" || discount.type === "NC") {
      discountAmount = discount.value;
    }
  }

  const preTotalExact =
    subtotal + cgst + sgst + serviceCharge + vat + customTip + packagingCharge - discountAmount - loyaltyRedeemed;

  const totalRounded = Math.round(preTotalExact);
  const roundOff = totalRounded - preTotalExact;

  return {
    subtotal,
    cgst,
    sgst,
    serviceCharge,
    vat,
    discount: discountAmount,
    loyaltyRedeemed,
    customTip,
    packagingCharge,
    roundingAdjustment: roundOff,
    roundOff,
    totalAmount: Math.max(0, totalRounded),
  };
}

export function useTaxCalculator(
  cartItems: CashierCartItem[],
  includeServiceCharge: boolean,
  appliedDiscount: CashierDiscount | null,
  loyaltyRedeemed: number,
  customTip: number,
  packagingCharge: number
) {
  // Simulating fetching config from backend
  const [taxConfig] = useState(DEFAULT_TAX_CONFIG);

  return useMemo(
    () => calculateTax(cartItems, includeServiceCharge, appliedDiscount, loyaltyRedeemed, customTip, packagingCharge, taxConfig),
    [cartItems, includeServiceCharge, appliedDiscount, loyaltyRedeemed, customTip, packagingCharge, taxConfig]
  );
}
