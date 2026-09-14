"use client";
import { getStatusConfig } from "@/config/statusBadgeConfig";
// RESPONSIBILITY: Component rendering TicketsTable

import React from "react";
import type { SupportTicket } from "@/app/super-admin/super-admin_types/tickets_types";
import { MessageSquare, ExternalLink } from "lucide-react";

interface Props {
  tickets: SupportTicket[];
}

export default function TicketsTable({ tickets }: Props) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-danger/10 text-danger';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-primary/10 text-text-primary';
      default: return 'bg-secondary/10 text-text-secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-danger/10 text-danger border border-danger/20';
      case 'in-progress': return 'bg-warning/10 text-warning border border-warning/20';
      case 'resolved': return 'bg-success/10 text-success border border-success/20';
      case 'closed': return 'bg-secondary/10 text-text-secondary border border-secondary/20';
      default: return 'bg-secondary/10 text-text-secondary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-page/30 text-text-secondary text-table-header uppercase tracking-wider">
              <th className="p-4 font-medium">Ticket ID</th>
              <th className="p-4 font-medium">Tenant</th>
              <th className="p-4 font-medium">Subject</th>
              <th className="p-4 font-medium">Priority</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Assignee</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-body">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-border hover:bg-page/50 motion-safe:transition-colors">
                <td className="p-4 text-text-secondary font-mono text-table-header">{ticket.id}</td>
                <td className="p-4 font-medium text-text-primary">{ticket.tenantName}</td>
                <td className="p-4 text-text-primary max-w-[300px] truncate" title={ticket.subject}>
                  {ticket.subject}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-md text-badge font-bold uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-table-header font-medium capitalize ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="p-4 text-text-secondary">
                  {ticket.assignee ? ticket.assignee : <span className="italic opacity-50">Unassigned</span>}
                </td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <button 
                    className="flex items-center justify-center p-2 text-text-primary hover:bg-primary/10 motion-safe:transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
                    title="Reply to Ticket"
                  >
                    <MessageSquare size={16} strokeWidth={2} />
                  </button>
                  <button 
                    className="flex items-center justify-center p-2 text-text-secondary hover:text-text-primary motion-safe:transition-colors rounded-md hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
                    title="View Full Details"
                  >
                    <ExternalLink size={16} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-text-secondary text-body">
                  No tickets found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
