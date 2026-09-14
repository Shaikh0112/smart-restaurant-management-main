// RESPONSIBILITY: Custom hook for managing Super Admin Staff & Users directory.
// DATA FLOW: useSuperAdminUsers -> UsersPage -> SuperAdminUsersTable

import { useState, useMemo } from "react";

import type { SuperAdminUser } from "@/app/super-admin/super-admin_types/users.types";

/**
 * @description Custom hook for useSuperAdminUsers
 * @returns {object} Hook state and methods
 */
export function useSuperAdminUsers() {
  const [search, setSearch] = useState<string>("");

  const mockUsers: SuperAdminUser[] = useMemo(
    () => [
      {
        id: "USR-001",
        name: "Saurabh Mishra",
        email: "saurabh@smartpos360.com",
        role: "Super Admin",
        status: "ACTIVE",
      },
      {
        id: "USR-002",
        name: "Ankita Roy",
        email: "ankita@smartpos360.com",
        role: "Support Manager",
        status: "ACTIVE",
      },
      {
        id: "USR-003",
        name: "Ramesh Kumar",
        email: "ramesh@smartpos360.com",
        role: "Sales Executive",
        status: "SUSPENDED",
      },
    ],
    []
  );

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return mockUsers;
    return mockUsers.filter(
      (usr) =>
        usr.name.toLowerCase().includes(q) ||
        usr.email.toLowerCase().includes(q) ||
        usr.role.toLowerCase().includes(q)
    );
  }, [mockUsers, search]);

  return {
    search,
    setSearch,
    filteredUsers,
  };
}
