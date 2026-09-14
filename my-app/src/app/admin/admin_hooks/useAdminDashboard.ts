"use client";

// RESPONSIBILITY: All analytics and KPI calculation logic for the Admin Dashboard.
// Reads SALES_HISTORY, ORDERS, TABLES, SHIFT_REGISTER from localStorage.
// Derives KPI cards, last-7-days chart data, and payment split breakdown.
// No JSX --- pure logic hook consumed by admin/page.tsx.
// DATA FLOW: localStorage --- useLocalStorage --- calc functions --- UseAdminDashboardReturn
//            --- AdminKpiGrid + AdminRevenueChart + AdminPaymentDonut --- UI

import { useMemo } from "react";
import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  Clock,
  Wallet,
  AlertTriangle,
  TableProperties,
  CalendarClock,
} from "lucide-react";
import { useLocalStorage, getActiveTenantId } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import { formatCurrency, formatCurrencyCompact } from "@/lib/formatters";
import { isToday, calcLast7DaysStats, calcPaymentSplit, calcKitchenSpeed } from "./adminDashboardHelpers";
import type {
  AppOrder,
  AppSalesRecord,
  AppTable,
  AppShiftRegister,
  AppInventoryItem,
  AppAdvanceReservation,
} from "@/types/appTypes";
import type {
  AdminKpiCardData,
  AdminDailyStat,
  AdminPaymentSplit,
  UseAdminDashboardReturn,
} from "@/app/admin/admin_types/AdminTypes";

const STATUS_OCCUPIED       = "OCCUPIED"  as const;
const STATUS_BILLING        = "BILLING_PENDING" as const;



// --------- Hook ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Derives all Admin Dashboard analytics from localStorage data.
 * Returns KPI cards array, 7-day chart data, payment split, and transaction count.
 * All values are memoized --- recalculate only when source data changes.
 *
 * @returns kpiCards, dailyStats, paymentSplit, totalTransactions
 */
