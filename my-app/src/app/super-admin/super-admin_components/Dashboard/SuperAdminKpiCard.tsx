import React from "react";
import type { LucideIcon } from "lucide-react";

export interface SuperAdminKpiCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconTextClass: string;
  trendIcon?: React.ReactNode;
  trendText?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const SuperAdminKpiCard: React.FC<SuperAdminKpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgClass,
  iconTextClass,
  trendIcon,
  trendText,
  onClick,
  isActive = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-card border ${isActive ? 'border-primary' : 'border-border'} rounded-lg p-4 flex flex-col gap-3 motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-1 hover:shadow-lg ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      style={{ backgroundImage: "linear-gradient(180deg, rgba(250,204,21,0.08), rgba(255,255,255,0.02))" }}
    >
      <div className="flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-md shrink-0 ${iconBgClass} ${iconTextClass}`}>
          <Icon size={16} strokeWidth={2} />
        </div>
        <span className="text-badge font-medium text-text-secondary uppercase tracking-wider">{title}</span>
      </div>
      <div>
        <p className="text-kpi-value font-bold text-text-primary">{value}</p>
        <p className={`text-table-header font-medium flex items-center gap-1 mt-1 ${trendText ? 'text-success' : 'text-text-secondary'}`}>
          {trendIcon} {trendText || subtitle}
        </p>
      </div>
    </div>
  );
};
