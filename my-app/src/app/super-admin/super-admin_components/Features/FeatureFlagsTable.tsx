"use client";
// RESPONSIBILITY: Component rendering FeatureFlagsTable

import React from "react";
import type { FeatureFlag, FeatureRolloutType } from "@/app/super-admin/super-admin_types/features_types";
import { ToggleRight, Users, Globe, XCircle } from "lucide-react";

interface Props {
  features: FeatureFlag[];
  onUpdateRollout: (id: string, rollout: FeatureRolloutType) => void;
}

export default function FeatureFlagsTable({ features, onUpdateRollout }: Props) {
  const getRolloutIcon = (type: string) => {
    switch (type) {
      case 'global': return <Globe size={14} className="text-success" strokeWidth={2} />;
      case 'beta_only': return <Users size={14} className="text-warning" strokeWidth={2} />;
      case 'disabled': return <XCircle size={14} className="text-danger" strokeWidth={2} />;
      default: return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden mt-6">
      <div className="p-4 border-b border-border flex justify-between items-center bg-page/50">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <ToggleRight size={18} className="text-text-secondary" strokeWidth={2} /> Active Feature Flags
        </h2>
        <button className="bg-primary text-white px-4 py-2 rounded-md text-body font-medium hover:bg-primary/90 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page">
          + New Flag
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-page/30 text-text-secondary text-table-header uppercase tracking-wider">
              <th className="p-4 font-medium">Feature</th>
              <th className="p-4 font-medium">Rollout Scope</th>
              <th className="p-4 font-medium">Active Tenants</th>
              <th className="p-4 font-medium">Last Updated</th>
            </tr>
          </thead>
          <tbody className="text-body">
            {features.map((feature) => (
              <tr key={feature.id} className="border-b border-border hover:bg-page/50 motion-safe:transition-colors">
                <td className="p-4">
                  <p className="font-bold text-text-primary">{feature.name}</p>
                  <p className="text-table-header text-text-secondary mt-1">{feature.description}</p>
                  <p className="text-badge text-text-primary/50 font-mono mt-1">ID: {feature.id}</p>
                </td>
                <td className="p-4">
                  <select 
                    value={feature.rolloutType}
                    onChange={(e) => onUpdateRollout(feature.id, e.target.value as FeatureRolloutType)}
                    className="bg-page border border-border rounded-md px-3 py-1.5 text-small text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="global">Global (100%)</option>
                    <option value="beta_only">Beta Tenants Only</option>
                    <option value="disabled">Disabled</option>
                  </select>
                  <div className="flex items-center gap-1.5 mt-2 text-badge text-text-secondary font-medium">
                    {getRolloutIcon(feature.rolloutType)}
                    <span className="capitalize">{feature.rolloutType.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="p-4 text-text-primary font-medium">
                  {feature.tenantCount.toLocaleString()} 
                  <span className="text-text-secondary font-normal text-table-header"> enabled</span>
                </td>
                <td className="p-4">
                  <p className="text-table-header text-text-primary">{new Date(feature.lastUpdated).toLocaleDateString()}</p>
                  <p className="text-badge text-text-secondary mt-1">by {feature.updatedBy}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
