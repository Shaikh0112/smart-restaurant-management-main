import { useState } from "react";

export interface SuperAdminInvoice {
  id: string;
  hotel: string;
  date: string;
  amount: string;
  status: "PAID" | "PENDING" | "OVERDUE";
  mode: "UPI" | "CARD" | "PENDING";
}

export function useSuperAdminBilling() {
  const [search, setSearch] = useState("");

  const mockInvoices: SuperAdminInvoice[] = [
    {
      id: "INV-2026-081",
      hotel: "Spicy Route",
      date: "2026-08-01",
      amount: "₹2,999.00",
      status: "PAID",
      mode: "UPI"
    },
    {
      id: "INV-2026-082",
      hotel: "Burger Hub",
      date: "2026-08-05",
      amount: "₹2,999.00",
      status: "PAID",
      mode: "CARD"
    },
    {
      id: "INV-2026-083",
      hotel: "City Diner",
      date: "2026-08-15",
      amount: "₹2,999.00",
      status: "OVERDUE",
      mode: "PENDING"
    },
    {
      id: "INV-2026-084",
      hotel: "Ocean View",
      date: "2026-08-20",
      amount: "₹2,999.00",
      status: "PENDING",
      mode: "PENDING"
    }
  ];

  const filteredInvoices = mockInvoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.hotel.toLowerCase().includes(search.toLowerCase())
  );

  return {
    search,
    setSearch,
    invoices: filteredInvoices,
  };
}
