// RESPONSIBILITY: Types specific to the Kitchen KDS (Kitchen Display System) module.

import type { AppKotItem, AppMenuItem, KitchenStation, KotItemStatus, KotPriority } from "@/types/appTypes";

export type KitchenStationTab = "All" | KitchenStation;
export type KitchenPipelineStep = "PENDING" | "COOKING" | "READY";

export interface KitchenFlatKot {
  kotId: string;
  orderId: string;
  tableNumber: string;
  station: KitchenStation;
  items: AppKotItem[];
  timestamp: number; // Unix ms
  priority?: KotPriority;
}

export interface KitchenCompletedKot {
  kotId: string;
  orderId: string;
  tableNumber: string;
  station: KitchenStation;
  items: AppKotItem[];
  timestamp: number;
  completedAt: number; // Unix ms
  priority?: KotPriority;
}

export interface KitchenKpiMetrics {
  totalActiveKots: number;
  urgentCount: number;
  avgPrepTimeMins: number;
  readyItemsCount: number;
  outOfStockCount: number;
}

export interface KitchenKotCardProps {
  kot: KitchenFlatKot;
  onStatusChange: (kotId: string, itemId: string, newStatus: KitchenPipelineStep) => void;
  onBatchStatusChange: (kotId: string, targetStatus: KitchenPipelineStep) => void;
  onVoidDecision: (orderId: string, kotId: string, itemId: string, approved: boolean) => void;
  onItemPrepTimeSet: (orderId: string, kotId: string, itemId: string, mins: number) => void;
  onOpenRecipe: (itemId: string) => void;
  onOpenTicket: (kot: KitchenFlatKot) => void;
  onNotifyWaiter?: (kot: KitchenFlatKot) => void;
  savingKey: string;
}

export interface KitchenKotGridProps {
  kots: KitchenFlatKot[];
  onStatusChange: KitchenKotCardProps["onStatusChange"];
  onBatchStatusChange: KitchenKotCardProps["onBatchStatusChange"];
  onVoidDecision: KitchenKotCardProps["onVoidDecision"];
  onItemPrepTimeSet: KitchenKotCardProps["onItemPrepTimeSet"];
  onOpenRecipe: KitchenKotCardProps["onOpenRecipe"];
  onOpenTicket: KitchenKotCardProps["onOpenTicket"];
  onNotifyWaiter?: KitchenKotCardProps["onNotifyWaiter"];
  savingKey: string;
}

export interface KitchenKpiSummaryBarProps {
  metrics: KitchenKpiMetrics;
  isMuted: boolean;
  onToggleMute: () => void;
  onTestSound: () => void;
  onOpenAnalytics?: () => void;
  onSelectStockTab?: (stockFilter?: "OUT_OF_STOCK" | "IN_STOCK" | "ALL") => void;
}

export interface KitchenStatusPipelineProps {
  currentStatus: AppKotItem["status"];
  onStatusChange: (status: KitchenPipelineStep) => void;
  isDisabled: boolean;
}

export interface KitchenPrepTimeInputProps {
  currentMins: number;
  onSet: (mins: number) => void;
}

export interface KitchenTicketModalProps {
  isOpen: boolean;
  kot: KitchenFlatKot | null;
  onClose: () => void;
}

export interface KitchenAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface KitchenCompletedOrdersViewProps {
  completedKots: KitchenCompletedKot[];
  onRecallKot: (kotId: string) => void;
}

export interface UseKitchenKdsReturn {
  allFlatKots: KitchenFlatKot[];
  filteredKots: KitchenFlatKot[];
  completedKots: KitchenCompletedKot[];
  metrics: KitchenKpiMetrics;
  menuItemName: (itemId: string) => string;
  savingKey: string;
  updateKotItemStatus: (
    orderId: string,
    kotId: string,
    itemId: string,
    newStatus: KotItemStatus
  ) => void;
  batchUpdateKotStatus: (
    kotId: string,
    targetStatus: KitchenPipelineStep
  ) => void;
  handleVoidDecision: (
    orderId: string,
    kotId: string,
    itemId: string,
    approved: boolean
  ) => void;
  broadcastPickupNotification: (kot: KitchenFlatKot) => void;
  recallCompletedKot: (kotId: string) => void;
  setItemPrepTime: (orderId: string, kotId: string, itemId: string, mins: number) => void;
  menuItems: AppMenuItem[];
}
