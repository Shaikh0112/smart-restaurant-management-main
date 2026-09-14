// RESPONSIBILITY: Main Admin Audit Server Component.

import { AdminAuditClient } from "./AdminAuditClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Audit | Smart Gym 360",
  description: "Manage audit for Smart Gym 360",
};

export default function AdminAuditPage() {
  return <AdminAuditClient />;
}
