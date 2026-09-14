// RESPONSIBILITY: Main Admin Coupons Server Component.

import { AdminCouponsClient } from "./AdminCouponsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Coupons | Smart Gym 360",
  description: "Manage coupons for Smart Gym 360",
};

export default function AdminCouponsPage() {
  return <AdminCouponsClient />;
}
