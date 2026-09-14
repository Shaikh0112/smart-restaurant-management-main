"use client";
// RESPONSIBILITY: Component rendering CouponsClient

import React from 'react';
import { useCoupons } from "@/app/super-admin/super-admin_hooks/useCoupons";
import CouponsKPIs from "@/app/super-admin/super-admin_components/Coupons/CouponsKPIs";
import CouponsTable from "@/app/super-admin/super-admin_components/Coupons/CouponsTable";

export default function SuperAdminCouponsPage() {
  const { coupons, kpis, toggleStatus } = useCoupons();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-page-title font-bold text-text-primary">Coupons & Discounts</h1>
        <p className="text-body text-text-secondary mt-1">Manage global SaaS discount codes for new and existing tenants.</p>
      </div>
      
      <div>
        <CouponsKPIs kpis={kpis} />
        <CouponsTable coupons={coupons} onToggleStatus={toggleStatus} />
      </div>
    </div>
  );
}
