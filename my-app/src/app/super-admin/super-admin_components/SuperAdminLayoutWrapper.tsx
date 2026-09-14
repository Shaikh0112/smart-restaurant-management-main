"use client";
// RESPONSIBILITY: Component rendering SuperAdminLayoutWrapper

import React, { useState, useEffect } from "react";
import { SuperAdminSidebar } from "@/app/super-admin/super-admin_components/SuperAdminSidebar";
import { SuperAdminHeader } from "@/app/super-admin/super-admin_components/SuperAdminHeader";
import { usePathname } from "next/navigation";

export function SuperAdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar on route change
  // AUDIT: Dependency array verified for React bounds
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-page text-text-primary">
      <SuperAdminSidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <SuperAdminHeader 
        isCollapsed={isCollapsed} 
        onMenuClick={() => {
          if (typeof window !== "undefined" && window.innerWidth < 768) {
            setIsMobileOpen(true);
          } else {
            setIsCollapsed(!isCollapsed);
          }
        }}
      />
      
      <main
        className="motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-in-out pt-16"
        style={{ 
          // Default to no margin for mobile, handled by media query classes if possible,
          // but inline styles are harder to make responsive. 
          // We will use CSS classes instead of inline style for margin.
        }}
      >
        <div 
          className={`p-6 motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-in-out ${
            isCollapsed ? "md:ml-16" : "md:ml-60"
          } ml-0`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
