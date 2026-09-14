"use client";

import { formatCurrency } from "@/lib/formatters";

// RESPONSIBILITY: Pure display component for salary calculation breakdown.

interface AdminStaffSalaryBreakdownProps {
  baseSalary: number;
  leaveDays: number;
  dailyRate: number;
  leaveDeduction: number;
  bonusNum: number;
  overtimeNum: number;
  netPayableSalary: number;
}

export function AdminStaffSalaryBreakdown({
  baseSalary,
  leaveDays,
  dailyRate,
  leaveDeduction,
  bonusNum,
  overtimeNum,
  netPayableSalary,
}: AdminStaffSalaryBreakdownProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
      <div className="flex justify-between text-[12px] text-text-secondary">
        <span>Base Monthly Salary:</span>
        <span className="font-semibold text-text-primary">{formatCurrency(baseSalary)}</span>
      </div>
      {leaveDays > 0 && (
        <div className="flex justify-between text-[12px] text-danger">
          <span>Leave Deduction ({leaveDays} days -- {formatCurrency(Math.round(dailyRate))}):</span>
          <span className="font-semibold">-{formatCurrency(leaveDeduction)}</span>
        </div>
      )}
      {bonusNum > 0 && (
        <div className="flex justify-between text-[12px] text-success">
          <span>Performance Bonus:</span>
          <span className="font-semibold">+{formatCurrency(bonusNum)}</span>
        </div>
      )}
      {overtimeNum > 0 && (
        <div className="flex justify-between text-[12px] text-primary">
          <span>Overtime Pay:</span>
          <span className="font-semibold">+{formatCurrency(overtimeNum)}</span>
        </div>
      )}
      <div className="my-1 border-t border-border" />
      <div className="flex justify-between items-center">
        <span className="text-[13px] font-bold text-text-primary">Net Payable Amount:</span>
        <span className="text-[20px] font-extrabold text-success">
          {formatCurrency(netPayableSalary)}
        </span>
      </div>
    </div>
  );
}
