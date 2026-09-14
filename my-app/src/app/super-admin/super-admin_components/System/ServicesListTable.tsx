"use client";
import { getStatusConfig } from "@/config/statusBadgeConfig";
// RESPONSIBILITY: Component rendering ServicesListTable

import React from "react";
import type { ExternalService } from "@/app/super-admin/super-admin_types/system_types";
import { ServerCog, RefreshCw, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface Props {
  services: ExternalService[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function ServicesListTable({ services, onRefresh, isRefreshing }: Props) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle size={14} className="text-success" strokeWidth={2} />;
      case 'degraded': return <AlertTriangle size={14} className="text-warning" strokeWidth={2} />;
      case 'down': return <XCircle size={14} className="text-danger" strokeWidth={2} />;
      default: return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-page/50">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <ServerCog size={18} className="text-text-secondary" strokeWidth={2} /> External Service Health
        </h2>
        <button 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-secondary/10 text-text-primary px-4 py-2 rounded-md text-body font-medium hover:bg-secondary/20 motion-safe:transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
        >
          <RefreshCw size={14} className={isRefreshing ? 'motion-safe:animate-spin' : ''} strokeWidth={2} />
          Ping Services
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-page/30 text-text-secondary text-table-header uppercase tracking-wider">
              <th className="p-4 font-medium">Service Name</th>
              <th className="p-4 font-medium">Provider</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Latency</th>
              <th className="p-4 font-medium">Error Rate</th>
              <th className="p-4 font-medium">Last Checked</th>
            </tr>
          </thead>
          <tbody className="text-body">
            {services.map((service) => (
              <tr key={service.id} className="border-b border-border hover:bg-page/50 motion-safe:transition-colors">
                <td className="p-4 font-bold text-text-primary">{service.name}</td>
                <td className="p-4 text-text-secondary">{service.provider}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5 capitalize text-small font-bold text-text-primary">
                    {getStatusIcon(service.status)}
                    {service.status}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`font-medium ${service.latencyMs > 500 ? 'text-warning' : 'text-text-primary'}`}>
                    {service.latencyMs.toFixed(0)}ms
                  </span>
                </td>
                <td className="p-4 text-text-primary">
                  {service.errorRate.toFixed(2)}%
                </td>
                <td className="p-4 text-text-secondary text-table-header">
                  {new Date(service.lastChecked).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
