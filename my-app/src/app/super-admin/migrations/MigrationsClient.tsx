"use client";
// RESPONSIBILITY: Component rendering MigrationsClient

import React from 'react';
import { useMigrations } from "@/app/super-admin/super-admin_hooks/useMigrations";
import PendingMigrationsAlert from "@/app/super-admin/super-admin_components/Migrations/PendingMigrationsAlert";
import MigrationsHistoryTable from "@/app/super-admin/super-admin_components/Migrations/MigrationsHistoryTable";

export default function SuperAdminMigrationsPage() {
  const { migrations, pendingCount, isApplying, applyPendingMigrations, rollbackMigration } = useMigrations();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-page-title font-bold text-text-primary">Database Migrations</h1>
        <p className="text-body text-text-secondary mt-1">Track and execute Prisma/SQL schema changes across tenant databases.</p>
      </div>
      
      <div>
        <PendingMigrationsAlert 
          pendingCount={pendingCount} 
          isApplying={isApplying} 
          onApply={applyPendingMigrations} 
        />
        <MigrationsHistoryTable migrations={migrations} onRollback={rollbackMigration} />
      </div>
    </div>
  );
}
