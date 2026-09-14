// RESPONSIBILITY: Main Admin Reports Server Component.

import { AdminReportsClient } from "./AdminReportsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Reports | Smart Gym 360",
  description: "Manage reports for Smart Gym 360",
};

export default function AdminReportsPage() {
  return <AdminReportsClient />;
}
