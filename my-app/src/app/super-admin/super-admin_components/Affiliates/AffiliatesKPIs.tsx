"use client";
// RESPONSIBILITY: Component rendering AffiliatesKPIs

import React from 'react';
import type { AffiliateKPIs } from "@/app/super-admin/super-admin_types/affiliates_types";
import { Users, Banknote, Clock } from 'lucide-react';

interface Props {
  kpis: AffiliateKPIs;
}

export default function AffiliatesKPIs({ kpis }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4" style={{ backgroundImage: "linear-gradient(180deg, rgba(250,204,21,0.08), rgba(255,255,255,0.02))" }}>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-text-primary">
          <Users size={24} strokeWidth={2} />
        </div>
        <div>
          <p className="text-table-header text-text-secondary font-medium uppercase tracking-wider">Total Affiliates</p>
          <p className="text-2xl font-bold text-text-primary">{kpis.totalAffiliates}</p>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4" style={{ backgroundImage: "linear-gradient(180deg, rgba(250,204,21,0.08), rgba(255,255,255,0.02))" }}>
        <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center text-success">
          <Banknote size={24} strokeWidth={2} />
        </div>
        <div>
          <p className="text-table-header text-text-secondary font-medium uppercase tracking-wider">Total Paid Out</p>
          <p className="text-2xl font-bold text-text-primary">${kpis.totalPaidOut.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4" style={{ backgroundImage: "linear-gradient(180deg, rgba(250,204,21,0.08), rgba(255,255,255,0.02))" }}>
        <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
          <Clock size={24} strokeWidth={2} />
        </div>
        <div>
          <p className="text-table-header text-text-secondary font-medium uppercase tracking-wider">Pending Payouts</p>
          <p className="text-2xl font-bold text-text-primary">${kpis.pendingPayouts.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
