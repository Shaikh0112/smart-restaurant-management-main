"use client";
// RESPONSIBILITY: Component rendering TicketsClient

import React from 'react';
import { useTickets } from "@/app/super-admin/super-admin_hooks/useTickets";
import TicketsFilterBar from "@/app/super-admin/super-admin_components/Tickets/TicketsFilterBar";
import TicketsTable from "@/app/super-admin/super-admin_components/Tickets/TicketsTable";

export default function SuperAdminTicketsPage() {
  const { tickets, searchTerm, setSearchTerm, statusFilter, setStatusFilter } = useTickets();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-page-title font-bold text-text-primary">Support Inbox</h1>
        <p className="text-body text-text-secondary mt-1">Manage, assign, and resolve incoming tickets from restaurant managers.</p>
      </div>
      
      <div>
        <TicketsFilterBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
          statusFilter={statusFilter} 
          onStatusFilterChange={setStatusFilter} 
        />
        <TicketsTable tickets={tickets} />
      </div>
    </div>
  );
}
