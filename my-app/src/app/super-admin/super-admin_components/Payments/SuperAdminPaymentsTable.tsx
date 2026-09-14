import { EmptyState } from "@/app/super-admin/super-admin_components/Shared/EmptyState";
import { FileBox } from "lucide-react";
// RESPONSIBILITY: Renders the Payment Verification & Invoicing Table for Super Admin.
// DATA FLOW: useSuperAdminPayments -> PaymentsPage -> SuperAdminPaymentsTable

import React from "react";
import { CheckCircle2 } from "lucide-react";
import type { AppTenant } from "@/types/appTypes";

export interface SuperAdminPaymentsTableProps {
  payments: AppTenant[];
  onVerify: (tenant: AppTenant) => void;
}

export const SuperAdminPaymentsTable: React.FC<SuperAdminPaymentsTableProps> = ({ payments, onVerify }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-body border-collapse">
        <thead>
          <tr className="border-b border-border bg-primary/5 text-table-header font-semibold text-text-secondary uppercase tracking-wider">
            <th className="px-6 py-4">Transaction ID</th>
            <th className="px-6 py-4">Hotel</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {payments.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-text-secondary">
                No payment records found.
              </td>
            </tr>
          ) : (
            payments.map((pay) => (
              <tr key={pay.tenantId} className="hover:bg-border/30 motion-safe:transition-colors group cursor-pointer">
                <td className="px-6 py-4 font-mono text-small text-text-primary">{pay.txnRefId || "N/A"}</td>
                <td className="px-6 py-4 font-semibold text-text-primary">{pay.restaurantName}</td>
                <td className="px-6 py-4 font-medium text-text-primary">₹{(pay.advanceFeePaid || 2999).toLocaleString("en-IN")}</td>
                <td className="px-6 py-4 text-small text-text-secondary">
                  {pay.updatedAt ? new Date(pay.updatedAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-badge font-semibold ${
                      pay.status === "ACTIVE"
                        ? "bg-success-bg text-success border border-success/30"
                        : "bg-warning-bg text-warning border border-warning/30"
                    }`}
                  >
                    <CheckCircle2 size={12} strokeWidth={2} /> {pay.status === "ACTIVE" ? "VERIFIED" : "PENDING"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {pay.status === "PAYMENT_SUBMITTED" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onVerify(pay);
                      }}
                      className="px-3 py-1.5 rounded-md bg-success/10 text-success hover:bg-success hover:text-white motion-safe:transition-colors text-table-header font-medium border border-success/30"
                    >
                      Verify & Activate
                    </button>
                  ) : (
                    <span className="text-table-header text-text-secondary">No Action Needed</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
