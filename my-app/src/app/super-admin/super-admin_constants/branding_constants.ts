// RESPONSIBILITY: Mock data and constants for branding_constants
import type { TenantBranding } from "@/app/super-admin/super-admin_types/branding_types";

export const MOCK_TENANT_BRANDING: TenantBranding = {
  tenantId: 't-1001',
  tenantName: 'Global Enterprises POS',
  customDomain: 'pos.globalenterprises.com',
  primaryColor: '#8B5CF6', // Purple
  logoUrl: 'https://via.placeholder.com/150x50?text=Global+POS',
  isWhiteLabelEnabled: true,
};