export function useAdminDashboard(): UseAdminDashboardReturn {
  // Rule 61: No direct localStorage --- hooks only
  const [salesHistory]  = useLocalStorage<AppSalesRecord[]>  (STORAGE_KEYS.SALES_HISTORY,  []);
  const [orders]        = useLocalStorage<AppOrder[]>        (STORAGE_KEYS.ORDERS,         []);
  const [tables]        = useLocalStorage<AppTable[]>        (STORAGE_KEYS.TABLES,         []);
  const [shiftRegister] = useLocalStorage<AppShiftRegister | null>(STORAGE_KEYS.SHIFT_REGISTER, null);
  const [inventory]     = useLocalStorage<AppInventoryItem[]> (STORAGE_KEYS.INVENTORY,      []);
  const [advanceReservations] = useLocalStorage<AppAdvanceReservation[]> (STORAGE_KEYS.ADVANCE_RESERVATIONS, []);

  // Deps: salesHistory --- today's revenue + avg order value + payment split
  const todaySales = useMemo(
    () => salesHistory.filter((s) => isToday(s.timestamp)),
    [salesHistory]
  );

  const activeTenantId = getActiveTenantId();

  const todayAdvanceBookings = useMemo(
    () => advanceReservations.filter((r) => isToday(r.createdAt) && r.paymentStatus === "PAID" && r.tenantId === activeTenantId),
    [advanceReservations, activeTenantId]
  );

  const todayAdvanceDepositTotal = useMemo(
    () => todayAdvanceBookings.reduce((sum, r) => sum + r.totalAdvanceDeposit, 0),
    [todayAdvanceBookings]
  );

  // Deps: todaySales & todayAdvanceBookings --- sum of today's totalAmount + advance deposits
  const todayRevenue = useMemo(
    () => todaySales.reduce((sum, s) => sum + s.totalAmount, 0) + todayAdvanceDepositTotal,
    [todaySales, todayAdvanceDepositTotal]
  );

  // Deps: todaySales --- avg order value today
  const avgOrderValue = useMemo(
    () => (todaySales.length > 0 ? todayRevenue / todaySales.length : 0),
    [todaySales, todayRevenue]
  );

  // Deps: tables --- occupied + billing_pending count
  const occupiedCount = useMemo(
    () => tables.filter((t) => t.status === STATUS_OCCUPIED || t.status === STATUS_BILLING).length,
    [tables]
  );

  // Deps: orders --- avg kitchen speed from COMPLETED orders
  const kitchenSpeed = useMemo(() => calcKitchenSpeed(orders), [orders]);

  // Deps: salesHistory --- last 7 days bar/line chart data
  const dailyStats = useMemo(() => calcLast7DaysStats(salesHistory), [salesHistory]);

  // Deps: salesHistory --- payment method breakdown
  const paymentSplit = useMemo(() => calcPaymentSplit(salesHistory), [salesHistory]);

  // Deps: salesHistory --- total transaction count (all time)
  const totalTransactions = salesHistory.length;

  // Deps: inventory - low stock items count
  const lowStockCount = useMemo(() => {
    return inventory.filter(item => item.currentStock <= item.threshold).length;
  }, [inventory]);

  // Deps: all derived values --- rebuild KPI cards array
  const kpiCards = useMemo((): AdminKpiCardData[] => [
    {
      id:      "today-revenue",
      label:   "Today's Revenue",
      value:   formatCurrencyCompact(todayRevenue),
      icon:    IndianRupee,
      trend:   "Last 24 hours",
      trendUp: todayRevenue > 0,
    },
    {
      id:      "today-orders",
      label:   "Orders Today",
      value:   String(todaySales.length),
      icon:    ShoppingBag,
      trend:   todaySales.length > 0 ? "Transactions completed" : "No sales yet",
      trendUp: todaySales.length > 0,
    },
    {
      id:      "avg-order",
      label:   "Avg Order Value",
      value:   formatCurrency(avgOrderValue),
      icon:    TrendingUp,
      trend:   "Today's average",
      trendUp: avgOrderValue > 0,
    },
    {
      id:      "tables-occupied",
      label:   "Tables Occupied",
      value:   `${occupiedCount} / ${tables.length}`,
      icon:    TableProperties,
      trend:   occupiedCount > 0 ? "Including billing pending" : "All tables free",
      trendUp: occupiedCount > 0,
    },
    {
      id:      "kitchen-speed",
      label:   "Kitchen Avg Speed",
      value:   `${kitchenSpeed} min`,
      icon:    Clock,
      trend:   "Avg across completed orders",
      trendUp: kitchenSpeed > 0 && kitchenSpeed <= 20,
    },
    {
      id:      "shift-sales",
      label:   "Shift Total Sales",
      value:   formatCurrencyCompact(shiftRegister?.totalSales ?? 0),
      icon:    Wallet,
      trend:   "Current open shift",
      trendUp: (shiftRegister?.totalSales ?? 0) > 0,
    },
    {
      id:      "advance-bookings",
      label:   "Advance Deposits",
      value:   formatCurrencyCompact(todayAdvanceDepositTotal),
      icon:    CalendarClock,
      trend:   `${todayAdvanceBookings.length} bookings today`,
      trendUp: todayAdvanceBookings.length > 0,
    },
    {
      id:      "low-stock",
      label:   "Low Stock Alerts",
      value:   String(lowStockCount),
      icon:    AlertTriangle,
      trend:   lowStockCount > 0 ? "Items need restock!" : "All stock healthy",
      trendUp: lowStockCount === 0, // Green if 0, Red if > 0
    },
  ], [todayRevenue, todaySales.length, avgOrderValue, occupiedCount, tables.length, kitchenSpeed, shiftRegister, lowStockCount, todayAdvanceDepositTotal, todayAdvanceBookings.length]);

  return {
    kpiCards,
    dailyStats,
    paymentSplit,
    totalTransactions,
  };
}
