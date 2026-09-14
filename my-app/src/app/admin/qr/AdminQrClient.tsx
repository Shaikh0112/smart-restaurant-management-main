"use client";
// RESPONSIBILITY: Client-side orchestrator for AdminQr.
// DATA FLOW: Hooks -> Client Component -> Presentation Components


import React from "react";
import { AdminQrGenerator } from "@/app/admin/qr/admin_qr_components/AdminQrGenerator";

import { getActiveTenantId } from "@/hooks/useLocalStorage";

export function AdminQrClient() {
  const tenantId = getActiveTenantId() || "unknown";

  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminQrGenerator tables={[]} tenantId={tenantId} />
    </div>
  );
}
