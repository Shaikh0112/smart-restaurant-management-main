import { http, HttpResponse } from 'msw';
import { SUPER_ADMIN_DASHBOARD_KPIS } from '@/app/super-admin/super-admin_constants/dashboard_constants';
import { adminBranchesHandlers } from './handlers/admin-branches.handlers';
import { customerHandlers } from './handlers/customerHandlers';

export const handlers = [
  // Mock handler for Super Admin Dashboard KPIs
  http.get('/api/v1/super-admin/dashboard', () => {
    return HttpResponse.json({
      success: true,
      data: SUPER_ADMIN_DASHBOARD_KPIS,
    });
  }),
  
  // Add other module handlers here as needed
  ...adminBranchesHandlers,
  ...customerHandlers,
];
