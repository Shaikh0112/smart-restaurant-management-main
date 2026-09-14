export interface SuperAdminDashboardKpi {
  totalRevenue: number;
  totalHotels: number;
  joinedToday: number;
  pendingAuditCount: number;
  paidHotelsCount: number;
  activePosCount: number;
}

export interface SuperAdminMonthlyRevenueStat {
  month: string;
  revenue: number;
}
