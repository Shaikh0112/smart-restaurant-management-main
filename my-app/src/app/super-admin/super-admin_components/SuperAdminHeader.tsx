"use client";
// RESPONSIBILITY: Component rendering SuperAdminHeader

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, User, LogOut, Menu, UtensilsCrossed } from "lucide-react";
import { useAuth } from "@/app/auth/auth_hooks/useAuth";

interface HeaderProps {
  isCollapsed: boolean;
  onMenuClick: () => void;
}

export function SuperAdminHeader({ isCollapsed, onMenuClick }: HeaderProps) {
  const { logout, currentUser } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 h-[64px] bg-header/80 backdrop-blur-md border-b border-border z-20 motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-in-out flex items-center justify-between px-4 sm:px-6"
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu */}
        <button
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          className="p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-primary/10 rounded-md motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
        >
          <Menu size={20} strokeWidth={2} />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 motion-safe:transition-opacity hover:opacity-80">
          <UtensilsCrossed size={22} className="text-text-primary" aria-hidden="true" strokeWidth={2} />
          <span className="text-base font-bold text-text-primary">
            Smart POS 360
          </span>
        </Link>
      </div>

      {/* Right side Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Branch Selector */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card cursor-pointer hover:bg-border/50 motion-safe:transition-colors">
          <span className="text-kpi-valueage-titles font-bold text-text-primary">Master Branch</span>
          <ChevronDown size={14} className="text-text-secondary" strokeWidth={2} />
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 text-text-secondary hover:text-text-primary motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page rounded-full">
          <Bell size={20} strokeWidth={2} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger border-2 border-header"></span>
        </button>

        {/* User Profile Dropdown & Logout */}
        <div className="flex items-center gap-3 pl-2 sm:border-l border-border">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-text-primary">
              <User size={16} strokeWidth={2} />
            </div>
            <div className="hidden md:block">
              <p className="text-kpi-valueage-titles font-bold text-text-primary">Super Admin</p>
              <p className="text-micro text-text-secondary">{currentUser?.email || "Owner"}</p>
            </div>
            <ChevronDown size={14} className="text-text-secondary hidden sm:block mr-2" strokeWidth={2} />
          </div>
          
          <button
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className="flex items-center gap-1 rounded-md bg-danger/10 px-2.5 py-1.5 text-kpi-valueage-titles font-medium text-danger motion-safe:transition-colors hover:bg-danger/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
          >
            <LogOut size={14} strokeWidth={2} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
