// @ts-nocheck
"use client";

// RESPONSIBILITY: Order confirmation & running bill tracking view for customer QR self-ordering.
// Displays order status step-pipeline, live KOT cooking progress, itemized dish list with individual statuses,
// running bill subtotal & taxes, front-and-center 1-tap table call bells (Water, Bill, Waiter, Cleaning),
// and "+ Add More Items to Table Bill" launcher.
// DATA FLOW: order + menu → CustomerOrderStatus → createServiceRequest + CustomerBillRequestModal → UI

import { useState, useMemo } from "react";
import { ThemeToggle } from "@/components/Theme/ThemeToggle";
import { useAuth } from "@/app/auth/auth_hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Plus,
  UtensilsCrossed,
  Droplets,
  Receipt,
  Bell,
  Sparkles,
  ChevronRight,
  Flame,
  ChefHat,
  LogOut,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import { createServiceRequest } from "../customer_utils/customer_serviceRequestService";
import { showToast } from "@/lib/toastService";
import { formatCurrency } from "@/lib/formatters";
import { CustomerBillRequestModal } from "./CustomerBillRequestModal";
import { CustomerOrderBillSummary } from "./CustomerOrderBillSummary";
import { CopyableId } from "./CopyableId";
import type { AppOrder, AppMenuItem, ServiceRequestType } from "@/types/appTypes";
import type { CustomerOrderStatusProps } from "@/app/customer/customer_types/CustomerTypes";

