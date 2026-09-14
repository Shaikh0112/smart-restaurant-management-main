// RESPONSIBILITY: Component rendering layout
import React from "react";
import { SuperAdminLayoutWrapper } from "@/app/super-admin/super-admin_components/SuperAdminLayoutWrapper";

export const metadata = {
  title: "Super Admin | Smart POS 360",
  description: "Enterprise Super Admin Dashboard",
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperAdminLayoutWrapper>{children}</SuperAdminLayoutWrapper>;
}
