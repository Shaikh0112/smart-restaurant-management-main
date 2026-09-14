// RESPONSIBILITY: Client-side orchestrator for Waiter root page.
// Hydrates with initial server data, handles URL state for filters, and manages modals.

"use client";

import { useState, useMemo } from "react";
import { LayoutGrid, Map, Search, Filter, Languages, Bell, ChefHat, ArrowRightLeft, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { WaiterTableGrid } from "@/app/waiter/waiter_components/WaiterTableGrid";
import { WaiterOrderModal } from "@/app/waiter/waiter_components/WaiterOrderModal";
import { WaiterTableActionsDrawer } from "@/app/waiter/waiter_components/WaiterTableActionsDrawer";
import { WaiterTableTransferModal } from "@/app/waiter/waiter_components/WaiterTableTransferModal";
import { WaiterReadyQueue } from "@/app/waiter/waiter_components/WaiterReadyQueue";
import { WaiterServiceRequestsDrawer } from "@/app/waiter/waiter_components/WaiterServiceRequestsDrawer";
import { WaiterTableQrModal } from "@/app/waiter/waiter_components/WaiterTableQrModal";
import { showToast } from "@/lib/toastService";
import { useWaiterStore } from "@/app/waiter/waiter_store/waiter.store";
import { useWaiterTables, useWaiterOrders, useWaiterServiceRequests } from "@/app/waiter/waiter_hooks/useWaiterQueries";
import { useTransferTableMutation } from "@/app/waiter/waiter_hooks/useWaiterMutations";
import type { AppTable, AppOrder, AppServiceRequest, AppNotification } from "@/types/appTypes";
import type { WaiterViewMode, WaiterTableSection } from "@/app/waiter/waiter_types/WaiterTypes";

const SECTION_TABS: WaiterTableSection[] = ["All", "Dining", "AC", "Outdoor"];

export function WaiterDashboardOrchestrator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, toggleLanguage } = useLanguage();
  
  // URL State
  const activeSection = (searchParams.get("section") as WaiterTableSection) || "All";
  const statusFilter = searchParams.get("status") || "ALL";
  const search = searchParams.get("search") || "";
  
  // Global UI State
  const viewMode = useWaiterStore((s) => s.viewMode);
  const setViewMode = useWaiterStore((s) => s.setViewMode);
  
  // React Query Data
  const { data: tables = [], isLoading: tablesLoading } = useWaiterTables();
  const { data: orders = [] } = useWaiterOrders();
  const { data: serviceRequests = [] } = useWaiterServiceRequests();
  
  // Mutations
  const transferMutation = useTransferTableMutation();

  // Local Modal States
  const [modalTableId, setModalTableId] = useState("");
  const [modalTableNumber, setModalTableNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drawerTableId, setDrawerTableId] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [transferSourceTable, setTransferSourceTable] = useState<AppTable | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [qrTable, setQrTable] = useState<AppTable | null>(null);
  const [isServiceRequestsOpen, setIsServiceRequestsOpen] = useState(false);
  
  // Mock notifications for now since it's not fully extracted
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Filtered tables
  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      const matchesSection = activeSection === "All" || t.section === activeSection;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || t.tableNumber.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
      return matchesSection && matchesSearch && matchesStatus;
    });
  }, [tables, activeSection, search, statusFilter]);

  const pendingRequests = serviceRequests.filter((r) => r.status === "PENDING");
  const unreadPickupNotifs = notifications.filter((n) => !n.isRead && n.type === "PICKUP_READY");

  function setUrlParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params.toString()}`);
  }

  function handleTableClick(tableId: string) {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;
    const needsDrawer = table.status === "OCCUPIED" || table.status === "BILLING_PENDING";
    if (needsDrawer) {
      setDrawerTableId(table.id);
      setIsDrawerOpen(true);
    } else {
      setModalTableId(table.id);
      setModalTableNumber(table.tableNumber);
      setIsModalOpen(true);
    }
  }

  function handleOpenTransferModal(tableId: string) {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;
    setTransferSourceTable(table);
    setIsTransferModalOpen(true);
    setIsDrawerOpen(false);
  }

  function handleConfirmTableTransfer(sourceTableId: string, targetTableId: string, mode: "TRANSFER" | "MERGE") {
    transferMutation.mutate({ sourceTableId, targetTableId, mode });
    setIsTransferModalOpen(false);
  }

  function handleMarkTableCleaned(tableId: string) {
    showToast({ type: "success", title: "Table Cleaned", message: `Table marked as Available.` });
  }
  
  if (tablesLoading) {
    return <div className="p-6">Loading initial data...</div>;
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-white/10 backdrop-blur-lg p-6 shadow-md flex flex-col gap-5">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-primary">Waiter / Floor Captain Terminal</h1>
          <p className="text-sm text-text-secondary">Manage tables, track live KOT status, acknowledge customer call bells, and take orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsServiceRequestsOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs font-bold text-warning transition-all hover:bg-warning/20 active:scale-95">
            <Bell size={15} />
            <span>Service Requests</span>
            {pendingRequests.length > 0 && <span className="rounded-full bg-warning px-1.5 py-0.2 text-[10px] font-bold text-white">{pendingRequests.length}</span>}
          </button>
          <button onClick={() => { const occupied = tables.find((t) => t.status === "OCCUPIED"); if (occupied) handleOpenTransferModal(occupied.id); }} className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary transition-all hover:bg-primary/20 active:scale-95">
            <ArrowRightLeft size={15} />
            <span>Transfer / Merge Table</span>
          </button>
          <button onClick={toggleLanguage} className="flex items-center gap-1.5 rounded-lg border border-border bg-page px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary active:scale-95">
            <Languages size={15} />
            {language === "en" ? "हिन्दी" : "English"}
          </button>
        </div>
      </div>

      <WaiterReadyQueue />

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-xs">
        <div role="tablist" className="flex flex-wrap gap-1 rounded-lg border border-border bg-page p-1">
          {SECTION_TABS.map((section) => (
            <button key={section} role="tab" aria-selected={activeSection === section} onClick={() => setUrlParam("section", section === "All" ? "" : section)} className={["rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors duration-150", activeSection === section ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"].join(" ")}>
              {section}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-48">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-disabled" />
            <input type="text" value={search} onChange={(e) => setUrlParam("search", e.target.value)} placeholder="Search table #..." className="w-full rounded-md border border-border bg-input py-1.5 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-disabled focus:border-border-focus focus:outline-none" />
          </div>
          <div className="flex items-center gap-1">
            <Filter size={13} className="text-text-disabled" />
            <select value={statusFilter} onChange={(e) => setUrlParam("status", e.target.value === "ALL" ? "" : e.target.value)} className="rounded-md border border-border bg-input px-2.5 py-1.5 text-xs font-semibold text-text-primary focus:border-border-focus focus:outline-none">
              <option value="ALL">All Table Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="BILLING_PENDING">Billing Pending</option>
              <option value="RESERVED">Reserved</option>
            </select>
          </div>
          <div role="group" className="flex gap-1 rounded-lg border border-border bg-page p-1">
            <button onClick={() => setViewMode("grid")} className={["flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors duration-150", viewMode === "grid" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"].join(" ")}>
              <LayoutGrid size={14} />Grid
            </button>
            <button onClick={() => setViewMode("floor-map")} className={["flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors duration-150", viewMode === "floor-map" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"].join(" ")}>
              <Map size={14} />Floor Map
            </button>
          </div>
        </div>
      </div>

      <WaiterTableGrid tables={filteredTables} orders={orders} viewMode={viewMode} onTableClick={handleTableClick} onQrClick={(table: AppTable) => setQrTable(table)} onMarkCleaned={handleMarkTableCleaned} />

      <WaiterOrderModal tableId={modalTableId} tableNumber={modalTableNumber} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <WaiterTableActionsDrawer tableId={drawerTableId} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onAddItems={(tId: string) => { const table = tables.find((t) => t.id === tId); if (!table) return; setModalTableId(table.id); setModalTableNumber(table.tableNumber); setIsModalOpen(true); }} onViewQr={(table: AppTable) => setQrTable(table)} />
      <WaiterTableQrModal table={qrTable} isOpen={qrTable !== null} onClose={() => setQrTable(null)} />
      <WaiterTableTransferModal isOpen={isTransferModalOpen} sourceTable={transferSourceTable} tables={tables} onTransferConfirm={handleConfirmTableTransfer} onClose={() => setIsTransferModalOpen(false)} />
      <WaiterServiceRequestsDrawer isOpen={isServiceRequestsOpen} onClose={() => setIsServiceRequestsOpen(false)} />
    </div>
  );
}
