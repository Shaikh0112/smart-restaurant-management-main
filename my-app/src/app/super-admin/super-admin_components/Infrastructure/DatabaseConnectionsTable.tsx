"use client";
import { getStatusConfig } from "@/config/statusBadgeConfig";
// RESPONSIBILITY: Component rendering DatabaseConnectionsTable

import React from "react";
import type { DatabaseConnection } from "@/app/super-admin/super-admin_types/infrastructure_types";
import { Database, Activity } from "lucide-react";

interface Props {
  databases: DatabaseConnection[];
}

export default function DatabaseConnectionsTable({ databases }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-success/10 text-success';
      case 'warning': return 'bg-warning/10 text-warning';
      case 'critical': return 'bg-danger/10 text-danger';
      default: return 'bg-secondary/10 text-text-secondary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-page/50">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <Database size={18} className="text-text-secondary" strokeWidth={2} /> Global Database Connections
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-page/30 text-text-secondary text-table-header uppercase tracking-wider">
              <th className="p-4 font-medium">Cluster Name</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Host</th>
              <th className="p-4 font-medium">Connections</th>
              <th className="p-4 font-medium">Latency</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-body">
            {databases.map((db) => (
              <tr key={db.id} className="border-b border-border hover:bg-page/50 motion-safe:transition-colors">
                <td className="p-4 font-medium text-text-primary">{db.name}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-page rounded-md border border-border text-table-header text-text-primary uppercase font-bold tracking-wider">
                    {db.type}
                  </span>
                </td>
                <td className="p-4 text-text-secondary font-mono text-table-header">{db.host}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-text-primary text-table-header">{db.activeConnections} / {db.maxConnections}</span>
                    <div className="w-full bg-page rounded-full h-1.5">
                      <div 
                        className={`${(db.activeConnections/db.maxConnections) > 0.8 ? 'bg-danger' : 'bg-primary'} h-1.5 rounded-full`} 
                        style={{ width: `${(db.activeConnections / db.maxConnections) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-text-secondary text-table-header flex items-center gap-1.5 mt-2">
                  <Activity size={12} strokeWidth={2} className={db.latencyMs > 20 ? 'text-warning' : 'text-success'} />
                  {db.latencyMs}ms
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-table-header font-medium capitalize ${getStatusColor(db.status)}`}>
                    {db.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