export function CustomerOrderStatus({
  order,
  tableNumber,
  onOrderMore,
}: CustomerOrderStatusProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const [menu] = useLocalStorage<AppMenuItem[]>(STORAGE_KEYS.MENU, []);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [serviceSuccessMsg, setServiceSuccessMsg] = useState<string | null>(null);

  // Map menu item lookup
  const menuMap = useMemo(
    () => new Map(menu.map((m) => [m.id, m])),
    [menu]
  );

  // Group all KOT items across all KOTs for order summary
  const { orderItems, subtotal, cgst, sgst, grandTotal } = useMemo(() => {
    const map = new Map<string, { itemId: string; name: string; qty: number; unitPrice: number; totalPrice: number; notes?: string; status: string }>();
    let sub = 0;

    for (const kot of order.kots) {
      for (const item of kot.items) {
        if (item.status === "VOIDED") continue;
        const menuItem = menuMap.get(item.itemId);
        const name = menuItem?.name ?? item.itemId;
        const unitPrice = menuItem?.price ?? 0;
        const itemTotal = unitPrice * item.qty;
        sub += itemTotal;

        const key = `${item.itemId}||${item.notes || ""}||${item.status}`;
        const existing = map.get(key);

        if (existing) {
          existing.qty += item.qty;
          existing.totalPrice += itemTotal;
        } else {
          map.set(key, {
            itemId: item.itemId,
            name,
            qty: item.qty,
            unitPrice,
            totalPrice: itemTotal,
            notes: item.notes,
            status: item.status,
          });
        }
      }
    }

    const itemsList = Array.from(map.values());
    
    // Taxes should theoretically come from backend. Mocking them for now based on subtotal.
    const taxCgst = order.taxes?.cgst ?? (sub * 0.025);
    const taxSgst = order.taxes?.sgst ?? (sub * 0.025);
    const total = order.totalAmount ?? Math.round(sub + taxCgst + taxSgst);

    return {
      orderItems: itemsList,
      subtotal: sub,
      cgst: taxCgst,
      sgst: taxSgst,
      grandTotal: total,
    };
  }, [order, menuMap]);

  // Overall order progress stage
  const overallStage = useMemo(() => {
    if (orderItems.length === 0) return "PLACED";
    const allServed = orderItems.every((i) => i.status === "SERVED");
    const anyReady = orderItems.some((i) => i.status === "READY");
    const anyCooking = orderItems.some((i) => i.status === "COOKING" || i.status === "PREPARING");

    if (allServed) return "SERVED";
    if (anyReady) return "READY";
    if (anyCooking) return "COOKING";
    return "PLACED";
  }, [orderItems]);

  function handleQuickServiceRequest(type: ServiceRequestType, label: string) {
    if (type === "BILL") {
      setIsBillModalOpen(true);
      return;
    }

    const res = createServiceRequest({
      tableId: tableNumber,
      tableNumber,
      type,
    });

    if (!res.success) {
      showToast({
        type: "warning",
        message: res.message || `${label} request already pending.`,
      });
      return;
    }

    setServiceSuccessMsg(`${label} Request Sent to Floor Waiter!`);
    setTimeout(() => setServiceSuccessMsg(null), 3000);
  }

  return (
    <div className="flex flex-col gap-5 py-4 max-w-lg mx-auto pb-24 animate-in fade-in duration-300">
      {/* Top Header & Restaurant Branding Bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/30">
            <UtensilsCrossed size={18} />
          </div>
          <h1 className="font-extrabold text-sm text-text-primary tracking-tight">
            Royal Spice Bistro
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => { logout(); router.push("/auth/login"); }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Order Confirmed Hero Banner */}
      <div className="relative flex flex-col items-center justify-center gap-3 rounded-3xl border border-success/40 bg-gradient-to-b from-success/15 to-success/5 p-6 text-center shadow-lg overflow-hidden">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white shadow-xl ring-4 ring-success/20 animate-in zoom-in duration-300">
          <CheckCircle2 size={18} />
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Order Placed & Confirmed!</h1>
          <p className="text-xs text-text-secondary">
            Kitchen & Waiter Terminal notified for Table{" "}
            <span className="font-extrabold text-success text-sm">{tableNumber}</span>
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 text-[11px] font-mono text-text-disabled">
            <CopyableId id={order.id} label="Order ID" />
            <span>&bull;</span>
            <span>{order.kots.length} KOT Ticket{order.kots.length > 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {/* Live Cooking Progress Step Pipeline */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
          <Flame size={18} className="text-warning animate-pulse" />
          <span>Live Cooking Status Tracker</span>
        </h3>

        <div className="grid grid-cols-4 gap-1 text-center pt-2">
          {/* Step 1: Placed */}
          <div className="flex flex-col items-center gap-1">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              overallStage === "PLACED" || overallStage === "COOKING" || overallStage === "READY" || overallStage === "SERVED"
                ? "bg-success text-white ring-2 ring-success/30"
                : "bg-page text-text-disabled"
            }`}>
              1
            </div>
            <span className="text-[10px] font-bold text-text-primary">Order Placed</span>
          </div>

          {/* Step 2: Cooking */}
          <div className="flex flex-col items-center gap-1">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              overallStage === "COOKING" || overallStage === "READY" || overallStage === "SERVED"
                ? "bg-warning text-white ring-2 ring-warning/30 animate-pulse"
                : "bg-page text-text-disabled"
            }`}>
              2
            </div>
            <span className="text-[10px] font-bold text-text-primary">Cooking</span>
          </div>

          {/* Step 3: Ready */}
          <div className="flex flex-col items-center gap-1">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              overallStage === "READY" || overallStage === "SERVED"
                ? "bg-success text-white ring-2 ring-success/30"
                : "bg-page text-text-disabled"
            }`}>
              3
            </div>
            <span className="text-[10px] font-bold text-text-primary">Ready</span>
          </div>

          {/* Step 4: Served */}
          <div className="flex flex-col items-center gap-1">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              overallStage === "SERVED"
                ? "bg-primary text-white ring-2 ring-primary/30"
                : "bg-page text-text-disabled"
            }`}>
              4
            </div>
            <span className="text-[10px] font-bold text-text-primary">Served</span>
          </div>
        </div>
      </div>

      {/* Front-and-Center Quick Table Services (Prominent 1-Tap Action Grid) */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Quick Table Call Bells (1-Tap Call)
          </h2>
          <span className="text-[10px] text-text-disabled font-bold bg-page px-2 py-0.5 rounded-full border border-border">
            Table {tableNumber}
          </span>
        </div>

        {serviceSuccessMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-success/15 border border-success/30 p-3 text-xs font-bold text-success animate-in fade-in">
            <CheckCircle2 size={18} />
            <span>{serviceSuccessMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <button
            onClick={() => handleQuickServiceRequest("WATER", "Water")}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-page p-3.5 hover:border-info/40 hover:bg-info/10 transition-all text-center group active:scale-95 shadow-xs"
          >
            <Droplets className="h-6 w-6 text-info group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-text-primary">Water </span>
          </button>

          <button
            onClick={() => handleQuickServiceRequest("BILL", "Bill")}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-success/40 bg-success/10 p-3.5 hover:bg-success/20 transition-all text-center group active:scale-95 shadow-xs ring-2 ring-success/20"
          >
            <Receipt className="h-6 w-6 text-success group-hover:scale-110 transition-transform" />
            <span className="font-extrabold text-xs text-success-hover">Request Bill </span>
          </button>

          <button
            onClick={() => handleQuickServiceRequest("WAITER_CALL", "Waiter")}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-page p-3.5 hover:border-warning/40 hover:bg-warning/10 transition-all text-center group active:scale-95 shadow-xs"
          >
            <Bell className="h-6 w-6 text-warning group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-text-primary">Call Waiter </span>
          </button>

          <button
            onClick={() => handleQuickServiceRequest("CLEANING", "Table Cleaning")}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-page p-3.5 hover:border-primary/40 hover:bg-primary/10 transition-all text-center group active:scale-95 shadow-xs"
          >
            <Sparkles className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-text-primary">Cleaning </span>
          </button>
        </div>
      </div>

      {/* Estimated Time Card */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning">
          <Clock size={18} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-primary">Target Prep Estimate:</span>
            <span className="rounded-md bg-warning/20 px-2 py-0.5 text-xs font-black text-warning">
              15–20 Mins
            </span>
          </div>
          <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
            Your waiter will serve your dishes fresh to Table {tableNumber} as soon as ready!
          </p>
        </div>
      </div>

      {/* Itemized Order & Running Bill Breakdown */}
      <CustomerOrderBillSummary
        orderItems={orderItems}
        subtotal={subtotal}
        cgst={cgst}
        sgst={sgst}
        grandTotal={grandTotal}
      />

      {/* Prominent Action Button: Add More Items / Back to Menu */}
      <div className="flex flex-col gap-2.5">
        {onOrderMore && (
          <button
            onClick={onOrderMore}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-sm font-extrabold text-white shadow-lg transition-all hover:bg-primary-hover active:scale-98"
          >
            <Plus size={18} />
            <span>+ Add More Items to Table Bill</span>
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Request Bill Modal */}
      <CustomerBillRequestModal
        isOpen={isBillModalOpen}
        tableId={tableNumber}
        tableNumber={tableNumber}
        onClose={() => setIsBillModalOpen(false)}
        onSuccess={() => setServiceSuccessMsg("Bill Request Sent to Cashier!")}
      />
    </div>
  );
}
