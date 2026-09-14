import { http, HttpResponse } from 'msw';
import type { AdminBranch } from '@/app/admin/admin_types/AdminBranchesTypes';

const MOCK_BRANCHES: AdminBranch[] = [
  { id: "T-001", name: "Downtown Branch", status: "ACTIVE", revenueToday: 4250 },
  { id: "T-002", name: "Airport Terminal", status: "ACTIVE", revenueToday: 8120 },
  { id: "T-003", name: "City Mall", status: "MAINTENANCE", revenueToday: 0 },
];

export const adminBranchesHandlers = [
  http.get('/api/v1/admin/branches', () => {
    return HttpResponse.json({
      success: true,
      data: MOCK_BRANCHES,
    });
  }),
];
