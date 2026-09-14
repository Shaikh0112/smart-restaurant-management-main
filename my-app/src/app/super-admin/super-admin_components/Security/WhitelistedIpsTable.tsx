"use client";
// RESPONSIBILITY: Component rendering WhitelistedIpsTable

import React from "react";
import type { WhitelistedIp } from "@/app/super-admin/super-admin_types/security_types";
import { Trash2, Power } from "lucide-react";

interface Props {
  ips: WhitelistedIp[];
  onRemove: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function WhitelistedIpsTable({ ips, onRemove, onToggleStatus }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-page/50">
        <h2 className="text-base font-bold text-text-primary">Whitelisted IP Addresses</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-md text-body font-medium hover:bg-primary/90 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page">
          + Add IP Range
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-page/30 text-text-secondary text-table-header uppercase tracking-wider">
              <th className="p-4 font-medium">IP Address</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium">Added By</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-body">
            {ips.map((ip) => (
              <tr key={ip.id} className="border-b border-border hover:bg-page/50 motion-safe:transition-colors">
                <td className="p-4 text-text-primary font-mono">{ip.ipAddress}</td>
                <td className="p-4 text-text-secondary">{ip.description}</td>
                <td className="p-4 text-text-secondary">{ip.addedBy}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-table-header font-medium ${
                    ip.status === 'active' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-secondary/10 text-text-secondary'
                  }`}>
                    {ip.status.charAt(0).toUpperCase() + ip.status.slice(1)}
                  </span>
                </td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <button 
                    onClick={() => onToggleStatus(ip.id)}
                    className="p-2 text-text-secondary hover:text-text-primary motion-safe:transition-colors rounded-md hover:bg-page"
                    title={ip.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    <Power size={16} strokeWidth={2} />
                  </button>
                  <button 
                    onClick={() => onRemove(ip.id)}
                    className="p-2 text-danger hover:bg-danger/10 motion-safe:transition-colors rounded-md"
                    title="Remove IP"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
            {ips.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-secondary text-body">
                  No IPs whitelisted. The system is open to all IPs.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
