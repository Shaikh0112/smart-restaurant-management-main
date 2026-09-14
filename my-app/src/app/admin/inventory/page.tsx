// RESPONSIBILITY: Main Admin Inventory Server Component.

import { AdminInventoryClient } from "./AdminInventoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Inventory | Smart Gym 360",
  description: "Manage inventory for Smart Gym 360",
};

export default function AdminInventoryPage() {
  return <AdminInventoryClient />;
}
