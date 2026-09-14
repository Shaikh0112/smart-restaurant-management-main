// RESPONSIBILITY: Main Admin Settings Server Component.

import { AdminSettingsClient } from "./AdminSettingsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Settings | Smart Gym 360",
  description: "Manage settings for Smart Gym 360",
};

export default function AdminSettingsPage() {
  return <AdminSettingsClient />;
}
