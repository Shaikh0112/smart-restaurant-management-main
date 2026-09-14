"use client";
// RESPONSIBILITY: Component rendering ApiKeysTable

import React from "react";
import type { ApiKey } from "@/app/super-admin/super-admin_types/api_types";
import { KeyRound, ShieldOff, Copy } from "lucide-react";

interface Props {
  apiKeys: ApiKey[];
  onRevoke: (id: string) => void;
}

export default function ApiKeysTable({ apiKeys, onRevoke }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-page/50">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <KeyRound size={18} className="text-text-secondary" strokeWidth={2} /> Global API Keys
        </h2>
        <button className="bg-primary text-white px-4 py-2 rounded-md text-body font-medium hover:bg-primary/90 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page">
          + Generate Root Key
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-page/30 text-text-secondary text-table-header uppercase tracking-wider">
              <th className="p-4 font-medium">Key Details</th>
              <th className="p-4 font-medium">Prefix</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Last Used</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-body">
            {apiKeys.map((apiKey) => (
              <tr key={apiKey.id} className="border-b border-border hover:bg-page/50 motion-safe:transition-colors">
                <td className="p-4">
                  <p className="font-bold text-text-primary">{apiKey.name}</p>
                  <p className="text-table-header text-text-secondary mt-1">Tenant: {apiKey.tenantId}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 bg-page border border-border px-3 py-1.5 rounded-md w-fit">
                    <span className="font-mono text-table-header text-text-primary">{apiKey.keyPrefix}</span>
                    <button className="text-text-secondary hover:text-text-primary motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page" title="Copy Prefix">
                      <Copy size={14} strokeWidth={2} />
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-table-header font-bold capitalize ${apiKey.status === 'active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                    {apiKey.status}
                  </span>
                </td>
                <td className="p-4 text-text-secondary text-table-header">
                  {apiKey.lastUsedAt ? new Date(apiKey.lastUsedAt).toLocaleString() : 'Never'}
                </td>
                <td className="p-4 text-right flex items-center justify-end">
                  <button 
                    onClick={() => onRevoke(apiKey.id)}
                    disabled={apiKey.status === 'revoked'}
                    className="flex items-center gap-1.5 p-2 text-danger hover:bg-danger/10 motion-safe:transition-colors rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Revoke Key Permanently"
                  >
                    <ShieldOff size={16} strokeWidth={2} /> Revoke
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
