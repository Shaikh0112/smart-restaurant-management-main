"use client";
// RESPONSIBILITY: Client-side orchestrator for AdminData.
// DATA FLOW: Hooks -> Client Component -> Presentation Components


import { useAdminData } from "@/app/admin/admin_hooks/useAdminData";
import { AdminDataPanel } from "./admin_data_components/AdminDataPanel";

export function AdminDataClient() {
  const {
    storageUsage,
    isExporting,
    isImporting,
    isResetting,
    exportBackup,
    importRestore,
    emergencyReset,
  } = useAdminData();

  return (
    <AdminDataPanel
      storageUsage={storageUsage}
      isExporting={isExporting}
      isImporting={isImporting}
      isResetting={isResetting}
      onExport={exportBackup}
      onImport={importRestore}
      onReset={emergencyReset}
    />
  );
}
