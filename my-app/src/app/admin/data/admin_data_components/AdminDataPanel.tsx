"use client";
// RESPONSIBILITY: Presentation component for AdminDataPanel.
// DATA FLOW: Props -> Component -> UI


import { useState, useRef } from "react";
import { Download, Upload, Loader2 } from "lucide-react";
import type { AdminDataPanelProps } from "@/app/admin/admin_types/AdminTypes";
import { StorageBar } from "./StorageBar";
import { EmergencyResetSection } from "./EmergencyResetSection";

export function AdminDataPanel({
  storageUsage,
  isExporting,
  isImporting,
  isResetting,
  onExport,
  onImport,
  onReset,
}: AdminDataPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importConfirm, setImportConfirm] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportConfirm(file);
    e.target.value = "";
  }

  async function handleImportConfirm() {
    if (!importConfirm) return;
    await onImport(importConfirm);
    setImportConfirm(null);
    window.location.reload(); 
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <StorageBar
        usedKb={storageUsage.usedKb}
        limitKb={storageUsage.limitKb}
        usagePercent={storageUsage.usagePercent}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-semibold text-text-primary">Export Backup</p>
            <p className="text-[12px] text-text-secondary">
              Download all restaurant data as a JSON file
            </p>
          </div>
          <button
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60 motion-safe:transition-colors"
          >
            {isExporting ? <Loader2 size={14} className="motion-safe:animate-spin" /> : <Download size={14} />}
            {isExporting ? "Exporting---" : "Download Backup"}
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-semibold text-text-primary">Import Restore</p>
            <p className="text-[12px] text-text-secondary">
              Restore data from a previously exported JSON backup
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          {importConfirm ? (
            <div className="flex flex-col gap-2">
              <p className="text-[12px] text-warning">
                Restore from: <span className="font-semibold">{importConfirm.name}</span>?
                This will overwrite current data.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setImportConfirm(null)}
                  className="flex-1 rounded-lg border border-border py-2 text-[12px] font-semibold text-text-secondary hover:bg-page motion-safe:transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportConfirm}
                  disabled={isImporting}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-warning py-2 text-[12px] font-semibold text-warning-foreground disabled:opacity-60 motion-safe:transition-colors"
                >
                  {isImporting && <Loader2 size={12} className="motion-safe:animate-spin" />}
                  Restore
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-[13px] font-semibold text-text-secondary hover:bg-page disabled:opacity-60 motion-safe:transition-colors"
            >
              <Upload size={14} />
              Select Backup File
            </button>
          )}
        </div>
      </div>

      <EmergencyResetSection isResetting={isResetting} onReset={onReset} />
    </div>
  );
}
