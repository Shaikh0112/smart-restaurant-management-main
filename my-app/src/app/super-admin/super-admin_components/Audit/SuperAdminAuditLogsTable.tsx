import { EmptyState } from "@/app/super-admin/super-admin_components/Shared/EmptyState";
import { FileBox } from "lucide-react";
// RESPONSIBILITY: Renders the Immutable System Audit Logs Table for Super Admin compliance tracking.
// DATA FLOW: useSuperAdminAudit -> AuditPage -> SuperAdminAuditLogsTable

import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Clock } from "lucide-react";
import type { SuperAdminAuditLog } from "@/app/super-admin/super-admin_hooks/useSuperAdminAudit";

export interface SuperAdminAuditLogsTableProps {
  logs: SuperAdminAuditLog[];
}

export const SuperAdminAuditLogsTable: React.FC<SuperAdminAuditLogsTableProps> = ({ logs }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "INFO":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-badge font-semibold bg-success-bg text-success border border-success/30">
            <CheckCircle2 size={12} strokeWidth={2} /> INFO
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-badge font-semibold bg-warning-bg text-warning border border-warning/30">
            <AlertTriangle size={12} strokeWidth={2} /> WARN
          </span>
        );
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-badge font-semibold bg-danger-bg text-danger border border-danger/30">
            <AlertCircle size={12} strokeWidth={2} /> CRIT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-badge font-semibold bg-info-bg text-info border border-info/30">
            <Clock size={12} strokeWidth={2} /> LOG
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-body border-collapse">
        <thead>
          <tr className="border-b border-border bg-primary/5 text-table-header font-semibold text-text-secondary uppercase tracking-wider">
            <th className="px-6 py-4">Timestamp</th>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Module / Action</th>
            <th className="px-6 py-4">Details</th>
            <th className="px-6 py-4 text-center">Severity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {logs.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                No matching audit logs found.
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id} className="hover:bg-border/30 motion-safe:transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <p className="font-medium text-text-primary">{log.timestamp.split(" ")[0]}</p>
                  <p className="text-table-header text-text-secondary">{log.timestamp.split(" ")[1]}</p>
                </td>
                <td className="px-6 py-4 font-mono text-table-header text-text-secondary">{log.user}</td>
                <td className="px-6 py-4">
                  <p className="font-medium text-text-primary">{log.module}</p>
                  <p className="text-table-header text-text-secondary truncate max-w-[200px]">{log.action}</p>
                </td>
                <td className="px-6 py-4 text-small text-text-secondary truncate max-w-[300px]">{log.details}</td>
                <td className="px-6 py-4 text-center">{getSeverityBadge(log.severity)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
