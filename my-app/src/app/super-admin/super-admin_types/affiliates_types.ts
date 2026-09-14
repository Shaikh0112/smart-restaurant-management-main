// RESPONSIBILITY: TypeScript definitions for affiliates_types
export type AffiliateStatus = 'active' | 'suspended' | 'pending';

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  commissionRate: number; // Percentage
  totalReferred: number;
  pendingPayout: number;
  status: AffiliateStatus;
  joinedAt: string;
}

export interface AffiliateKPIs {
  totalAffiliates: number;
  totalPaidOut: number;
  pendingPayouts: number;
}
