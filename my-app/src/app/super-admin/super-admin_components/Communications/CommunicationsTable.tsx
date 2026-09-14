"use client";
import { getStatusConfig } from "@/config/statusBadgeConfig";
// RESPONSIBILITY: Component rendering CommunicationsTable

import React from "react";
import type { CommunicationLog } from "@/app/super-admin/super-admin_types/communications_types";
import { Mail, MessageSquare, Phone } from "lucide-react";

interface Props {
  logs: CommunicationLog[];
}

export default function CommunicationsTable({ logs }: Props) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'bg-success/10 text-success';
      case 'sent': return 'bg-primary/10 text-text-primary';
      case 'bounced': return 'bg-warning/10 text-warning';
      case 'failed': return 'bg-danger/10 text-danger';
      default: return 'bg-secondary/10 text-text-secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'email': return <Mail size={14} className="mr-1.5" strokeWidth={2} />;
      case 'sms': return <MessageSquare size={14} className="mr-1.5" strokeWidth={2} />;
      case 'whatsapp': return <Phone size={14} className="mr-1.5" strokeWidth={2} />;
      default: return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-page/30 text-text-secondary text-table-header uppercase tracking-wider">
              <th className="p-4 font-medium">Recipient</th>
              <th className="p-4 font-medium">Tenant</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Subject</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody className="text-body">
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border hover:bg-page/50 motion-safe:transition-colors">
                <td className="p-4 font-medium text-text-primary">{log.recipient}</td>
                <td className="p-4 text-text-secondary">{log.tenantName}</td>
                <td className="p-4">
                  <div className="flex items-center text-text-secondary capitalize">
                    {getTypeIcon(log.type)}
                    {log.type}
                  </div>
                </td>
                <td className="p-4 text-text-primary max-w-[200px] truncate">{log.subject}</td>
                <td className="p-4">
                  <div className="flex flex-col items-start gap-1">
                    <span className={`px-2.5 py-1 rounded-full text-table-header font-medium capitalize ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                    {log.errorMessage && (
                      <span className="text-badge text-danger max-w-[150px] truncate" title={log.errorMessage}>
                        {log.errorMessage}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-text-secondary text-table-header">
                  {new Date(log.sentAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-secondary text-body">
                  No communication logs found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
