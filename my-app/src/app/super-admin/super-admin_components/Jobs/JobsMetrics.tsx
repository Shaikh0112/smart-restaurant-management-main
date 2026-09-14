"use client";
// RESPONSIBILITY: Component rendering JobsMetrics

import React from 'react';
import type { JobMetrics } from "@/app/super-admin/super-admin_types/jobs_types";
import { Activity, AlertTriangle, Clock } from 'lucide-react';

interface Props {
  metrics: JobMetrics;
}

export default function JobsMetrics({ metrics }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-text-primary">
          <Activity size={20} strokeWidth={2} />
        </div>
        <div>
          <p className="text-table-header text-text-secondary font-medium uppercase tracking-wider">Processed (24h)</p>
          <p className="text-xl font-bold text-text-primary">{metrics.totalProcessed.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-danger/10 flex items-center justify-center text-danger">
          <AlertTriangle size={20} strokeWidth={2} />
        </div>
        <div>
          <p className="text-table-header text-text-secondary font-medium uppercase tracking-wider">Failed Jobs</p>
          <p className="text-xl font-bold text-text-primary">{metrics.failedCount}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center text-warning">
          <Clock size={20} strokeWidth={2} />
        </div>
        <div>
          <p className="text-table-header text-text-secondary font-medium uppercase tracking-wider">Delayed</p>
          <p className="text-xl font-bold text-text-primary">{metrics.delayedCount}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-2">
          <p className="text-table-header text-text-secondary font-medium uppercase tracking-wider">Success Rate</p>
          <span className="text-table-header font-bold text-success">{metrics.successRate}%</span>
        </div>
        <div className="w-full bg-page rounded-full h-2">
          <div 
            className="bg-success h-2 rounded-full" 
            style={{ width: `${metrics.successRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
