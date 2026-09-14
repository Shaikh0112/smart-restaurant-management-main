import { toast } from "sonner";
// RESPONSIBILITY: Custom hook handling useBranding logic
// DATA FLOW: UI Component -> useBranding -> State/API
import { useState } from 'react';
import type { TenantBranding } from "@/app/super-admin/super-admin_types/branding_types";
import { MOCK_TENANT_BRANDING } from "@/app/super-admin/super-admin_constants/branding_constants";

/**
 * @description Custom hook for useBranding
 * @returns {object} Hook state and methods
 */
export const useBranding = () => {
  const [branding, setBranding] = useState<TenantBranding>(MOCK_TENANT_BRANDING);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateBranding = (updates: Partial<TenantBranding>) => {
    setBranding((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Branding settings saved successfully!");
    }, 1000);
  };

  return {
    branding,
    isSaving,
    handleUpdateBranding,
    handleSave,
  };
};
