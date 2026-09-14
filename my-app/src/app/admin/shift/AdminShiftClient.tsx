"use client";
// RESPONSIBILITY: Client-side orchestrator for AdminShift.
// DATA FLOW: Hooks -> Client Component -> Presentation Components


import React from "react";
import { AdminShiftReport } from "@/app/admin/shift/admin_shift_components/AdminShiftReport";

import { useAdminShift } from "../admin_hooks/useAdminShift";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import type { AppSalesRecord } from "@/types/appTypes";

export function AdminShiftClient() {
  const { shift } = useAdminShift();
  const [salesHistory] = useLocalStorage<AppSalesRecord[]>(STORAGE_KEYS.SALES_HISTORY, []);

  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {shift ? (
        <AdminShiftReport shift={shift} salesHistory={salesHistory} />
      ) : (
        <div className="flex h-64 items-center justify-center text-text-secondary">No active shift found.</div>
      )}
    </div>
  );
}
