"use client";

// RESPONSIBILITY: Hook to manage staff users, attendance records, and salary payroll for Admin panel.
// DATA FLOW: STORAGE_KEYS (USERS, SALARY_RECORDS, STAFF_ATTENDANCE) --- useAdminStaff --- Staff pages & modals

import { useState } from "react";
import { useLocalStorage, getActiveTenantId } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import type {
  AppUser,
  AppSalaryRecord,
  AppStaffAttendanceRecord,
  AttendanceStatus,
} from "@/types/appTypes";
import { FetchState } from "@/types/appTypes";
import type { UseAdminStaffReturn } from "@/app/admin/admin_types/AdminTypes";

export const ROLE_DEFAULT_BASE_SALARIES: Record<string, number> = {
  CASHIER: 15000,
  WAITER: 12000,
  KITCHEN: 25000,
};

/**
 * Hook to manage staff users, attendance calendars, and salary records.
 */
export function useAdminStaff(): UseAdminStaffReturn {
  const [users, setUsers] = useLocalStorage<AppUser[]>(STORAGE_KEYS.USERS, []);
  const [salaryRecords, setSalaryRecords] = useLocalStorage<AppSalaryRecord[]>(
    STORAGE_KEYS.SALARY_RECORDS,
    []
  );
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<
    AppStaffAttendanceRecord[]
  >(STORAGE_KEYS.STAFF_ATTENDANCE || "app_staff_attendance", []);

  const [fetchState, setFetchState] = useState<FetchState>(FetchState.IDLE);

  const staff = users
    .filter((u) => u.role === "CASHIER" || u.role === "WAITER" || u.role === "KITCHEN")
    .filter((u) => {
      const tid = getActiveTenantId();
      const userTenant = u.tenantId || "usr-admin-01";
      return !(tid && tid !== "SUPER_ADMIN" && userTenant !== tid);
    })
    .map((u) => ({
      ...u,
      baseSalary: u.baseSalary || ROLE_DEFAULT_BASE_SALARIES[u.role] || 15000,
    }));

  async function toggleStaffActive(userId: string, isActive: boolean) {
    setFetchState(FetchState.LOADING);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isActive } : user))
      );
      setFetchState(FetchState.SUCCESS);
    } catch (error) {
      setFetchState(FetchState.ERROR);
    } finally {
      setTimeout(() => setFetchState(FetchState.IDLE), 2000);
    }
  }

  function markAttendance(
    staffId: string,
    date: string,
    status: AttendanceStatus,
    notes?: string
  ) {
    const recordId = `${staffId}_${date}`;
    setAttendanceRecords((prev) => {
      const existingIdx = prev.findIndex((r) => r.id === recordId);
      const newRec: AppStaffAttendanceRecord = {
        id: recordId,
        staffId,
        date,
        status,
        notes,
      };
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newRec;
        return copy;
      }
      return [...prev, newRec];
    });
  }

  function getStaffMonthLeaveDays(staffId: string, month: string): number {
    // month is format "YYYY-MM"
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
    setFetchState(FetchState.LOADING);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newRecord: AppSalaryRecord = {
        id: `sal-${Date.now()}`,
        staffId,
        amountPaid: amount,
        baseSalary,
        leaveDays,
        deductionAmount,
        bonus,
        overtime,
        paymentDate: Date.now(),
        month,
        status: "PAID",
      };
      setSalaryRecords((prev) => [...prev, newRecord]);
      setFetchState(FetchState.SUCCESS);
    } catch (error) {
      setFetchState(FetchState.ERROR);
    } finally {
      setTimeout(() => setFetchState(FetchState.IDLE), 2000);
    }
  }

  return {
    staff,
    salaryRecords,
    attendanceRecords,
    fetchState,
    toggleStaffActive,
    markAttendance,
    getStaffMonthLeaveDays,
    paySalary,
  };
}
