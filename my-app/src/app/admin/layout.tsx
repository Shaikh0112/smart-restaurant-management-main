// RESPONSIBILITY: Main Admin Layout Server Component.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Smart Gym 360",
  description: "Admin panel for Smart Gym 360",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
