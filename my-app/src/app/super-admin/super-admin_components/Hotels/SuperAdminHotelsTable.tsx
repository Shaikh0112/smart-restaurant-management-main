import { getStatusConfig } from "@/config/statusBadgeConfig";
// RESPONSIBILITY: Renders the Hotel/Restaurant Directory Table with actions for Super Admin.
// DATA FLOW: useSuperAdminHotels -> HotelsPage -> SuperAdminHotelsTable

import React from "react";
import { Building2, Copy, Edit2, Ban, MoreVertical, CheckCircle2, Clock } from "lucide-react";
import type { AppTenant } from "@/types/appTypes";
import { TableSortHeader } from "@/app/super-admin/super-admin_components/Shared/TableSortHeader";
import { EmptyState } from "@/app/super-admin/super-admin_components/Shared/EmptyState";
import { useRouter } from "next/navigation";

export interface SuperAdminHotelsTableProps {
  tenants: AppTenant[];
  onSelectSuspend: (tenant: AppTenant) => void;
  sorting?: { sortBy: string; sortDir: "asc" | "desc" };
  onSort?: (field: string) => void;
}

export const SuperAdminHotelsTable: React.FC<SuperAdminHotelsTableProps> = ({ tenants, onSelectSuspend, sorting, onSort }) => {
  const router = useRouter();
  
  const getStatusBadge = (status: string) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-badge font-semibold border ${config.bgClass} ${config.textClass}`}>
        {Icon && <Icon size={12} strokeWidth={2} />}
        {config.label}
      </span>
    );
  };


  const copyToClipboard = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-body border-collapse">
        <thead>
          <tr className="border-b border-border bg-primary/5 text-table-header font-semibold text-text-secondary uppercase tracking-wider">
            <TableSortHeader label="Restaurant Details" field="restaurantName" currentSortField={sorting?.sortBy} currentSortDirection={sorting?.sortDir} onSort={onSort || (() => {})} />
            <TableSortHeader label="City" field="city" currentSortField={sorting?.sortBy} currentSortDirection={sorting?.sortDir} onSort={onSort || (() => {})} />
            <TableSortHeader label="Owner Contact" field="ownerName" currentSortField={sorting?.sortBy} currentSortDirection={sorting?.sortDir} onSort={onSort || (() => {})} />
            <TableSortHeader label="Created On" field="createdAt" currentSortField={sorting?.sortBy} currentSortDirection={sorting?.sortDir} onSort={onSort || (() => {})} />
            <TableSortHeader label="Status" field="status" currentSortField={sorting?.sortBy} currentSortDirection={sorting?.sortDir} onSort={onSort || (() => {})} className="text-center" />
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tenants.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4">
                <EmptyState
                  icon={Building2}
                  title="No hotels found"
                  description="We couldn't find any hotels matching your current search or filters."
                  actionLabel="Clear Filters"
                  onAction={() => router.push("/super-admin/hotels")}
                />
              </td>
            </tr>
          ) : (
            tenants.map((t) => {
              const name = t.restaurantName || "Hotel Partner";
              const id = t.tenantId;
              return (
                <tr 
                  key={id} 
                  className="hover:bg-border/30 motion-safe:transition-colors group cursor-pointer"
                  onClick={() => router.push(`/super-admin/hotels/${id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {t.logoUrl ? (
                        <img src={t.logoUrl} alt="" className="h-10 w-10 rounded-md object-cover border border-border" />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-input border border-border flex items-center justify-center text-text-secondary font-bold text-lg">
                          {name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-text-primary">{name}</p>
                        <div
                          onClick={(e) => copyToClipboard(e, id)}
                          className="flex items-center gap-1 group/id cursor-pointer text-badge text-text-secondary font-mono mt-0.5 hover:text-text-primary"
                          title="Click to copy ID"
                        >
                          {id}
                          <Copy size={10} className="opacity-0 group-hover/id:opacity-100 motion-safe:transition-opacity" strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{t.city}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-text-primary">{t.ownerName}</p>
                    <p className="text-table-header text-text-secondary">{t.ownerPhone}</p>
                  </td>
                  <td className="px-6 py-4 text-small text-text-secondary">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">{getStatusBadge(t.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 motion-safe:transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-border text-text-secondary hover:text-text-primary motion-safe:transition-colors"
                        title="Edit Hotel"
                      >
                        <Edit2 size={16} strokeWidth={2} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSuspend(t);
                        }}
                        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-danger-bg text-text-secondary hover:text-danger motion-safe:transition-colors"
                        title="Suspend Hotel Access"
                      >
                        <Ban size={16} strokeWidth={2} />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-border text-text-secondary hover:text-text-primary motion-safe:transition-colors"
                      >
                        <MoreVertical size={16} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
