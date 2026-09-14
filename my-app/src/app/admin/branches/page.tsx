// RESPONSIBILITY: Main Admin Branches Server Component.

import { AdminBranchesClient } from "./AdminBranchesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Branches | Smart Gym 360",
  description: "Manage branches for Smart Gym 360",
};

export default function AdminBranchesPage() {
  return <AdminBranchesClient />;
}
