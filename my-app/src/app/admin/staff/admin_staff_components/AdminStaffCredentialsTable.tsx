// RESPONSIBILITY: Presentation component for AdminStaffCredentialsTable.
// DATA FLOW: Props -> Component -> UI

import React from "react";
import type { AppUser } from "@/types/appTypes";
import { CredentialsCopyRow } from "./CredentialsCopyRow";
import { AppPagination } from "@/components/ui/AppPagination";

export interface AdminStaffCredentialsTableProps {
  staffList: AppUser[];
  pageStaff: AppUser[];
  safePage: number;
  totalPages: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  handleToggleStatus: (userId: string) => void;
}

export function AdminStaffCredentialsTable({
  staffList,
  pageStaff,
  safePage,
  totalPages,
  pageSize,
  setCurrentPage,
  setPageSize,
  handleToggleStatus,
}: AdminStaffCredentialsTableProps) {
  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-xs">
          <thead className="bg-header uppercase text-text-secondary font-semibold">
            <tr>
              <th className="px-4 py-3">Staff Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Username / ID</th>
              <th className="px-4 py-3">Password</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-text-primary">
            {staffList.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-text-secondary">
                  No staff credentials found. Click "Generate New Staff Credentials" to create one.
                </td>
              </tr>
            ) : (
              pageStaff.map((u) => (
                <CredentialsCopyRow key={u.id} u={u} handleToggleStatus={handleToggleStatus} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <AppPagination
        currentPage={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={staffList.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </>
  );
}
