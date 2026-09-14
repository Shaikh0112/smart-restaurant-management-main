"use client";
import { getStatusConfig } from "@/config/statusBadgeConfig";
// RESPONSIBILITY: Component rendering AffiliatesTable

import React from 'react';
import type { Affiliate } from "@/app/super-admin/super-admin_types/affiliates_types";
import { Power, ExternalLink, DollarSign } from 'lucide-react';

interface Props {
  affiliates: Affiliate[];
  onProcessPayout: (id: string) => void;
  onToggleStatus: (id: string) => void;
  isProcessingPayout: boolean;
}

export default function AffiliatesTable({ affiliates, onProcessPayout, onToggleStatus, isProcessingPayout }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'suspended': return 'bg-danger/10 text-danger';
      case 'pending': return 'bg-warning/10 text-warning';
      default: return 'bg-secondary/10 text-text-secondary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-page/50">
        <h2 className="text-base font-bold text-text-primary">Affiliate Network</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-md text-body font-medium hover:bg-primary/90 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page">
          + Invite Affiliate
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-page/30 text-text-secondary text-table-header uppercase tracking-wider">
              <th className="p-4 font-medium">Affiliate</th>
              <th className="p-4 font-medium">Referral Code</th>
              <th className="p-4 font-medium">Rate</th>
              <th className="p-4 font-medium">Referred</th>
              <th className="p-4 font-medium">Pending Payout</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-body">
            {affiliates.map((aff) => (
              <tr key={aff.id} className="border-b border-border hover:bg-page/50 motion-safe:transition-colors">
                <td className="p-4">
                  <p className="font-medium text-text-primary">{aff.name}</p>
                  <p className="text-table-header text-text-secondary">{aff.email}</p>
                </td>
                <td className="p-4 text-text-primary font-mono tracking-wide">{aff.referralCode}</td>
                <td className="p-4 text-text-primary">{aff.commissionRate}%</td>
                <td className="p-4 text-text-primary">{aff.totalReferred} tenants</td>
                <td className="p-4 font-medium text-text-primary">${aff.pendingPayout.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-table-header font-medium capitalize ${getStatusColor(aff.status)}`}>
                    {aff.status}
                  </span>
                </td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  {aff.pendingPayout > 0 && (
                    <button 
                      onClick={() => onProcessPayout(aff.id)}
                      disabled={isProcessingPayout}
                      className="flex items-center gap-1 bg-primary/10 text-text-primary px-3 py-1.5 rounded-md text-table-header font-medium hover:bg-primary/20 motion-safe:transition-colors disabled:opacity-50"
                    >
                      <DollarSign size={14} strokeWidth={2} /> Pay
                    </button>
                  )}
                  <button 
                    onClick={() => onToggleStatus(aff.id)}
                    className="p-2 text-text-secondary hover:text-text-primary motion-safe:transition-colors rounded-md hover:bg-page"
                    title={aff.status === 'active' ? 'Suspend Affiliate' : 'Activate Affiliate'}
                  >
                    <Power size={16} strokeWidth={2} />
                  </button>
                  <button 
                    className="p-2 text-text-secondary hover:text-text-primary motion-safe:transition-colors rounded-md hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
                    title="View Details"
                  >
                    <ExternalLink size={16} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
            {affiliates.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-text-secondary text-body">
                  No affiliates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
