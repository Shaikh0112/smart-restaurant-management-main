"use client";
// RESPONSIBILITY: Component rendering SuperAdminSidebar

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart2,
  Building2,
  Clock,
  CreditCard,
  Receipt,
  Users,
  Shield,
  Settings,
  Database,
  ChevronLeft,
  ChevronRight,
  Library,
  X,
  UtensilsCrossed,
  Users2,
  Ticket,
  MessageSquare,
  Megaphone,
  FileText,
  Tag,
  Palette,
  ListChecks,
  Server,
  Briefcase,
  ArrowRightLeft,
  UserCog,
  ShieldCheck,
  Settings2
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (v: boolean) => void;
}

export function SuperAdminSidebar({ isCollapsed, setIsCollapsed, isMobileOpen = false, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  const navGroups = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
        { label: "Analytics", href: "/super-admin/analytics", icon: BarChart2 },
        { label: "Data Insights", href: "/super-admin/data", icon: Database },
      ]
    },
    {
      title: "TENANTS & CRM",
      items: [
        { label: "Hotel Matrix", href: "/super-admin/hotels", icon: Building2 },
        { label: "Audit Requests", href: "/super-admin/requests", icon: Clock },
        { label: "Affiliates", href: "/super-admin/affiliates", icon: Users2 },
        { label: "Tickets", href: "/super-admin/tickets", icon: Ticket },
      ]
    },
    {
      title: "MARKETING & COMMS",
      items: [
        { label: "Communications", href: "/super-admin/communications", icon: MessageSquare },
        { label: "Broadcasts", href: "/super-admin/broadcasts", icon: Megaphone },
        { label: "Coupons", href: "/super-admin/coupons", icon: Tag },
      ]
    },
    {
      title: "FINANCE",
      items: [
        { label: "Subscriptions", href: "/super-admin/subscriptions", icon: Receipt },
        { label: "Payments", href: "/super-admin/payments", icon: CreditCard },
        { label: "Billing", href: "/super-admin/billing", icon: FileText },
      ]
    },
    {
      title: "ACCESS CONTROL",
      items: [
        { label: "Staff & Users", href: "/super-admin/users", icon: Users },
        { label: "Roles & Permissions", href: "/super-admin/roles", icon: UserCog },
      ]
    },
    {
      title: "SYSTEM & CONFIG",
      items: [
        { label: "Settings", href: "/super-admin/settings", icon: Settings },
        { label: "Branding", href: "/super-admin/branding", icon: Palette },
        { label: "Features", href: "/super-admin/features", icon: ListChecks },
        { label: "System", href: "/super-admin/system", icon: Settings2 },
      ]
    },
    {
      title: "INFRA & SECURITY",
      items: [
        { label: "Security", href: "/super-admin/security", icon: ShieldCheck },
        { label: "Audit Logs", href: "/super-admin/audit", icon: Shield },
        { label: "Infrastructure", href: "/super-admin/infrastructure", icon: Server },
        { label: "Backups", href: "/super-admin/backup", icon: Database },
        { label: "Jobs", href: "/super-admin/jobs", icon: Briefcase },
        { label: "Migrations", href: "/super-admin/migrations", icon: ArrowRightLeft },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-overlay md:hidden motion-safe:transition-opacity" 
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 md:top-16 left-0 h-screen md:h-[calc(100vh-4rem)] bg-sidebar border-r border-border z-40 flex flex-col motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-in-out ${
          isCollapsed && !isMobileOpen ? "md:w-16" : "md:w-60"
        } w-60 ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo Area (Mobile Only) */}
        <div className="md:hidden h-16 shrink-0 border-b border-border flex items-center justify-between px-4 bg-sidebar">
          <Link href="/" className="flex items-center gap-2 overflow-hidden motion-safe:transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shrink-0 shadow-sm">
              <UtensilsCrossed size={18} strokeWidth={2} />
            </div>
            <span className="font-bold text-body text-text-primary truncate">
              Smart POS 360
            </span>
          </Link>
          
          {/* Mobile Close Button */}
          {isMobileOpen && (
            <button 
              className="p-1 text-text-secondary hover:text-text-primary rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            >
              <X size={20} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 overflow-x-hidden">
          {navGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              {(!isCollapsed || isMobileOpen) && (
                <p className="px-4 text-badge font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  {group.title}
                </p>
              )}
              <ul className="flex flex-col gap-1 px-2">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md motion-safe:transition-all motion-safe:duration-200 ${
                          isActive
                            ? "bg-primary-subtle text-text-primary font-medium border-l-[3px] border-primary shadow-lg shadow-primary/20"
                            : "text-text-secondary hover:bg-border/50 hover:text-text-primary border-l-[3px] border-transparent"
                        } ${(isCollapsed && !isMobileOpen) ? "justify-center" : "justify-start"}`}
                        title={(isCollapsed && !isMobileOpen) ? item.label : ""}
                        onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                      >
                        <Icon size={18} className="shrink-0" />
                        {(!isCollapsed || isMobileOpen) && (
                          <span className="text-body truncate">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

      </aside>
    </>
  );
}
