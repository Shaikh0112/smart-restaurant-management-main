// @ts-nocheck
"use client";

// RESPONSIBILITY: Owner Staff Table view displaying staff members, role, base monthly salary, status, attendance, and Pay Salary action.
// DATA FLOW: staffList + salaryRecords → ManagerStaffTable → Action triggers (onPaySalary, onOpenAttendance, onViewPayslip)

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { AppUser, AppSalaryRecord } from "@/types/appTypes";
import { formatCurrency } from "@/lib/formatters";
import { CheckCircle2, XCircle, Ellipsis, Check, Calendar, FileText, Users, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { ManagerEmptyState } from "@/app/manager/manager_components/ManagerEmptyState";

interface ManagerStaffTableProps {
  staffList: AppUser[];
  salaryRecords?: AppSalaryRecord[];
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onPaySalary: (staff: AppUser) => void;
  onOpenAttendance: (staff: AppUser) => void;
  onViewPayslip: (staff: AppUser, record: AppSalaryRecord) => void;
}

export function ManagerStaffTable({
  staffList,
  salaryRecords = [],
  onToggleStatus,
  onPaySalary,
  onOpenAttendance,
  onViewPayslip,
}: ManagerStaffTableProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "";

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const isAsc = currentSort === `${field}_asc`;
    params.set("sort", `${field}_${isAsc ? "desc" : "asc"}`);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const getSortIcon = (field: string) => {
    if (currentSort === `${field}_asc`) return <ArrowUp size={14} className="ml-1" />;
    if (currentSort === `${field}_desc`) return <ArrowDown size={14} className="ml-1" />;
    return <ArrowUpDown size={14} className="ml-1 opacity-20 group-hover:opacity-100 transition-opacity" />;
  };

  const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

  function getLatestSalaryStatus(staffId: string) {
    const record = salaryRecords.find(
      (r) => r.staffId === staffId && r.month === currentMonthStr
    );
    return record || null;
  }

  if (staffList.length === 0) {
    return (
      <ManagerEmptyState
        title="No staff members found"
        description="Add staff members to your restaurant to manage their payroll and attendance."
        icon={Users}
      />
    );
  }

  const sortedStaff = [...staffList].sort((a, b) => {
    if (!currentSort) return 0;
    const [field, order] = currentSort.split("_");
    const mult = order === "desc" ? -1 : 1;
    if (field === "name") return (a.name || "").localeCompare(b.name || "") * mult;
    if (field === "role") return (a.role || "").localeCompare(b.role || "") * mult;
    if (field === "salary") {
      const aSal = a.baseSalary || (a.role === "KITCHEN" ? 25000 : a.role === "CASHIER" ? 15000 : 12000);
      const bSal = b.baseSalary || (b.role === "KITCHEN" ? 25000 : b.role === "CASHIER" ? 15000 : 12000);
      return (aSal - bSal) * mult;
    }
    return 0;
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border bg-page">
            <th 
              className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary cursor-pointer hover:text-text-primary transition-colors group"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">Staff Member {getSortIcon("name")}</div>
            </th>
            <th 
              className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary cursor-pointer hover:text-text-primary transition-colors group"
              onClick={() => handleSort("role")}
            >
              <div className="flex items-center">Role {getSortIcon("role")}</div>
            </th>
            <th 
              className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary cursor-pointer hover:text-text-primary transition-colors group"
              onClick={() => handleSort("salary")}
            >
              <div className="flex items-center">Fixed Base Salary {getSortIcon("salary")}</div>
            </th>
            <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Payroll Status ({currentMonthStr})
            </th>
            <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Account Status
            </th>
            <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sortedStaff.map((staff, index) => {
            const paidRecord = getLatestSalaryStatus(staff.id);
            const defaultBaseSalary =
              staff.baseSalary ||
              (staff.role === "KITCHEN" ? 25000 : staff.role === "CASHIER" ? 15000 : 12000);

            return (
              <motion.tr
                key={staff.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="group cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button, input, [role="menu"]')) return;
                  onOpenAttendance(staff);
                }}
              >
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-text-primary">
                      {staff.name}
                    </span>
                    <span className="text-[12px] text-text-secondary font-mono">
                      {staff.username} • {staff.phone || "No Phone"}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                    {staff.role}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-text-primary">
                      {formatCurrency(defaultBaseSalary)}
                    </span>
                    <span className="text-[10px] text-text-secondary">
                      ₹{Math.round(defaultBaseSalary / 30)}/day
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  {paidRecord ? (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success">
                      <Check size={12} />
                      <span>Paid {formatCurrency(paidRecord.amountPaid)}</span>
                      {paidRecord.leaveDays ? (
                        <span className="text-[10px] opacity-80">({paidRecord.leaveDays} leave days)</span>
                      ) : null}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-[11px] font-semibold text-warning">
                      <span>Pending Payment</span>
                    </div>
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    {staff.isActive ? (
                      <>
                        <CheckCircle2 size={14} className="text-success" />
                        <span className="text-[13px] font-medium text-success">Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={14} className="text-danger" />
                        <span className="text-[13px] font-medium text-danger">Inactive</span>
                      </>
                    )}
                  </div>
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === staff.id ? null : staff.id);
                        }}
                        className="p-1.5 rounded-lg text-text-secondary hover:bg-border transition-colors focus:outline-none"
                      >
                        <Ellipsis size={16} />
                      </button>

                      {openDropdown === staff.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(null);
                            }}
                          />
                          <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-border bg-card p-1 shadow-lg flex flex-col gap-0.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenAttendance(staff);
                                setOpenDropdown(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[12px] font-medium text-text-primary hover:bg-surface-hover transition-colors"
                            >
                              <Calendar size={14} className="text-primary" />
                              <span>Attendance Calendar</span>
                            </button>

                            {paidRecord && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewPayslip(staff, paidRecord);
                                  setOpenDropdown(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[12px] font-medium text-text-primary hover:bg-surface-hover transition-colors"
                              >
                                <FileText size={14} className="text-success" />
                                <span>View / Print Payslip</span>
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleStatus(staff.id, !staff.isActive);
                                setOpenDropdown(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[12px] font-medium text-text-primary hover:bg-surface-hover transition-colors"
                            >
                              Mark {staff.isActive ? "Inactive" : "Active"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
