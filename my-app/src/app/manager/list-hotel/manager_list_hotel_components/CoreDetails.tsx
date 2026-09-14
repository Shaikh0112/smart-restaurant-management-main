import React from 'react';
import { MapPin } from 'lucide-react';
import type {  AppTenant  } from "@/types/appTypes";

interface CoreDetailsProps {
  activeTenant: AppTenant;
}

export function CoreDetails({ activeTenant }: CoreDetailsProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4 border-b border-border pb-3">
        <MapPin size={20} className="text-primary" /> Core Details
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-text-secondary">Restaurant Name</label>
          <p className="font-bold text-text-primary text-lg mt-1">{activeTenant.restaurantName}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary">Tagline</label>
          <p className="font-medium text-text-primary mt-1">{activeTenant.tagline || "N/A"}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary">Address</label>
          <p className="font-medium text-text-primary mt-1">{activeTenant.address}, {activeTenant.city}</p>
        </div>
        <p className="text-[11px] font-bold text-primary bg-primary/10 p-2.5 rounded-lg mt-4 border border-primary/20">
          Core information is managed during initial onboarding.
        </p>
      </div>
    </div>
  );
}
