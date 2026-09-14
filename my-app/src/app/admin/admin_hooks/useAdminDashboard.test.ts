import { renderHook, act } from '@testing-library/react';
import { useAdminDashboard } from './useAdminDashboard';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// RESPONSIBILITY: Ensure the Admin Dashboard hook properly calculates KPI data and manages loading states.
// DATA FLOW: Mock Local Storage -> Hook -> Test Assertions

describe('useAdminDashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should have default KPI cards defined', () => {
    const { result } = renderHook(() => useAdminDashboard());
    expect(result.current.kpiCards).toBeDefined();
    expect(result.current.kpiCards.length).toBeGreaterThan(0);
  });

  it('should have default total transactions as 0 when empty', () => {
    const { result } = renderHook(() => useAdminDashboard());
    expect(result.current.totalTransactions).toBe(0);
  });
});
