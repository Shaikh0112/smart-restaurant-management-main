// RESPONSIBILITY: State management and business logic for AdminStaff.test.
// DATA FLOW: localStorage -> Hook State -> Components

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAdminStaff } from "../admin_hooks/useAdminStaff";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";

describe("useAdminStaff", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([
      { id: "1", username: "cashier1", role: "CASHIER", isActive: true, tenantId: "T1" }
    ]));
  });

  it("should return staff list", () => {
    const { result } = renderHook(() => useAdminStaff());
    expect(result.current.staff).toHaveLength(1);
    expect(result.current.staff[0]?.username).toBe("cashier1");
  });

  it("should toggle staff active status", () => {
    const { result } = renderHook(() => useAdminStaff());
    
    act(() => {
      result.current.toggleStaffActive("1", false);
    });

    expect(result.current.staff[0]?.isActive).toBe(false);
  });
});
