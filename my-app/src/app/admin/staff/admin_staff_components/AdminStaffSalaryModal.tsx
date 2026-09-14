"use client";

// RESPONSIBILITY: Staff Salary Payment Modal with fixed monthly salary, auto-synced attendance leave deduction, bonus, and overtime.
// Eliminates manual amount input box; auto-calculates salary based on base salary, 30-day rate, leave days, bonus, and overtime.
// DATA FLOW: Admin selects leave days/bonus/overtime -> Dynamic formula calculation -> onConfirm(...)

import type { AppUser } from "@/types/appTypes";
import { X, Banknote } from "lucide-react";
import { AdminStaffSalaryForm } from "./AdminStaffSalaryForm";

interface AdminStaffSalaryModalProps {
  isOpen: boolean;
  staff: AppUser | null;
  initialLeaveDays?: number;
  onClose: () => void;
  onConfirm: (
    staffId: string,
    amount: number,
    month: string,
    leaveDays: number,
    baseSalary: number,
    deductionAmount: number,
    bonus: number,
    overtime: number
  ) => void;
}

export function AdminStaffSalaryModal({
  isOpen,
  staff,
  initialLeaveDays = 0,
  onClose,
  onConfirm,
}: AdminStaffSalaryModalProps) {
  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface-hover/30 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Banknote size={20} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-text-primary">Staff Monthly Payroll Payment</h2>
              <p className="text-[11px] text-text-secondary">Fixed monthly pay + Leave deductions + Bonus & Overtime</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-border motion-safe:transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <AdminStaffSalaryForm
          staff={staff}
          initialLeaveDays={initialLeaveDays}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      </div>
    </div>
  );
}
