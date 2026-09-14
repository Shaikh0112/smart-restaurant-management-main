"use client";
// RESPONSIBILITY: Component rendering InfrastructureClient

import React from 'react';
import { useInfrastructure } from "@/app/super-admin/super-admin_hooks/useInfrastructure";
import ServerMetricsCards from "@/app/super-admin/super-admin_components/Infrastructure/ServerMetricsCards";
import DatabaseConnectionsTable from "@/app/super-admin/super-admin_components/Infrastructure/DatabaseConnectionsTable";

export default function SuperAdminInfrastructurePage() {
  const { metrics, databases } = useInfrastructure();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-page-title font-bold text-text-primary">System Infrastructure</h1>
        <p className="text-body text-text-secondary mt-1">Live monitoring for platform servers, databases, and network latency.</p>
      </div>
      
      <div>
        <ServerMetricsCards metrics={metrics} />
        <DatabaseConnectionsTable databases={databases} />
      </div>
    </div>
  );
}
