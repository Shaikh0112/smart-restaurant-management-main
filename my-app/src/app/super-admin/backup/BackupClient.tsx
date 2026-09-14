"use client";
// RESPONSIBILITY: Component rendering BackupClient

import React from "react";
import { useBackup } from "@/app/super-admin/super-admin_hooks/useBackup";
import BackupHistoryTable from "@/app/super-admin/super-admin_components/Backup/BackupHistoryTable";
import { Database, DownloadCloud, AlertTriangle, Loader2 } from "lucide-react";

export default function SuperAdminBackupPage() {
  const { backups, isBackingUp, triggerManualBackup, deleteBackup } = useBackup();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-page-title font-bold text-text-primary">System Backups</h1>
        <p className="text-body text-text-secondary mt-1">Export complete platform data or run manual snapshots.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-text-primary">
              <Database size={24} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">Full Platform Export</h2>
              <p className="text-small text-text-secondary">Download all tenants, payments, and users as JSON.</p>
            </div>
          </div>
          <button 
            onClick={triggerManualBackup}
            disabled={isBackingUp}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body font-medium text-white hover:bg-primary/90 motion-safe:transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
          >
            {isBackingUp ? <Loader2 size={16} className="motion-safe:animate-spin" strokeWidth={2} /> : <DownloadCloud size={16} strokeWidth={2} />}
            <span>{isBackingUp ? 'Snapshotting...' : 'Backup Now'}</span>
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-danger/10 border border-danger/30 rounded-lg flex items-start gap-3">
          <AlertTriangle size={20} className="text-danger shrink-0 mt-0.5" strokeWidth={2} />
          <div>
            <h3 className="text-body font-bold text-danger">Danger Zone</h3>
            <p className="text-small text-danger/80 mt-1">Actions here can irreversibly affect platform data. Proceed with extreme caution.</p>
            <button className="mt-3 rounded-md bg-danger px-4 py-2 text-small font-medium text-white hover:bg-red-600 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page">
              Purge Orphaned Records
            </button>
          </div>
        </div>
      </div>

      <BackupHistoryTable backups={backups} onDelete={deleteBackup} />
    </div>
  );
}
