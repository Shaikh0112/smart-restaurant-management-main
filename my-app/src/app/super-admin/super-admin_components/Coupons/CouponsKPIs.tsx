"use client";
// RESPONSIBILITY: Component rendering CouponsKPIs

import React from 'react';
import type { CouponKPIs } from "@/app/super-admin/super-admin_types/coupons_types";
import { Tag, DollarSign, Award } from 'lucide-react';

interface Props {
  kpis: CouponKPIs;
}

export default function CouponsKPIs({ kpis }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4" style={{ backgroundImage: "linear-gradient(180deg, rgba(250,204,21,0.08), rgba(255,255,255,0.02))" }}>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-text-primary">
          <Tag size={24} strokeWidth={2} />
        </div>
        <div>
          <p className="text-table-header text-text-secondary font-medium uppercase tracking-wider">Active Coupons</p>
          <p className="text-2xl font-bold text-text-primary">{kpis.totalActive}</p>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4" style={{ backgroundImage: "linear-gradient(180deg, rgba(250,204,21,0.08), rgba(255,255,255,0.02))" }}>
        <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center text-success">
          <DollarSign size={24} strokeWidth={2} />
        </div>
        <div>
          <p className="text-table-header text-text-secondary font-medium uppercase tracking-wider">Total SaaS Savings</p>
          <p className="text-2xl font-bold text-text-primary">${kpis.totalSavings.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4" style={{ backgroundImage: "linear-gradient(180deg, rgba(250,204,21,0.08), rgba(255,255,255,0.02))" }}>
        <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
          <Award size={24} strokeWidth={2} />
        </div>
        <div>
          <p className="text-table-header text-text-secondary font-medium uppercase tracking-wider">Most Used Code</p>
          <p className="text-2xl font-bold text-text-primary">{kpis.mostUsedCode}</p>
        </div>
      </div>
    </div>
  );
}
