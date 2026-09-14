// @ts-nocheck
"use client";

// RESPONSIBILITY: All Cashier POS data logic — reads ORDERS + MENU + TABLES from
// localStorage, filters BILLING_PENDING tables, aggregates all KOTs into a flat
// cart, calculates tax breakdown (CGST + SGST + Service Charge + Liquor VAT),
// and handles discount application.
// No JSX — pure logic hook consumed by cashier/page.tsx.
// DATA FLOW: localStorage → useLocalStorage → aggregateKots → calculateTax → cashier/page.tsx

import { useState, useCallback } from "react";
import { useCashierTablesQuery } from "./useCashierTablesQuery";
import { useCashierMenuQuery } from "./useCashierMenuQuery";
import { useCashierActiveOrdersQuery } from "./useCashierActiveOrdersQuery";
import { useCashierServiceRequestsQuery } from "./useCashierServiceRequestsQuery";

import type { AppOrder, AppTable, AppMenuItem, AppServiceRequest } from "@/types/appTypes";
import type {
  CashierDiscount,
  UseCashierOrderReturn,
} from "@/app/cashier/cashier_types/CashierTypes";

import { useOrderAggregation } from "./useOrderAggregation";
import { useKotAggregation } from "./useKotAggregation";
import { useTaxCalculator } from "./useTaxCalculator";

/**
 * Manages all Cashier POS state and calculations.
 * Reads BILLING_PENDING tables, aggregates KOTs, computes tax breakdown.
 *
 * @returns cashierTables, selectedTableId, cartItems, taxBreakdown, handlers
 */
export function useCashierOrder(): UseCashierOrderReturn & {
  customTip: number;
  packagingCharge: number;
  setCustomTip: (val: number) => void;
  setPackagingCharge: (val: number) => void;
} {
  // Phase 3: Data Architecture - Use Extracted React Query Hooks
  const { data: orders = [] } = useCashierActiveOrdersQuery();
  const { data: tables = [] } = useCashierTablesQuery();
  const { data: menuItems = [] } = useCashierMenuQuery();
  const { data: serviceRequests = [] } = useCashierServiceRequestsQuery();

  const [selectedTableId,      setSelectedTableId]      = useState<string>("");
  const [includeServiceCharge, setIncludeServiceCharge] = useState<boolean>(true);
  const [appliedDiscount,      setAppliedDiscount]      = useState<CashierDiscount | null>(null);
  const [loyaltyRedeemed,      setLoyaltyRedeemed]      = useState<number>(0);
  const [customTip,            setCustomTipState]       = useState<number>(0);
  const [packagingCharge,      setPackagingChargeState] = useState<number>(0);

  // Derive pending tables paired with active orders
  const cashierTables = useOrderAggregation(tables, orders, serviceRequests);

  // Aggregate KOTs for the selected table
  const cartItems = useKotAggregation(selectedTableId, cashierTables, menuItems);

  // Recalculate tax whenever cart, service charge, discount, or extra charges change
  const taxBreakdown = useTaxCalculator(
    cartItems,
    includeServiceCharge,
    appliedDiscount,
    loyaltyRedeemed,
    customTip,
    packagingCharge
  );

  // —— Actions —————————————————————————————————————————————————————————————————————

  const selectTable = useCallback((tableId: string) => {
    setSelectedTableId(tableId);
    setAppliedDiscount(null);
    setLoyaltyRedeemed(0);
    setCustomTipState(0);
    setPackagingChargeState(0);
  }, []);

  const toggleServiceCharge = useCallback((val: boolean) => {
    setIncludeServiceCharge(val);
  }, []);

  const applyDiscount = useCallback((discount: CashierDiscount) => {
    setAppliedDiscount(discount);
  }, []);

  const clearDiscount = useCallback(() => {
    setAppliedDiscount(null);
  }, []);

  return {
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
    setCustomTip: setCustomTipState,
    setPackagingCharge: setPackagingChargeState,
  };
}


