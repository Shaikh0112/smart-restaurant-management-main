"use client";

import { UserCheck, UserX, Shield } from "lucide-react";
import type { AppUser } from "@/types/appTypes";

// RESPONSIBILITY: Renders a single staff credential row.

interface CredentialsCopyRowProps {
  u: AppUser;
  handleToggleStatus: (id: string) => void;
}

export function CredentialsCopyRow({ u, handleToggleStatus }: CredentialsCopyRowProps) {
  return (
    <tr className="hover:bg-primary/5 motion-safe:transition-colors">
      <td className="p-4 align-middle">
        <div className="flex flex-col">
          <span className="font-semibold text-text-primary truncate max-w-[150px]" title={u.name}>{u.name}</span>
          <span className="text-xs text-text-secondary truncate max-w-[150px]" title={u.username}>{u.username}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold text-[10px] ${
            u.role === "CASHIER"
              ? "bg-pay-cash-bg text-pay-cash"
              : u.role === "WAITER"
              ? "bg-info-bg text-info"
              : "bg-warning-bg text-warning"
          }`}
        >
          <Shield size={10} />
          {u.role}
        </span>
      </td>
      <td className="px-4 py-3 font-mono font-bold text-primary">{u.username}</td>
      <td className="px-4 py-3 font-mono text-text-secondary">{u.passwordHash}</td>
      <td className="px-4 py-3 text-text-secondary">{u.phone || "---"}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold text-[10px] ${
            u.isActive
              ? "bg-success-bg text-success"
              : "bg-danger-bg text-danger"
          }`}
        >
          {u.isActive ? <UserCheck size={10} /> : <UserX size={10} />}
          {u.isActive ? "ACTIVE" : "INACTIVE"}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => handleToggleStatus(u.id)}
          className={`rounded px-2.5 py-1 text-[11px] font-semibold motion-safe:transition-all ${
            u.isActive
              ? "border border-danger/30 text-danger hover:bg-danger/10"
              : "border border-success/30 text-success hover:bg-success/10"
          }`}
        >
          {u.isActive ? "Deactivate" : "Activate"}
        </button>
      </td>
    </tr>
  );
}
