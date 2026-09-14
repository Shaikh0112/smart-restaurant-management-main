// RESPONSIBILITY: Type definitions for the Admin Branches feature.

export type BranchStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";

export interface AdminBranch {
  id: string;
  name: string;
  status: BranchStatus;
  revenueToday: number;
}
