// RESPONSIBILITY: Main Admin ListHotel Server Component.

import { AdminListHotelClient } from "./AdminListHotelClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin ListHotel | Smart Gym 360",
  description: "Manage list-hotel for Smart Gym 360",
};

export default function AdminListHotelPage() {
  return <AdminListHotelClient />;
}
