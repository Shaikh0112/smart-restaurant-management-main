"use client";
// RESPONSIBILITY: Component rendering PendingMigrationsAlert

import React from 'react';
import { AlertTriangle, DatabaseZap } from 'lucide-react';

interface Props {
  pendingCount: number;
  isApplying: boolean;
  onApply: () => void;
}

export default function PendingMigrationsAlert({ pendingCount, isApplying, onApply }: Props) {
  if (pendingCount === 0) return null;

  return (
    <div className="bg-warning/10 border border-warning/30 rounded-lg p-5 mb-6 flex items-start gap-4">
      <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center text-warning shrink-0">
        <AlertTriangle size={20} strokeWidth={2} />
      </div>
      <div className="flex-1">
        <h3 className="text-base font-bold text-warning">Pending Database Migrations</h3>
        <p className="text-small text-text-primary/80 mt-1 max-w-[800px]">
          There are <strong>{pendingCount}</strong> database schema changes waiting to be applied. Applying these migrations will lock tables and may cause temporary downtime.
        </p>
        <button 
          onClick={onApply}
          disabled={isApplying}
          className="mt-4 flex items-center gap-2 bg-warning text-white px-5 py-2 rounded-md text-small font-medium hover:bg-warning/90 motion-safe:transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
        >
          <DatabaseZap size={16} strokeWidth={2} />
          {isApplying ? 'Applying Migrations...' : 'Apply Migrations Now'}
        </button>
      </div>
    </div>
  );
}
