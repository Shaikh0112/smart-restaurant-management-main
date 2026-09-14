// @ts-nocheck
"use client";

// RESPONSIBILITY: Owner Shift Management page shell.
// If shift OPEN: shows current stats + Close Shift form.
// If shift CLOSED or null: shows Open Shift form + Z-Report (if closed).
// DATA FLOW: useManagerShift → ManagerShiftReport + RHF forms → UI

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useManagerShift } from "@/app/manager/manager_hooks/useManagerShift";
import { ManagerShiftReport } from "@/app/manager/manager_components/ManagerShiftReport";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { AuthGuard } from "@/app/auth/auth_components/AuthGuard";
import type { ManagerShiftOpenFormValues, ManagerShiftCloseFormValues } from "@/app/manager/manager_types/ManagerTypes";
import { OpenShiftForm } from "./manager_shift_components/OpenShiftForm";
import { CloseShiftForm } from "./manager_shift_components/CloseShiftForm";
import { ShiftPageHeader } from "./manager_shift_components/ShiftPageHeader";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManagerShiftClient() {
  const [isMounted, setIsMounted] = useState(false);

  // Deps: [] — run once on mount only
  useEffect(() => { setIsMounted(true); }, []);

  const { shift, isOpen, isSubmitting, salesHistory, openShift, closeShift } = useManagerShift();

  if (!isMounted) {
    return (
      <div className="flex flex-col gap-6">
        <ShiftPageHeader />
        <div className="skeleton h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <AuthGuard allowedRoles={["MANAGER"]}>
      <div className="flex flex-col gap-6">
        <ShiftPageHeader />

        {/* Open shift status banner */}
        {isOpen && shift && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-success bg-success-bg px-5 py-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-[13px] font-semibold text-success">Shift is OPEN</p>
              <p className="text-[12px] text-text-secondary">
                Opened at {formatDateTime(shift.openedAt)} · Opening cash: {formatCurrency(shift.openingCash)}
              </p>
            </div>
            <CloseShiftForm onClose={closeShift} isSubmitting={isSubmitting} />
          </div>
        )}

        {/* No shift — show open form */}
        {!shift && (
          <OpenShiftForm onOpen={openShift} isSubmitting={isSubmitting} />
        )}

        {/* Shift closed — show open new shift + Z-Report */}
        {shift && !isOpen && (
          <>
            <OpenShiftForm onOpen={openShift} isSubmitting={isSubmitting} />
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-text-secondary">
                Last Shift Z-Report
              </p>
              <ManagerShiftReport shift={shift} salesHistory={salesHistory} />
            </div>
          </>
        )}

        {/* Shift open — show Z-Report preview (live) */}
        {shift && isOpen && (
          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-text-secondary">
              Live Shift Report
            </p>
            <ManagerShiftReport shift={shift} salesHistory={salesHistory} />
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

