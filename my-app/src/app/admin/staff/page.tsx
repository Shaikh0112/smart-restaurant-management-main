// RESPONSIBILITY: Main Admin Staff Server Component.

import { AdminStaffClient } from "./AdminStaffClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Staff | Smart Gym 360",
  description: "Manage staff for Smart Gym 360",
};

export default function AdminStaffPage() {
  return <AdminStaffClient />;
}
