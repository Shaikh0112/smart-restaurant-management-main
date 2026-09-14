// @ts-nocheck
// RESPONSIBILITY: All TypeScript types for the Owner Dashboard + Menu CRUD module.
// No logic, no imports from other modules — pure type definitions only.
// DATA FLOW: ManagerTypes.ts → imported by useManagerDashboard, ManagerKpiGrid,
//            ManagerRevenueChart, ManagerPaymentDonut, useManagerMenu, ManagerMenuTable,
//            ManagerMenuFormModal, ManagerRecipeEditor, ManagerComboEditor, admin pages

import type { LucideIcon } from "lucide-react";
import type { AppMenuItem, AppCombo, AppInventoryItem, KitchenStation } from "@/types/appTypes";

// ─── KPI Card ─────────────────────────────────────────────────────────────────

export interface ManagerKpiCardData {
  id:       string;
  label:    string;
  value:    string;
  icon:     LucideIcon;
  trend?:   string;
  trendUp?: boolean;
}

// ─── Chart Data ───────────────────────────────────────────────────────────────

export interface ManagerDailyStat {
  date:       string; // "DD MMM" display format e.g. "25 Jul"
  revenue:    number;
  orderCount: number;
}

export interface ManagerPaymentSplit {
  cash:  number;
  upi:   number;
  card:  number;
  split: number;
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface ManagerKpiGridProps {
  cards: ManagerKpiCardData[];
}

export interface ManagerRevenueChartProps {
  dailyStats: ManagerDailyStat[];
}

export interface ManagerPaymentDonutProps {
  paymentSplit:      ManagerPaymentSplit;
  totalTransactions: number;
}

// ─── Hook Return Shape ────────────────────────────────────────────────────────

export interface UseOwnerDashboardReturn {
  kpiCards:          ManagerKpiCardData[];
  dailyStats:        ManagerDailyStat[];
  paymentSplit:      ManagerPaymentSplit;
  totalTransactions: number;
}

// ─── Menu CRUD Types ──────────────────────────────────────────────────────────

// Zod-validated form values for add/edit menu item
export interface ManagerMenuFormValues {
  name:        string;
  price:       number;
  category:    string;
  station:     KitchenStation;
  isAvailable: boolean;
  isSpecial:   boolean;
  variants:    { name: string; price: number }[];
}

// Delete confirm dialog state
export interface ManagerDeleteConfirm {
  type:  "menu" | "combo";
  id:    string;
  label: string;
}

// useManagerMenu hook return shape
export interface UseOwnerMenuReturn {
  menuItems:      AppMenuItem[];
  combos:         AppCombo[];
  inventoryItems: AppInventoryItem[];
  isSubmitting:   boolean;
  addMenuItem:    (values: ManagerMenuFormValues) => void;
  updateMenuItem: (id: string, values: ManagerMenuFormValues) => void;
  deleteMenuItem: (id: string) => void;
  toggleAvailability: (id: string) => void;
  addCombo:       (combo: Omit<AppCombo, "id">) => void;
  updateCombo:    (id: string, updates: Omit<AppCombo, "id">) => void;
  deleteCombo:    (id: string) => void;
  saveRecipe:     (itemId: string, recipe: AppMenuItem["recipe"]) => void;
}

// ManagerMenuTable props
export interface ManagerMenuTableProps {
  menuItems:          AppMenuItem[];
  onEdit:             (item: AppMenuItem) => void;
  onDelete:           (id: string, name: string) => void;
  onToggleAvailability: (id: string) => void;
}

// ManagerMenuFormModal props
export interface ManagerMenuFormModalProps {
  isOpen:         boolean;
  editItem:       AppMenuItem | null;
  inventoryItems: AppInventoryItem[];
  onSave:         (values: ManagerMenuFormValues) => void;
  onSaveRecipe:   (itemId: string, recipe: AppMenuItem["recipe"]) => void;
  onClose:        () => void;
}

// ManagerRecipeEditor props
export interface ManagerRecipeEditorProps {
  itemId:         string;
  currentRecipe:  AppMenuItem["recipe"];
  inventoryItems: AppInventoryItem[];
  onSave:         (recipe: AppMenuItem["recipe"]) => void;
}

// ManagerComboEditor props
export interface ManagerComboEditorProps {
  combos:    AppCombo[];
  menuItems: AppMenuItem[];
  onAdd:     (combo: Omit<AppCombo, "id">) => void;
  onUpdate:  (id: string, updates: Omit<AppCombo, "id">) => void;
  onDelete:  (id: string, name: string) => void;
}

// ─── Inventory Types ──────────────────────────────────────────────────────────

export interface UseOwnerInventoryReturn {
  inventoryItems: AppInventoryItem[];
  lowStockItems:  AppInventoryItem[];
  expiringItems:  AppInventoryItem[];
  updateStock:    (id: string, newQty: number) => void;
  addInventoryItem: (item: Omit<AppInventoryItem, "id">) => void;
  deleteInventoryItem: (id: string) => void;
  updateExpiryDate: (id: string, newDate: string) => void;
}

export interface ManagerInventoryTableProps {
  inventoryItems: AppInventoryItem[];
  onUpdateStock:  (id: string, newQty: number) => void;
  onDelete: (id: string, name: string) => void;
  onUpdateExpiry: (id: string, newDate: string) => void;
}

// ─── Shift Types ──────────────────────────────────────────────────────────────

import type { AppShiftRegister, AppSalesRecord } from "@/types/appTypes";

export interface ManagerShiftOpenFormValues {
  openingCash: number;
}

export interface ManagerShiftCloseFormValues {
  closingCash: number;
}

export interface UseOwnerShiftReturn {
  shift:        AppShiftRegister | null;
  isOpen:       boolean;
  isSubmitting: boolean;
  salesHistory: AppSalesRecord[];
  openShift:    (openingCash: number) => void;
  closeShift:   (closingCash: number) => void;
}

export interface ManagerShiftReportProps {
  shift:        AppShiftRegister;
  salesHistory: AppSalesRecord[];
}

// ─── Audit Log Types ──────────────────────────────────────────────────────────

import type { AppAuditLog } from "@/types/appTypes";

export interface ManagerAuditLogTableProps {
  auditLogs: AppAuditLog[];
}

// ─── QR Generator Types ──────────────────────────────────────────────────────

import type { AppTable } from "@/types/appTypes";

export interface ManagerQrGeneratorProps {
  tables: AppTable[];
  tenantId: string;
}

// ─── Data Backup / Restore Types ──────────────────────────────────────────────────

export interface ManagerStorageUsage {
  usedKb:        number;
  limitKb:       number;
  usagePercent:  number; // 0–100
}

export interface UseOwnerDataReturn {
  storageUsage:   ManagerStorageUsage;
  isExporting:    boolean;
  isImporting:    boolean;
  isResetting:    boolean;
  exportBackup:   () => void;
  importRestore:  (file: File) => Promise<void>;
  emergencyReset: (pin: string) => boolean; // returns false if PIN wrong
}

export interface ManagerDataPanelProps {
  storageUsage:   ManagerStorageUsage;
  isExporting:    boolean;
  isImporting:    boolean;
  isResetting:    boolean;
  onExport:       () => void;
  onImport:       (file: File) => Promise<void>;
  onReset:        (pin: string) => boolean;
}
