// RESPONSIBILITY: Main Admin Menu Server Component.

import { AdminMenuClient } from "./AdminMenuClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Menu | Smart Gym 360",
  description: "Manage menu for Smart Gym 360",
};

export default function AdminMenuPage() {
  return <AdminMenuClient />;
}
