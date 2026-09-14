// RESPONSIBILITY: Main Admin Qr Server Component.

import { AdminQrClient } from "./AdminQrClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Qr | Smart Gym 360",
  description: "Manage qr for Smart Gym 360",
};

export default function AdminQrPage() {
  return <AdminQrClient />;
}
