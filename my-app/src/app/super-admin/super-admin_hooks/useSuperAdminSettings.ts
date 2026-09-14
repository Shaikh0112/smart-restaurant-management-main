// RESPONSIBILITY: Custom hook managing Super Admin Global SaaS Platform Settings.
// DATA FLOW: localStorageSeeder -> useSuperAdminSettings -> SettingsPage -> SuperAdminSettingsForm

import { useState, useCallback } from "react";

import type { SuperAdminSettingsState } from "@/app/super-admin/super-admin_types/settings.types";

/**
 * @description Custom hook for useSuperAdminSettings
 * @returns {object} Hook state and methods
 */
export function useSuperAdminSettings() {
  const [settings, setSettings] = useState<SuperAdminSettingsState>({
    platformName: "SMART POS 360",
    supportEmail: "support@smartpos360.com",
    annualFee: 2999,
    masterGstin: "27AADCB2230M1Z2",
  });

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const updateSetting = useCallback((key: keyof SuperAdminSettingsState, value: string | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  }, []);

  return {
    settings,
    isSaved,
    updateSetting,
    handleSave,
  };
}
