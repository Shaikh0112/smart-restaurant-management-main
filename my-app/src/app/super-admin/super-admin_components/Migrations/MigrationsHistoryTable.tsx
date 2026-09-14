"use client";
import { getStatusConfig } from "@/config/statusBadgeConfig";
// RESPONSIBILITY: Component rendering MigrationsHistoryTable

import React from "react";
import type { DatabaseMigration } from "@/app/super-admin/super-admin_types/migrations_types";
import { History, Undo2, CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react";

interface Props {
  migrations: DatabaseMigration[];
  onRollback: (id: string) => void;
}

export default function MigrationsHistoryTable({ migrations, onRollback }: Props) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <CheckCircle size={14} className="text-success" strokeWidth={2} />;
      case 'pending': return <Clock size={14} className="text-warning" strokeWidth={2} />;
      case 'failed': return <AlertCircle size={14} className="text-danger" strokeWidth={2} />;
      case 'rolling_back': return <Loader2 size={14} className="text-text-primary motion-safe:animate-spin" strokeWidth={2} />;
      default: return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-page/50">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <History size={18} className="text-text-secondary" strokeWidth={2} /> Migration History
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-page/30 text-text-secondary text-table-header uppercase tracking-wider">
              <th className="p-4 font-medium">Batch</th>
              <th className="p-4 font-medium">Migration Name</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Execution Time</th>
              <th className="p-4 font-medium">Applied At</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-body">
            {migrations.map((migration) => (
              <tr key={migration.id} className="border-b border-border hover:bg-page/50 motion-safe:transition-colors">
                <td className="p-4">
                  <span className="px-2 py-1 bg-page rounded-md border border-border text-table-header text-text-primary font-mono">
                    #{migration.batch}
                  </span>
                </td>
                <td className="p-4">
                  <p className="font-mono text-text-primary font-medium">{migration.name}</p>
                  <p className="text-badge text-text-secondary mt-1">Author: {migration.author}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5 capitalize text-small font-medium text-text-primary">
                    {getStatusIcon(migration.status)}
                    {migration.status.replace('_', ' ')}
                  </div>
                </td>
                <td className="p-4 text-text-primary text-table-header">
                  {migration.executionTimeMs ? `${(migration.executionTimeMs / 1000).toFixed(2)}s` : '-'}
                </td>
                <td className="p-4 text-text-secondary text-table-header">
                  {migration.appliedAt ? new Date(migration.appliedAt).toLocaleString() : '-'}
                </td>
                <td className="p-4 text-right flex items-center justify-end">
                  <button 
                    onClick={() => onRollback(migration.id)}
                    disabled={migration.status !== 'applied'}
                    className="flex items-center gap-1 p-2 text-warning hover:bg-warning/10 motion-safe:transition-colors rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Rollback Migration"
                  >
                    <Undo2 size={16} strokeWidth={2} />
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
