// RESPONSIBILITY: Renders the search input, log waste button, status filter chips, and station dropdown.

import { Search, Trash2, CheckCircle2, AlertOctagon } from "lucide-react";

interface KitchenStockFilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  stockFilter: "ALL" | "IN_STOCK" | "OUT_OF_STOCK";
  setStockFilter: (s: "ALL" | "IN_STOCK" | "OUT_OF_STOCK") => void;
  selectedStation: string;
  setSelectedStation: (s: string) => void;
  onOpenWasteLog: () => void;
  totalCount: number;
  inStockCount: number;
  outOfStockCount: number;
  handleBatchToggle: (isAvailable: boolean) => void;
}

export function KitchenStockFilterBar({
  search,
  setSearch,
  stockFilter,
  setStockFilter,
  selectedStation,
  setSelectedStation,
  onOpenWasteLog,
  totalCount,
  inStockCount,
  outOfStockCount,
  handleBatchToggle,
}: KitchenStockFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      {/* Top row: Fast Search Input & Log Waste Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search kitchen menu items by name or category…"
            className="w-full rounded-xl border border-border bg-input pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
        </div>

        <button
          onClick={onOpenWasteLog}
          className="flex h-11 items-center gap-2 rounded-xl bg-danger/10 border border-danger/30 px-4 text-xs font-bold text-danger hover:bg-danger/20 transition-all active:scale-95 shadow-xs"
        >
          <Trash2 className="h-4 w-4" />
          <span>Log Waste</span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
        {/* Stock Status Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStockFilter("ALL")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              stockFilter === "ALL"
                ? "bg-primary text-white shadow-sm"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            <span>All Items</span>
            <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">{totalCount}</span>
          </button>

          <button
            onClick={() => setStockFilter("IN_STOCK")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              stockFilter === "IN_STOCK"
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>In Stock</span>
            <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">{inStockCount}</span>
          </button>

          <button
            onClick={() => setStockFilter("OUT_OF_STOCK")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              stockFilter === "OUT_OF_STOCK"
                ? "bg-red-500 text-white shadow-sm"
                : "bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20"
            }`}
          >
            <AlertOctagon className="h-3.5 w-3.5" />
            <span>Out of Stock</span>
            <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">{outOfStockCount}</span>
          </button>
        </div>

        {/* Station Filter Dropdown & Bulk Actions */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="rounded-xl border border-border bg-input px-3 py-1.5 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="All">All Stations</option>
            <option value="Kitchen">Main Kitchen</option>
            <option value="Bar">Bar / Drinks</option>
            <option value="Bakery">Bakery / Desserts</option>
          </select>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleBatchToggle(true)}
              title={`Mark all ${selectedStation} items In Stock`}
              className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1.5 text-[11px] font-bold text-emerald-500 hover:bg-emerald-500/20"
            >
              Mark Station In Stock
            </button>
            <button
              onClick={() => handleBatchToggle(false)}
              title={`Mark all ${selectedStation} items Out of Stock`}
              className="rounded-lg bg-red-500/10 border border-red-500/30 px-2.5 py-1.5 text-[11px] font-bold text-red-500 hover:bg-red-500/20"
            >
              Mark Station Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
