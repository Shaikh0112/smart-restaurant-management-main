"use client";
// RESPONSIBILITY: Component rendering WebhooksList

import React from "react";
import type { WebhookEndpoint } from "@/app/super-admin/super-admin_types/api_types";
import { Webhook, Power, AlertCircle } from "lucide-react";

interface Props {
  webhooks: WebhookEndpoint[];
  onToggle: (id: string) => void;
}

export default function WebhooksList({ webhooks, onToggle }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden mt-6">
      <div className="p-4 border-b border-border flex justify-between items-center bg-page/50">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <Webhook size={18} className="text-text-secondary" strokeWidth={2} /> Registered Webhooks
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-page/30 text-text-secondary text-table-header uppercase tracking-wider">
              <th className="p-4 font-medium">Endpoint URL</th>
              <th className="p-4 font-medium">Tenant</th>
              <th className="p-4 font-medium">Subscribed Events</th>
              <th className="p-4 font-medium">Health</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-body">
            {webhooks.map((hook) => (
              <tr key={hook.id} className={`border-b border-border hover:bg-page/50 motion-safe:transition-colors ${!hook.isActive ? 'opacity-60' : ''}`}>
                <td className="p-4">
                  <p className="font-mono text-table-header text-text-primary break-all max-w-[300px]">{hook.url}</p>
                </td>
                <td className="p-4 text-text-secondary text-small">{hook.tenantId}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {hook.events.map(ev => (
                      <span key={ev} className="px-2 py-0.5 bg-page border border-border rounded text-badge text-text-primary">
                        {ev}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  {hook.failureCount > 10 ? (
                    <span className="flex items-center gap-1.5 text-table-header text-danger font-medium">
                      <AlertCircle size={14} strokeWidth={2} /> Disabled (Failing)
                    </span>
                  ) : hook.isActive ? (
                    <span className="text-table-header text-success font-medium">Healthy</span>
                  ) : (
                    <span className="text-table-header text-text-secondary font-medium">Paused</span>
                  )}
                </td>
                <td className="p-4 text-right flex items-center justify-end">
                  <button 
                    onClick={() => onToggle(hook.id)}
                    className="p-2 text-text-secondary hover:text-text-primary motion-safe:transition-colors rounded-md hover:bg-page"
                    title={hook.isActive ? "Pause Webhook" : "Resume Webhook"}
                  >
                    <Power size={16} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
