// RESPONSIBILITY: Server Component root for Waiter Dashboard.
// Pre-fetches metrics server-side (mocked here, delegates to a Client orchestrator if needed).

import { IndianRupee, ShoppingBag, TableProperties, TrendingUp, Wallet, Clock } from "lucide-react";
import { DashboardKpiCard } from "@/app/waiter/waiter_components/DashboardKpiCard";

export default function WaiterDashboardPage() {
  // In a real Server Component, we would fetch KPIs directly from the DB/API here.
  // For now, we mock server-side fetched data.
  const kpis = {
    todayRevenue: 0,
    activeOrders: 0,
    occupiedTables: 0,
    totalTables: 20,
    avgOrderValue: 0,
    shiftSales: 0,
    pendingKots: 0
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary">Live overview of today's restaurant operations</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <DashboardKpiCard icon={IndianRupee} label="Today's Revenue" value={`₹${kpis.todayRevenue}`} trend="Last 24 hours" trendUp={kpis.todayRevenue > 0} />
        <DashboardKpiCard icon={ShoppingBag} label="Active Orders" value={String(kpis.activeOrders)} trend={kpis.activeOrders > 0 ? "Tables being served" : "No active orders"} trendUp={kpis.activeOrders > 0} />
        <DashboardKpiCard icon={TableProperties} label="Tables Occupied" value={`${kpis.occupiedTables} / ${kpis.totalTables}`} trend={kpis.occupiedTables > 0 ? "Including billing pending" : "All tables free"} trendUp={kpis.occupiedTables > 0} />
        <DashboardKpiCard icon={TrendingUp} label="Avg Order Value" value={`₹${kpis.avgOrderValue}`} trend="Today's average" trendUp={kpis.avgOrderValue > 0} />
        <DashboardKpiCard icon={Wallet} label="Shift Sales" value={`₹${kpis.shiftSales}`} trend="Current open shift" trendUp={kpis.shiftSales > 0} />
        <DashboardKpiCard icon={Clock} label="Pending KOTs" value={String(kpis.pendingKots)} trend={kpis.pendingKots > 0 ? "Pending + Cooking items" : "Kitchen clear"} trendUp={false} />
      </div>
    </div>
  );
}
