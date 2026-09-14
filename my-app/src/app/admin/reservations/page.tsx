// RESPONSIBILITY: Main Admin Reservations Server Component.

import { AdminReservationsClient } from "./AdminReservationsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Reservations | Smart Gym 360",
  description: "Manage reservations for Smart Gym 360",
};

export default function AdminReservationsPage() {
  return <AdminReservationsClient />;
}
