// RESPONSIBILITY: Shared central constants for Kitchen Module.
// Ensures no magic strings or arrays exist locally in UI components (Rule 35, Rule 3).

import type { KitchenStationTab } from "@/app/kitchen/kitchen_types/KitchenTypes";

export const KITCHEN_PAGE_TITLE = "Kitchen KDS" as const;
export const KITCHEN_PAGE_SUBTITLE = "Live KOT feed — oldest orders first" as const;

export const STATION_TABS: KitchenStationTab[] = ["All", "Kitchen", "Bar", "Bakery"];

export const STATION_TAB_LABELS: Record<KitchenStationTab, string> = {
  All: "All Stations",
  Kitchen: "Main Kitchen",
  Bar: "Bar / Drinks",
  Bakery: "Bakery / Desserts",
};

export const STOCK_TAB_KEY = "Stock" as const;
export const COMPLETED_TAB_KEY = "Completed" as const;

export const KITCHEN_SKELETON_COUNT = 4 as const;

export const WASTE_REASON_CHIPS = [
  "Spoiled",
  "Burnt",
  "Expired",
  "Order Cancelled",
] as const;

export const INVENTORY_UNITS = [
  "kg",
  "ltr",
  "pcs",
  "gm",
  "ml"
] as const;

export const INVENTORY_CATEGORIES = [
  "RAW_MATERIALS",
  "DAIRY",
  "PRODUCE",
  "MEAT",
  "BEVERAGES",
  "PACKAGING"
] as const;
