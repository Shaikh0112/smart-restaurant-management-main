// @ts-nocheck
"use client";

// RESPONSIBILITY: Hook to manage staff users, attendance records, and salary payroll for Owner panel.
// DATA FLOW: managerApi → useManagerStaff → Staff pages & modals

import { useState, useEffect } from "react";
import type {
  AppUser,
  AppSalaryRecord,
  AppStaffAttendanceRecord,
  AttendanceStatus,
} from "@/types/appTypes";
import { managerApi } from "../manager_api/manager_api";

export interface UseOwnerStaffReturn {
  staff: AppUser[];
  salaryRecords: AppSalaryRecord[];
  attendanceRecords: AppStaffAttendanceRecord[];
  toggleStaffActive: (userId: string, isActive: boolean) => void;
  markAttendance: (
    staffId: string,
    date: string,
    status: AttendanceStatus,
    notes?: string
  ) => void;
  getStaffMonthLeaveDays: (staffId: string, month: string) => number;
  paySalary: (
    staffId: string,
    amount: number,
    month: string,
    leaveDays?: number,
    baseSalary?: number,
    deductionAmount?: number,
    bonus?: number,
    overtime?: number
  ) => void;
}

export const ROLE_DEFAULT_BASE_SALARIES: Record<string, number> = {
  CASHIER: 15000,
  WAITER: 12000,
  KITCHEN: 25000,
};

export function useManagerStaff(): UseOwnerStaffReturn {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [salaryRecords, setSalaryRecords] = useState<AppSalaryRecord[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AppStaffAttendanceRecord[]>([]);

  const tenantId = typeof window !== "undefined" ? window.localStorage.getItem("active_tenant_id") || "SUPER_ADMIN" : "SUPER_ADMIN";

  useEffect(() => {
    managerApi.getStaff(tenantId).then(res => {
      if (res.success && res.data) setUsers(res.data);
    });
    managerApi.getSalaryRecords(tenantId).then(res => {
      if (res.success && res.data) setSalaryRecords(res.data);
    });
    managerApi.getAttendanceRecords(tenantId).then(res => {
      if (res.success && res.data) setAttendanceRecords(res.data);
    });
  }, [tenantId]);

  const staff = users
    .filter((u) => u.role === "CASHIER" || u.role === "WAITER" || u.role === "KITCHEN")
    .map((u) => ({
      ...u,
      baseSalary: u.baseSalary || ROLE_DEFAULT_BASE_SALARIES[u.role] || 15000,
    }));

  async function toggleStaffActive(userId: string, isActive: boolean) {
    const res = await managerApi.updateStaff(tenantId, userId, { isActive });
    if (res.success) {
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isActive } : user))
      );
    }
  }

  async function markAttendance(
    staffId: string,
    date: string,
    status: AttendanceStatus,
    notes?: string
  ) {
    const recordId = `${staffId}_${date}`;
    const payload = { id: recordId, staffId, date, status, notes };
    const res = await managerApi.markAttendance(tenantId, payload);
    if (res.success) {
      setAttendanceRecords((prev) => {
        const existingIdx = prev.findIndex((r) => r.id === recordId);
        if (existingIdx >= 0) {
          const copy = [...prev];
          copy[existingIdx] = payload as AppStaffAttendanceRecord;
          return copy;
        }
        return [...prev, payload as AppStaffAttendanceRecord];
      });
    }
  }

  function getStaffMonthLeaveDays(staffId: string, month: string): number {
    const staffMonthLogs = attendanceRecords.filter(
      (r) => r.staffId === staffId && r.date.startsWith(month)
    );
    let absentCount = 0;
    for (const log of staffMonthLogs) {
      if (log.status === "ABSENT") absentCount += 1;
      else if (log.status === "HALF_DAY") absentCount += 0.5;
    }
    return Math.round(absentCount);
  }

  async function paySalary(
    staffId: string,
    amount: number,
    month: string,
    leaveDays: number = 0,
    baseSalary?: number,
    deductionAmount: number = 0,
    bonus: number = 0,
    overtime: number = 0
  ) {
    const payload = {
      staffId,
      amountPaid: amount,
      baseSalary,
      leaveDays,
      deductionAmount,
      bonus,
      overtime,
      month,
      status: "PAID",
    };
    const res = await managerApi.createSalaryRecord(tenantId, payload);
    if (res.success && res.data) {
      setSalaryRecords((prev) => [...prev, res.data as AppSalaryRecord]);
    }
  }

  return {
    staff,
    salaryRecords,
    attendanceRecords,
    toggleStaffActive,
    markAttendance,
    getStaffMonthLeaveDays,
    paySalary,
  };
}
