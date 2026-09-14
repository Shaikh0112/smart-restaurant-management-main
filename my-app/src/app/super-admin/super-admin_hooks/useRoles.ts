// RESPONSIBILITY: Custom hook handling useRoles logic
// DATA FLOW: UI Component -> useRoles -> State/API
import { useState } from 'react';
import type { SuperAdminUser, AdminRole } from "@/app/super-admin/super-admin_types/roles_types";
import { MOCK_ADMINS, MOCK_PERMISSIONS_MATRIX } from "@/app/super-admin/super-admin_constants/roles_constants";

/**
 * @description Custom hook for useRoles
 * @returns {object} Hook state and methods
 */
export const useRoles = () => {
  const [admins, setAdmins] = useState<SuperAdminUser[]>(MOCK_ADMINS);
  const [selectedRole, setSelectedRole] = useState<AdminRole>('Support Agent');

  const removeAdmin = (id: string) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
  };

  const inviteAdmin = (email: string, role: AdminRole) => {
    const newAdmin: SuperAdminUser = {
      id: `adm-${Date.now()}`,
      name: 'Pending Invite',
      email,
      role,
      lastLogin: '-',
      mfaEnabled: false
    };
    setAdmins(prev => [...prev, newAdmin]);
  };

  return {
    admins,
    selectedRole,
    setSelectedRole,
    permissionsMatrix: MOCK_PERMISSIONS_MATRIX,
    removeAdmin,
    inviteAdmin
  };
};
