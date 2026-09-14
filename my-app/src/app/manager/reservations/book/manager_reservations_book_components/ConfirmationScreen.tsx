import React from 'react';
import Link from 'next/link';
import type {  AppTenant, AppPreOrderItem  } from "@/types/appTypes";

interface ConfirmationScreenProps {
  tenant: AppTenant;
  bookingDate: string;
  bookingTime: string;
  totalAdvanceDeposit: number;
  preOrders: AppPreOrderItem[];
}

export function ConfirmationScreen({
  tenant,
  bookingDate,
  bookingTime,
  totalAdvanceDeposit,
  preOrders
}: ConfirmationScreenProps) {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-3xl border border-emerald-500/40 bg-card shadow-2xl gap-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 text-3xl">
        🎉
      </div>
      <h2 className="text-2xl font-black text-text-primary">
        Table Reservation Confirmed!
      </h2>
      <p className="text-xs text-text-secondary max-w-sm">
        We look forward to serving you at <strong>{tenant.restaurantName}</strong> on {bookingDate} at {bookingTime}.
      </p>
      <div className="rounded-2xl border border-border bg-surface p-4 text-xs font-bold text-text-primary w-full max-w-xs">
        <p>Advance Paid: ₹{totalAdvanceDeposit}</p>
        <p className="text-[11px] text-text-muted font-normal mt-0.5">Pre-Ordered Dishes: {preOrders.length} item(s)</p>
      </div>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-primary/90"
      >
        Back to Marketplace
      </Link>
    </div>
  );
}
