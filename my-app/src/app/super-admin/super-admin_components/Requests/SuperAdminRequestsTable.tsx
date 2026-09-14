// RESPONSIBILITY: Renders the Audit & Approval Requests Table for Super Admin onboarding review.
// DATA FLOW: useSuperAdminRequests -> RequestsPage -> SuperAdminRequestsTable

import React from "react";
import { CheckCircle, XCircle, FileText, AlertTriangle } from "lucide-react";
import type { AppTenant } from "@/types/appTypes";

export interface SuperAdminRequestsTableProps {
  requests: AppTenant[];
  onApprove: (tenant: AppTenant) => void;
}

export const SuperAdminRequestsTable: React.FC<SuperAdminRequestsTableProps> = ({ requests, onApprove }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-body border-collapse">
        <thead>
          <tr className="border-b border-border bg-primary/5 text-table-header font-semibold text-text-secondary uppercase tracking-wider">
            <th className="px-6 py-4">Tenant ID</th>
            <th className="px-6 py-4">Restaurant</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {requests.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-text-secondary">
                No pending approval requests.
              </td>
            </tr>
          ) : (
            requests.map((req) => (
              <tr key={req.tenantId} className="hover:bg-border/30 motion-safe:transition-colors group cursor-pointer">
                <td className="px-6 py-4 font-mono text-small text-text-primary">{req.tenantId}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-text-primary">{req.restaurantName}</p>
                  <p className="text-table-header text-text-secondary">{req.ownerName}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-text-primary">
                    <FileText size={14} className="text-text-secondary" strokeWidth={2} /> New Onboarding
                  </span>
                </td>
                <td className="px-6 py-4 text-small text-text-secondary">
                  {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-badge font-semibold bg-warning-bg text-warning border border-warning/30">
                    <AlertTriangle size={12} strokeWidth={2} />
                    PENDING
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 motion-safe:transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onApprove(req);
                      }}
                      className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-success-bg text-text-secondary hover:text-success motion-safe:transition-colors"
                      title="Approve & Send to Payment"
                    >
                      <CheckCircle size={16} strokeWidth={2} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-danger-bg text-text-secondary hover:text-danger motion-safe:transition-colors"
                      title="Reject"
                    >
                      <XCircle size={16} strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
