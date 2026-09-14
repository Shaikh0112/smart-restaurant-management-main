// RESPONSIBILITY: Renders the SaaS Subscriptions Table for Super Admin tracking.
// DATA FLOW: useSuperAdminSubscriptions -> SubscriptionsPage -> SuperAdminSubscriptionsTable

import React from "react";
import { CheckCircle2, Clock } from "lucide-react";
import type { SuperAdminSubscription } from "@/app/super-admin/super-admin_hooks/useSuperAdminSubscriptions";

export interface SuperAdminSubscriptionsTableProps {
  subscriptions: SuperAdminSubscription[];
}

export const SuperAdminSubscriptionsTable: React.FC<SuperAdminSubscriptionsTableProps> = ({ subscriptions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-body border-collapse">
        <thead>
          <tr className="border-b border-border bg-primary/5 text-table-header font-semibold text-text-secondary uppercase tracking-wider">
            <th className="px-6 py-4">Sub ID</th>
            <th className="px-6 py-4">Hotel</th>
            <th className="px-6 py-4">Plan & Amount</th>
            <th className="px-6 py-4">Validity</th>
            <th className="px-6 py-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {subscriptions.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                No matching subscription records found.
              </td>
            </tr>
          ) : (
            subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-border/30 motion-safe:transition-colors group cursor-pointer">
                <td className="px-6 py-4 font-mono text-small text-text-primary">{sub.id}</td>
                <td className="px-6 py-4 font-semibold text-text-primary">{sub.hotel}</td>
                <td className="px-6 py-4">
                  <p className="font-medium text-text-primary">{sub.plan}</p>
                  <p className="text-table-header text-text-secondary">{sub.amount}</p>
                </td>
                <td className="px-6 py-4 text-small text-text-secondary">{sub.expiresIn}</td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-badge font-semibold ${
                      sub.status === "ACTIVE"
                        ? "bg-success-bg text-success border border-success/30"
                        : "bg-warning-bg text-warning border border-warning/30"
                    }`}
                  >
                    {sub.status === "ACTIVE" ? <CheckCircle2 size={12} strokeWidth={2} /> : <Clock size={12} strokeWidth={2} />}
                    {sub.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
