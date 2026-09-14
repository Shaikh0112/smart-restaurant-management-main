// RESPONSIBILITY: Presentation component for AdminStaffSalaryForm.
// DATA FLOW: Props -> Component -> UI

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatCurrency } from "@/lib/formatters";
import type { AppUser } from "@/types/appTypes";
import { Calendar, Minus, Plus, ShieldAlert, Award, Clock } from "lucide-react";
import { AdminStaffSalaryBreakdown } from "./AdminStaffSalaryBreakdown";

const salarySchema = z.object({
  month: z.string().min(1, "Month is required"),
  leaveDays: z.number().min(0).max(31),
  bonus: z.number().min(0, "Bonus cannot be negative"),
  overtime: z.number().min(0, "Overtime cannot be negative"),
});

type SalaryFormValues = z.infer<typeof salarySchema>;

export interface AdminStaffSalaryFormProps {
  staff: AppUser;
  initialLeaveDays: number;
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

export function AdminStaffSalaryForm({
  staff,
  initialLeaveDays,
  onClose,
  onConfirm,
}: AdminStaffSalaryFormProps) {
  const getDefaultMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // "YYYY-MM"
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SalaryFormValues>({
    resolver: zodResolver(salarySchema),
    defaultValues: {
      month: getDefaultMonth(),
      leaveDays: initialLeaveDays,
      bonus: 0,
      overtime: 0,
    },
  });

  useEffect(() => {
    reset({
      month: getDefaultMonth(),
      leaveDays: initialLeaveDays,
      bonus: 0,
      overtime: 0,
    });
  }, [initialLeaveDays, reset]);

  // Fixed base monthly salary per role
  const baseSalary =
    staff.baseSalary ||
    (staff.role === "KITCHEN"
      ? 25000
      : staff.role === "CASHIER"
      ? 15000
      : 12000);

  const totalMonthDays = 30; // standard payroll base
  const dailyRate = baseSalary / totalMonthDays;
  
  const leaveDays = watch("leaveDays") || 0;
  const bonusNum = watch("bonus") || 0;
  const overtimeNum = watch("overtime") || 0;
  const month = watch("month");

  const leaveDeduction = Math.round(leaveDays * dailyRate);

  const netPayableSalary = Math.max(
    0,
    Math.round(baseSalary - leaveDeduction + bonusNum + overtimeNum)
  );

  function handleIncrementLeave() {
    setValue("leaveDays", Math.min(totalMonthDays, leaveDays + 1));
  }

  function handleDecrementLeave() {
    setValue("leaveDays", Math.max(0, leaveDays - 1));
  }

  function onSubmit(data: SalaryFormValues) {
    onConfirm(
      staff.id,
      netPayableSalary,
      data.month,
      data.leaveDays,
      baseSalary,
      leaveDeduction,
      data.bonus,
      data.overtime
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">
      {/* Staff Info Pill */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-page p-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-bold text-text-primary">{staff.name}</span>
          <span className="text-[12px] text-text-secondary">{staff.phone || "No Phone"}</span>
        </div>
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
          {staff.role}
        </span>
      </div>

      {/* Payment Month Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-text-secondary flex items-center gap-1.5">
          <Calendar size={14} />
          <span>Select Payment Month</span>
        </label>
        <input
          type="month"
          {...register("month")}
          className="rounded-lg border border-border bg-input px-3.5 py-2 text-[14px] font-semibold text-text-primary focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        {errors.month && <p className="text-xs text-danger">{errors.month.message}</p>}
      </div>

      {/* Fixed Base Salary & Rate Banner */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-0.5 rounded-xl border border-border bg-page p-3">
          <span className="text-[11px] font-medium text-text-secondary">Fixed Base Salary</span>
          <span className="text-[16px] font-bold text-text-primary">
            {formatCurrency(baseSalary)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 rounded-xl border border-border bg-page p-3">
          <span className="text-[11px] font-medium text-text-secondary">Daily Wage Rate (30 Days)</span>
          <span className="text-[16px] font-bold text-text-primary">
            {formatCurrency(Math.round(dailyRate))}<span className="text-[11px] font-normal text-text-secondary">/day</span>
          </span>
        </div>
      </div>

      {/* Leave Days Stepper */}
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface-hover/40 p-3.5">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-semibold text-text-primary flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-warning" />
            <span>Leave / Absent Days</span>
          </label>
          <span className="text-[11px] font-bold text-text-secondary">
            {leaveDays} {leaveDays === 1 ? "day" : "days"} absent
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 mt-1">
          <button
            type="button"
            onClick={handleDecrementLeave}
            disabled={leaveDays <= 0}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-text-primary hover:bg-border disabled:opacity-40 motion-safe:transition-all active:scale-95"
          >
            <Minus size={14} />
          </button>

          <div className="flex-1 text-center font-bold text-[16px] text-text-primary">
            {leaveDays} <span className="text-[12px] font-normal text-text-secondary">Leave Days</span>
          </div>

          <button
            type="button"
            onClick={handleIncrementLeave}
            disabled={leaveDays >= totalMonthDays}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-text-primary hover:bg-border disabled:opacity-40 motion-safe:transition-all active:scale-95"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Bonus & Overtime Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-text-secondary flex items-center gap-1">
            <Award size={12} className="text-success" />
            <span>Performance Bonus (---)</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            {...register("bonus", { valueAsNumber: true })}
            onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }}
            placeholder="0"
            className="rounded-lg border border-border bg-input px-3 py-2 text-xs font-semibold text-text-primary focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {errors.bonus && <p className="text-xs text-danger">{errors.bonus.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-text-secondary flex items-center gap-1">
            <Clock size={12} className="text-primary" />
            <span>Overtime Pay (---)</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            {...register("overtime", { valueAsNumber: true })}
            onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }}
            placeholder="0"
            className="rounded-lg border border-border bg-input px-3 py-2 text-xs font-semibold text-text-primary focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {errors.overtime && <p className="text-xs text-danger">{errors.overtime.message}</p>}
        </div>
      </div>

      {/* Dynamic Net Salary Calculation Summary */}
      <AdminStaffSalaryBreakdown
        baseSalary={baseSalary}
        leaveDays={leaveDays}
        dailyRate={dailyRate}
        leaveDeduction={leaveDeduction}
        bonusNum={bonusNum}
        overtimeNum={overtimeNum}
        netPayableSalary={netPayableSalary}
      />

      {/* Action Buttons */}
      <div className="mt-1 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-border py-2.5 text-[13px] font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-primary py-2.5 text-[13px] font-bold text-white shadow-md hover:bg-primary-hover active:scale-95 motion-safe:transition-all"
        >
          Confirm Salary
        </button>
      </div>
    </form>
  );
}
