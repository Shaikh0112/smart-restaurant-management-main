import { useAuth } from "@/app/auth/auth_hooks/useAuth";
import type { UserRole } from "@/types/appTypes";

type PermissionAction =
  | "create_staff"
  | "delete_staff"
  | "create_menu"
  | "delete_menu"
  | "edit_menu"
  | "view_reports"
  | "manage_inventory"
  | "manage_tables"
  | "manage_billing"
  | "take_order"
  | "view_kitchen_kds"
  | "manage_tenant"
  | "manage_subscriptions";

const rolePermissions: Record<UserRole, PermissionAction[]> = {
  SUPER_ADMIN: [
    "manage_subscriptions",
    "manage_tenant",
    "view_reports",
  ],
  ADMIN: [
    "create_staff",
    "delete_staff",
    "create_menu",
    "delete_menu",
    "edit_menu",
    "view_reports",
    "manage_inventory",
    "manage_tables",
    "manage_tenant",
    "manage_billing",
  ],
  MANAGER: [
    "create_staff",
    "delete_staff",
    "create_menu",
    "delete_menu",
    "edit_menu",
    "view_reports",
    "manage_inventory",
    "manage_tables",
    "manage_tenant",
    "manage_billing",
  ],
  CASHIER: [
    "manage_billing",
    "view_reports",
  ],
  WAITER: [
    "take_order",
  ],
  KITCHEN: [
    "view_kitchen_kds",
  ],
  CUSTOMER: [],
};

export function usePermissions() {
  const { currentUser } = useAuth();

  const hasPermission = (action: PermissionAction): boolean => {
    if (!currentUser) return false;
    const permissions = rolePermissions[currentUser.role] || [];
    return permissions.includes(action);
  };

  const isRole = (roles: UserRole[]): boolean => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };

  return { hasPermission, isRole, role: currentUser?.role || null };
}
