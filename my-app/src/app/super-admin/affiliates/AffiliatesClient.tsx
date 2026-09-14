"use client";
// RESPONSIBILITY: Component rendering AffiliatesClient

import React from 'react';
import { useAffiliates } from "@/app/super-admin/super-admin_hooks/useAffiliates";
import AffiliatesKPIs from "@/app/super-admin/super-admin_components/Affiliates/AffiliatesKPIs";
import AffiliatesTable from "@/app/super-admin/super-admin_components/Affiliates/AffiliatesTable";

export default function SuperAdminAffiliatesPage() {
  const { affiliates, kpis, isProcessingPayout, processPayout, toggleStatus } = useAffiliates();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-page-title font-bold text-text-primary">Affiliate Program</h1>
        <p className="text-body text-text-secondary mt-1">Manage referral partners, track conversions, and process commission payouts.</p>
      </div>
      
      <div>
        <AffiliatesKPIs kpis={kpis} />
        <AffiliatesTable 
          affiliates={affiliates} 
          onProcessPayout={processPayout} 
          onToggleStatus={toggleStatus} 
          isProcessingPayout={isProcessingPayout} 
        />
      </div>
    </div>
  );
}
