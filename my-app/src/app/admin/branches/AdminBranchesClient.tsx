"use client";

// RESPONSIBILITY: Franchise Owner Branch Management Page.
// Displays all restaurants owned by this Franchise Admin.

import React from "react";
import { Store, Plus, ArrowRight } from "lucide-react";
import { useAdminBranches } from "./admin_branches_hooks/useAdminBranches";
import { formatCurrency } from "@/lib/formatters";

export function AdminBranchesClient() {
  const { branches, isLoading, error } = useAdminBranches();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">My Branches</h1>
          <p className="text-text-secondary">Manage all your restaurant locations</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg motion-safe:transition-colors font-medium">
          <Plus className="h-4 w-4" size={18} strokeWidth={2} />
          Add New Branch
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-48 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-danger-bg text-danger rounded-lg">
          Failed to load branches: {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-card border border-border rounded-xl p-6 hover:bg-card-hover motion-safe:transition-colors shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-info/20 text-info rounded-lg">
                  <Store className="h-6 w-6" />
                </div>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  branch.status === 'ACTIVE' ? 'bg-success/20 text-success' : 
                  branch.status === 'MAINTENANCE' ? 'bg-warning/20 text-warning' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {branch.status}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-text-primary mb-1">{branch.name}</h3>
              <p className="text-sm text-text-secondary mb-6">Tenant ID: {branch.id}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-text-secondary mb-1">Revenue Today</p>
                  <p className="text-sm font-medium text-text-primary">{formatCurrency(branch.revenueToday)}</p>
                </div>
                
                <button className="flex items-center gap-1 text-sm font-medium text-info hover:text-info-hover motion-safe:transition-colors">
                  Manage
                  <ArrowRight className="h-4 w-4" size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
