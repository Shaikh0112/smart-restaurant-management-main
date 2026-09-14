import React from "react";
import Link from "next/link";
import { MANAGER_ROUTES } from "@/app/manager/manager_url_config";
import {
  Building2,
  CreditCard,
  Bell,
  ChefHat,
  CalendarCheck,
  QrCode,
  Users,
} from "lucide-react";
import type { AppTenant } from "@/types/appTypes";

interface ManagerLaunchpadProps {
  activeTenant: AppTenant;
}

export function ManagerLaunchpad({ activeTenant }: ManagerLaunchpadProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Link
        href="/admin/dashboard"
        className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs hover:border-primary hover:shadow-md transition-all"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 size={24} />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-text-primary group-hover:text-primary">
            Admin Command Center
          </h3>
          <p className="text-xs text-text-secondary">Analytics & management</p>
        </div>
      </Link>

      <Link
        href="/billing"
        className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
          <CreditCard size={24} />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-text-primary group-hover:text-emerald-500">
            Cashier Billing POS
          </h3>
          <p className="text-xs text-text-secondary">Bills & thermal print</p>
        </div>
      </Link>

      <Link
        href="/waiter"
        className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs hover:border-amber-500 hover:shadow-md transition-all"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
          <Bell size={24} />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-text-primary group-hover:text-amber-500">
            Waiter Floor Captain
          </h3>
          <p className="text-xs text-text-secondary">KOTs & floor service</p>
        </div>
      </Link>

      <Link
        href="/kitchen"
        className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs hover:border-red-500 hover:shadow-md transition-all"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
          <ChefHat size={24} />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-text-primary group-hover:text-red-500">
            Kitchen KDS Terminal
          </h3>
          <p className="text-xs text-text-secondary">Station tickets</p>
        </div>
      </Link>

      <Link
        href={MANAGER_ROUTES.RESERVATIONS}
        className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs hover:border-blue-500 hover:shadow-md transition-all"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
          <CalendarCheck size={24} />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-text-primary group-hover:text-blue-500">
            Advance Reservations
          </h3>
          <p className="text-xs text-text-secondary">View table bookings</p>
        </div>
      </Link>

      <Link
        href={`/customer?table=T-01&tenant=${activeTenant.tenantId}`}
        className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs hover:border-purple-500 hover:shadow-md transition-all"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
          <QrCode size={24} />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-text-primary group-hover:text-purple-500">
            Customer QR Menu
          </h3>
          <p className="text-xs text-text-secondary">Zero friction self-order</p>
        </div>
      </Link>

      <Link
        href={MANAGER_ROUTES.CREDENTIALS}
        className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-500">
          <Users size={24} />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-text-primary group-hover:text-emerald-500">
            Staff Credentials
          </h3>
          <p className="text-xs text-text-secondary">Generate logins</p>
        </div>
      </Link>
    </div>
  );
}
