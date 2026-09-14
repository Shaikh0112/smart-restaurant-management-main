import { EmptyState } from "@/app/super-admin/super-admin_components/Shared/EmptyState";
import { FileBox } from "lucide-react";
// RESPONSIBILITY: Renders the Super Admin Staff & Users Table with touch accessibility.
// DATA FLOW: useSuperAdminUsers -> UsersPage -> SuperAdminUsersTable

import React from "react";
import { UserCircle, Shield, Edit2, Ban, CheckCircle2 } from "lucide-react";
import type { SuperAdminUser } from "@/app/super-admin/super-admin_types/users.types";

export interface SuperAdminUsersTableProps {
  users: SuperAdminUser[];
}

export const SuperAdminUsersTable: React.FC<SuperAdminUsersTableProps> = ({ users }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-body border-collapse">
        <thead>
          <tr className="border-b border-border bg-primary/5 text-table-header font-semibold text-text-secondary uppercase tracking-wider">
            <th className="px-6 py-4">User Details</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-text-secondary">
                No matching user records found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-border/30 motion-safe:transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-input border border-border flex items-center justify-center text-text-secondary">
                      <UserCircle size={24} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{user.name}</p>
                      <p className="text-table-header text-text-secondary">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-small text-text-primary font-medium">
                    <Shield size={14} className="text-text-primary" strokeWidth={2} /> {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-badge font-semibold ${
                      user.status === "ACTIVE"
                        ? "bg-success-bg text-success border border-success/30"
                        : "bg-danger-bg text-danger border border-danger/30"
                    }`}
                  >
                    {user.status === "ACTIVE" ? <CheckCircle2 size={12} strokeWidth={2} /> : <Ban size={12} strokeWidth={2} />}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 motion-safe:transition-opacity">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-border text-text-secondary hover:text-text-primary motion-safe:transition-colors"
                      title="Edit User"
                    >
                      <Edit2 size={16} strokeWidth={2} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-danger-bg text-text-secondary hover:text-danger motion-safe:transition-colors"
                      title="Suspend User"
                    >
                      <Ban size={16} strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
