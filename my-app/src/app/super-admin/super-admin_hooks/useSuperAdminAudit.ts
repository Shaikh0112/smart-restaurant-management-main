// RESPONSIBILITY: Custom hook for managing Super Admin immutable audit logs search and filtering.
// DATA FLOW: useSuperAdminAudit -> AuditPage -> SuperAdminAuditLogsTable

import { useState, useMemo } from "react";

export interface SuperAdminAuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  details: string;
}

/**
 * @description Custom hook for useSuperAdminAudit
 * @returns {object} Hook state and methods
 */
export function useSuperAdminAudit() {
  const [search, setSearch] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");

  const mockLogs: SuperAdminAuditLog[] = useMemo(
    () => [
      {
        id: "LOG-0923",
        timestamp: "2026-08-21 14:32:10",
        user: "super.admin@system.com",
        action: "UPDATE_GLOBAL_SETTING",
        module: "Settings",
        severity: "WARNING",
        details: "Changed global tax rate from 18% to 5%",
      },
      {
        id: "LOG-0924",
        timestamp: "2026-08-21 12:15:00",
        user: "system.auto@pos.com",
        action: "TENANT_BACKUP_SUCCESS",
        module: "Database",
        severity: "INFO",
        details: "Automated full platform backup completed",
      },
      {
        id: "LOG-0925",
        timestamp: "2026-08-20 09:45:22",
        user: "super.admin@system.com",
        action: "SUSPEND_TENANT",
        module: "Tenants",
        severity: "CRITICAL",
        details: "Suspended tenant ID T-003 for non-payment",
      },
      {
        id: "LOG-0926",
        timestamp: "2026-08-19 16:20:05",
        user: "franchise.owner@spicy.com",
        action: "LOGIN_SUCCESS",
        module: "Auth",
        severity: "INFO",
        details: "Successful login from IP 192.168.1.45",
      },
    ],
    []
  );

  const filteredLogs = useMemo(() => {
    let list = mockLogs;
    if (severityFilter !== "ALL") {
      list = list.filter((l) => l.severity === severityFilter);
    }
    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (l) =>
          l.user.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q)
      );
    }
    return list;
  }, [mockLogs, search, severityFilter]);

  return {
    search,
    setSearch,
    severityFilter,
    setSeverityFilter,
    filteredLogs,
    totalCount: mockLogs.length,
  };
}
