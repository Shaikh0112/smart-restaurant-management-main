"use client";

// RESPONSIBILITY: Reactive custom hook for consuming and filtering global notifications by role.
// DATA FLOW: localStorage (app_notifications) -> useNotifications -> Header / Notification Drawer UI

import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
} from "@/lib/notificationService";
import type { AppNotification, UserRole, AppUser } from "@/types/appTypes";

export interface UseNotificationsReturn {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export function useNotifications(currentUser?: AppUser | null): UseNotificationsReturn {
  const [isMounted, setIsMounted] = useState(false);
  const [allNotifications, setAllNotifications] = useLocalStorage<AppNotification[]>(
    STORAGE_KEYS.NOTIFICATIONS,
    []
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Listen for custom storage_notifications events for real-time cross-component sync
  useEffect(() => {
    function handleCustomEvent() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        if (raw) {
          setAllNotifications(JSON.parse(raw));
        }
      } catch (e) {
        console.error("Failed to sync notifications", e);
      }
    }

    window.addEventListener("storage_notifications", handleCustomEvent);
    return () => window.removeEventListener("storage_notifications", handleCustomEvent);
  }, [setAllNotifications]);

  // Compute role-filtered and tenant-filtered notifications list
  const notifications = useMemo(() => {
    if (!currentUser) return allNotifications;
    return allNotifications.filter((n) => {
      // 1. Exclude if current user is the sender (they don't need a notification for their own action)
      if (n.senderId && n.senderId === currentUser.id) return false;

      // 2. Multi-Tenant isolation (unless they are SUPER_ADMIN)
      if (currentUser.role !== "SUPER_ADMIN" && n.targetTenantId) {
        if (n.targetTenantId !== currentUser.tenantId) return false;
      }

      // 3. Role-based isolation
      const roleMatches = n.role === "ALL" || n.role === currentUser.role;

      // 4. User-specific targeting
      const userMatches = !n.userId || n.userId === currentUser.id;

      return roleMatches && userMatches;
    });
  }, [allNotifications, currentUser]);

  // Compute unread count (returns 0 during SSR/initial hydration to prevent mismatch)
  const unreadCount = useMemo(
    () => (isMounted ? notifications.filter((n) => !n.isRead).length : 0),
    [isMounted, notifications]
  );

  const markAsRead = useCallback(
    (id: string) => {
      setAllNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      markNotificationAsRead(id);
    },
    [setAllNotifications]
  );

  const markAllAsRead = useCallback(() => {
    setAllNotifications((prev) =>
      prev.map((n) => {
        if (!currentUser) return n;
        const roleMatches = n.role === "ALL" || n.role === currentUser.role;
        const tenantMatches = currentUser.role === "SUPER_ADMIN" || !n.targetTenantId || n.targetTenantId === currentUser.tenantId;
        const userMatches = !n.userId || n.userId === currentUser.id;
        
        if (roleMatches && tenantMatches && userMatches) {
          return { ...n, isRead: true };
        }
        return n;
      })
    );

    if (currentUser) {
      markAllNotificationsAsRead(currentUser.role);
    } else {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        if (raw) {
          const list: AppNotification[] = JSON.parse(raw);
          const updated = list.map((n) => ({ ...n, isRead: true }));
          window.localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
          window.dispatchEvent(new Event("storage_notifications"));
        }
      } catch (e) {
        console.error("Failed to mark all read:", e);
      }
    }
  }, [currentUser, setAllNotifications]);

  const clearAll = useCallback(() => {
    setAllNotifications([]);
    clearAllNotifications();
  }, [setAllNotifications]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}
