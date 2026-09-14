// RESPONSIBILITY: Main Admin Shift Server Component.

import { AdminShiftClient } from "./AdminShiftClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Shift | Smart Gym 360",
  description: "Manage shift for Smart Gym 360",
};

export default function AdminShiftPage() {
  return <AdminShiftClient />;
}
