export type WaiterViewMode = "grid" | "floor-map";
export type WaiterTableSection = "All" | "Dining" | "AC" | "Outdoor";
export type KotPriority = "NORMAL" | "RUSH" | "VIP";

export interface DashboardKpiData {
  todayRevenue: number;
  activeOrders: number;
  occupiedTables: number;
  totalTables: number;
  avgOrderValue: number;
  shiftSales: number;
  pendingKots: number;
}
