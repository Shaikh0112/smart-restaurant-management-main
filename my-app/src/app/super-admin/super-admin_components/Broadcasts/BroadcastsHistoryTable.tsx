"use client";
import { getStatusConfig } from "@/config/statusBadgeConfig";
// RESPONSIBILITY: Component rendering BroadcastsHistoryTable

import React from "react";
import type { PlatformBroadcast } from "@/app/super-admin/super-admin_types/broadcasts_types";
import { Trash2, Radio } from "lucide-react";

interface Props {
  broadcasts: PlatformBroadcast[];
  onDelete: (id: string) => void;
}

export default function BroadcastsHistoryTable({ broadcasts, onDelete }: Props) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'info': return 'bg-primary/10 text-text-primary';
      case 'warning': return 'bg-warning/10 text-warning';
      case 'critical': return 'bg-danger/10 text-danger';
      default: return 'bg-secondary/10 text-text-secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-success';
      case 'scheduled': return 'text-warning';
      case 'draft': return 'text-text-secondary';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-page/50">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <Radio size={18} className="text-text-secondary" strokeWidth={2} /> Broadcast History
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-page/30 text-text-secondary text-table-header uppercase tracking-wider">
              <th className="p-4 font-medium">Alert Title</th>
              <th className="p-4 font-medium">Priority</th>
              <th className="p-4 font-medium">Audience</th>
              <th className="p-4 font-medium">Status / Timing</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-body">
            {broadcasts.map((broadcast) => (
              <tr key={broadcast.id} className="border-b border-border hover:bg-page/50 motion-safe:transition-colors">
                <td className="p-4">
                  <p className="font-medium text-text-primary">{broadcast.title}</p>
                  <p className="text-table-header text-text-secondary max-w-[300px] truncate mt-1">{broadcast.message}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-badge font-bold uppercase tracking-wider ${getPriorityColor(broadcast.priority)}`}>
                    {broadcast.priority}
                  </span>
                </td>
                <td className="p-4 text-text-primary text-small capitalize">
                  {broadcast.targetAudience.replace('_', ' ')}
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1 items-start">
                    <span className={`text-small font-bold capitalize ${getStatusColor(broadcast.status)}`}>
                      {broadcast.status}
                    </span>
                    <span className="text-badge text-text-secondary">
                      {broadcast.status === 'scheduled' ? new Date(broadcast.scheduledFor!).toLocaleString() : 
                       broadcast.status === 'sent' ? new Date(broadcast.sentAt!).toLocaleString() : '-'}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right flex items-center justify-end">
                  <button 
                    onClick={() => onDelete(broadcast.id)}
                    className="p-2 text-danger hover:bg-danger/10 motion-safe:transition-colors rounded-md"
                    title="Delete Broadcast"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
            {broadcasts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-secondary text-body">
                  No broadcasts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
