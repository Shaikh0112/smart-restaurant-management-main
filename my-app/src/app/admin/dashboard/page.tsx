// RESPONSIBILITY: Main Admin Dashboard Server Component.

import { AdminDashboardClient } from "./AdminDashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Smart Gym 360",
  description: "Live analytics, operations, and staff credential management",
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
