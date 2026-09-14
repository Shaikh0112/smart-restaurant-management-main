"use client";

// RESPONSIBILITY: Data safety UI panel — storage monitor, export backup,
// import restore, and emergency reset with "Type RESET" + SuperAdmin PIN confirm.
// All destructive actions use pessimistic UI (disabled while processing).
// Pure display component — all logic delegated to useSuperAdminData via props.
// DATA FLOW: useSuperAdminData → admin/data/page.tsx → SuperAdminDataPanel → UI

import { useState, useRef } from "react";
import { Download, Upload, AlertTriangle, Loader2, ShieldAlert } from "lucide-react";
import type { SuperAdminDataPanelProps } from "@/app/super-admin/super-admin_types/SuperAdminTypes";

// ─── Constants (Rule 35: No magic strings) ────────────────────────────────────

const RESET_CONFIRM_WORD = "RESET"  as const;
const USAGE_DANGER_PCT   = 80       as const;
const USAGE_WARNING_PCT  = 60       as const;

import { StorageBar } from "./StorageBar";
import { EmergencyResetSection } from "./EmergencyResetSection";

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Data safety panel — storage monitor, export, import restore, emergency reset.
 * Import uses a hidden file input triggered by a visible button.
 */
export function SuperAdminDataPanel({
  storageUsage,
  isExporting,
  isImporting,
  isResetting,
  onExport,
  onImport,
  onReset,
}: SuperAdminDataPanelProps) {
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
    if (typeof window !== "undefined") window.location.reload(); // reload so all hooks pick up restored data
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
            <p className="text-small font-semibold text-text-primary">Export Backup</p>
            <p className="text-table-header text-text-secondary">
              Download all restaurant data as a JSON file
            </p>
          </div>
          <button
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-small font-semibold text-white hover:bg-primary-hover disabled:opacity-60 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
          >
            {isExporting
              ? <Loader2 size={14} className="motion-safe:animate-spin" strokeWidth={2} />
              : <Download size={14} strokeWidth={2} />
            }
            {isExporting ? "Exporting…" : "Download Backup"}
          </button>
        </div>

        {/* Import Restore */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-1">
            <p className="text-small font-semibold text-text-primary">Import Restore</p>
            <p className="text-table-header text-text-secondary">
              Restore data from a previously exported JSON backup
            </p>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
          />

          {importConfirm ? (
            <div className="flex flex-col gap-2">
              <p className="text-table-header text-warning">
                Restore from: <span className="font-semibold">{importConfirm.name}</span>?
                This will overwrite current data.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setImportConfirm(null)}
                  className="flex-1 rounded-lg border border-border py-2 text-table-header font-semibold text-text-secondary hover:bg-page motion-safe:transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportConfirm}
                  disabled={isImporting}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-warning py-2 text-table-header font-semibold text-kpi-valueage-titleage disabled:opacity-60 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
                >
                  {isImporting && <Loader2 size={12} className="motion-safe:animate-spin" strokeWidth={2} />}
                  Restore
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-small font-semibold text-text-secondary hover:bg-page disabled:opacity-60 motion-safe:transition-colors"
            >
              <Upload size={14} strokeWidth={2} />
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
