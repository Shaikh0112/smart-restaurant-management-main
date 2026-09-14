// RESPONSIBILITY: Main Admin Data Server Component.

import { AdminDataClient } from "./AdminDataClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Data Management | Smart Gym 360",
  description: "Data backup, restore, and emergency reset",
};

export default function AdminDataPage() {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">
          Data Management
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          Manage local storage usage, create backups, restore data, or perform emergency resets.
        </p>
      </div>
      <AdminDataClient />
    </div>
  );
}
