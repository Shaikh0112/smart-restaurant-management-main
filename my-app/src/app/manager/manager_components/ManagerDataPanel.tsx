// @ts-nocheck
﻿"use client";

// RESPONSIBILITY: Data safety UI panel — storage monitor, export backup,
// import restore, and emergency reset with "Type RESET" + Owner PIN confirm.
// All destructive actions use pessimistic UI (disabled while processing).
// Pure display component — all logic delegated to useManagerData via props.
// DATA FLOW: useManagerData → admin/data/page.tsx → ManagerDataPanel → UI

import { useState, useRef } from "react";
import { Download, Upload, AlertTriangle, Loader2, ShieldAlert } from "lucide-react";
import type { ManagerDataPanelProps } from "@/app/manager/manager_types/ManagerTypes";
import { StorageBar } from "./StorageBar";
import { EmergencyResetSection } from "./EmergencyResetSection";

// ─── Constants (Rule 35: No magic strings) ────────────────────────────────────

const RESET_CONFIRM_WORD = "RESET"  as const;
const USAGE_DANGER_PCT   = 80       as const;
const USAGE_WARNING_PCT  = 60       as const;



// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Data safety panel — storage monitor, export, import restore, emergency reset.
 * Import uses a hidden file input triggered by a visible button.
 */
export function ManagerDataPanel({
  storageUsage,
  isExporting,
  isImporting,
  isResetting,
  onExport,
  onImport,
  onReset,
}: ManagerDataPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importConfirm, setImportConfirm] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportConfirm(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  }

  async function handleImportConfirm() {
    if (!importConfirm) return;
    await onImport(importConfirm);
    setImportConfirm(null);
    window.location.reload(); // reload so all hooks pick up restored data
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl">

      {/* Storage monitor */}
      <StorageBar
        usedKb={storageUsage.usedKb}
        limitKb={storageUsage.limitKb}
        usagePercent={storageUsage.usagePercent}
      />

      {/* Export + Import row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Export Backup */}
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
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-primary-hover disabled:opacity-60 transition-colors"
          >
            {isExporting
              ? <Loader2 size={14} className="animate-spin" />
              : <Download size={14} />
            }
            {isExporting ? "Exporting…" : "Download Backup"}
          </button>
        </div>

        {/* Import Restore */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-semibold text-text-primary">Import Restore</p>
            <p className="text-[12px] text-text-secondary">
              Restore data from a previously exported JSON backup
            </p>
          </div>

          {/* Hidden file input */}
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
                  className="flex-1 rounded-lg border border-border py-2 text-[12px] font-semibold text-text-secondary hover:bg-page transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportConfirm}
                  disabled={isImporting}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-warning py-2 text-[12px] font-semibold text-page disabled:opacity-60 transition-colors"
                >
                  {isImporting && <Loader2 size={12} className="animate-spin" />}
                  Restore
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-[13px] font-semibold text-text-secondary hover:bg-page disabled:opacity-60 transition-colors"
            >
              <Upload size={14} />
              Select Backup File
            </button>
          )}
        </div>
      </div>

      {/* Emergency Reset */}
      <EmergencyResetSection isResetting={isResetting} onReset={onReset} />
    </div>
  );
}
