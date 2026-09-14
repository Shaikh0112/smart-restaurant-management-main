// RESPONSIBILITY: Renders one KPI stat card for the Waiter Dashboard.
import { type LucideIcon } from "lucide-react";

export interface DashboardKpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

export function DashboardKpiCard({ icon: Icon, label, value, trend, trendUp }: DashboardKpiCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-2">
        <Icon size={18} className="shrink-0 text-primary" aria-hidden="true" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">{label}</span>
      </div>
      <p className="text-[28px] font-bold leading-none text-text-primary">{value}</p>
      {trend !== undefined && (
        <p className={["text-[12px] font-medium", trendUp === true ? "text-success" : "text-danger"].join(" ")}>
          {trend}
        </p>
      )}
    </div>
  );
}
