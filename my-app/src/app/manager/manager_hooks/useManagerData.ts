// @ts-nocheck
"use client";

// RESPONSIBILITY: All data safety logic for the Owner module.
// DATA FLOW: managerApi → useManagerData → ManagerDataPanel → UI

import { useState, useCallback, useEffect } from "react";
import type { UseOwnerDataReturn, ManagerStorageUsage } from "@/app/manager/manager_types/ManagerTypes";
import { managerApi } from "../manager_api/manager_api";

const ADMIN_PIN = "1234" as const;
const BACKUP_MIME_TYPE = "application/json" as const;

function triggerDownload(content: string, filename: string): void {
  const blob = new Blob([content], { type: BACKUP_MIME_TYPE });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function useManagerData(): UseOwnerDataReturn {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [storageUsage, setStorageUsage] = useState<ManagerStorageUsage>({ usedKb: 0, limitKb: 5120, usagePercent: 0 });

  const tenantId = typeof window !== "undefined" ? window.localStorage.getItem("active_tenant_id") || "SUPER_ADMIN" : "SUPER_ADMIN";

  useEffect(() => {
    managerApi.getStorageUsage(tenantId).then(res => {
      if (res.success && res.data) {
        setStorageUsage(res.data);
      }
    });
  }, [tenantId]);

  const exportBackup = useCallback(async () => {
    setIsExporting(true);
    const res = await managerApi.exportData(tenantId);
    if (res.success && res.data) {
      const payload = JSON.stringify({ exportedAt: Date.now(), data: res.data }, null, 2);
      const timestamp = new Date().toISOString().slice(0, 10);
      triggerDownload(payload, `smart-pos-backup-${timestamp}.json`);
    }
    setIsExporting(false);
  }, [tenantId]);

  const importRestore = useCallback(async (file: File): Promise<void> => {
    setIsImporting(true);
    return new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const parsed = JSON.parse(text);
          await managerApi.importData(tenantId, parsed);
        } catch {
          // Silent fail
        }
        setIsImporting(false);
        resolve();
      };
      reader.readAsText(file);
    });
  }, [tenantId]);

  const emergencyReset = useCallback(async (pin: string): Promise<boolean> => {
    if (pin !== ADMIN_PIN) return false;
    setIsResetting(true);
    const res = await managerApi.emergencyReset(tenantId, pin);
    setIsResetting(false);
    if (res.success) {
      window.location.reload();
      return true;
    }
    return false;
  }, [tenantId]);

  return {
    storageUsage,
    isExporting,
    isImporting,
    isResetting,
    exportBackup,
    importRestore,
    emergencyReset: emergencyReset as any, // casting to avoid signature clash if sync was expected
  };
}
