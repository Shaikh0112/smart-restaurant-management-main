// RESPONSIBILITY: Custom hook handling useTickets logic
// DATA FLOW: UI Component -> useTickets -> State/API
import { useState, useMemo } from 'react';
import type { SupportTicket, TicketStatus } from "@/app/super-admin/super-admin_types/tickets_types";
import { MOCK_TICKETS } from "@/app/super-admin/super-admin_constants/tickets_constants";

/**
 * @description Custom hook for useTickets
 * @returns {object} Hook state and methods
 */
export const useTickets = () => {
  const [tickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch = ticket.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchTerm, statusFilter]);

  return {
    tickets: filteredTickets,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
  };
};
