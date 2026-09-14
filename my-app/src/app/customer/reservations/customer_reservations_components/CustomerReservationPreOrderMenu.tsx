import React from "react";
import { CheckCircle2, Sparkles, ArrowRight, Plus } from "lucide-react";
import type { AppMenuItem, AppPreOrderItem } from "@/types/appTypes";
import { CopyableId } from "../../customer_components/CopyableId";

interface CustomerReservationPreOrderMenuProps {
  paymentTxnId: string;
  bookingDate: string;
  bookingTime: string;
  guestCount: number;
  menuItems: AppMenuItem[];
  preOrders: AppPreOrderItem[];
  onAddPreOrderItem: (item: AppMenuItem) => void;
  onUpdatePreOrderQty: (itemId: string, delta: number) => void;
  onFinalize: () => void;
}

export function CustomerReservationPreOrderMenu({
  paymentTxnId,
  bookingDate,
  bookingTime,
  guestCount,
  menuItems,
  preOrders,
  onAddPreOrderItem,
  onUpdatePreOrderQty,
  onFinalize,
}: CustomerReservationPreOrderMenuProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-success/40 bg-success/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={24} className="text-success shrink-0" />
          <div>
            <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-2">
              Advance Table Reserved! <CopyableId id={paymentTxnId} label="Txn ID" />
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Date: {bookingDate} at {bookingTime} · {guestCount} Persons
            </p>
          </div>
        </div>
        <button
          onClick={onFinalize}
          className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-white shadow-md"
        >
          <span>Confirm & Done</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Zero-Wait Pre-Ordering Menu */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-warning fill-warning animate-pulse" />
            <h2 className="font-black text-base text-text-primary">
              2. Zero-Wait Pre-Order Dishes (Optional)
            </h2>
          </div>
          <span className="text-xs font-bold text-warning bg-warning/10 border border-warning/30 px-3 py-1 rounded-full">
            Dishes will be ready upon arrival
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {menuItems.map((item) => {
            const pre = preOrders.find((p) => p.itemId === item.id);
            const qty = pre ? pre.qty : 0;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-border/70 bg-surface/50"
              >
                <div>
                  <h4 className="font-bold text-xs text-text-primary">{item.name}</h4>
                  <p className="text-[11px] font-black text-success mt-0.5">₹{item.price}</p>
                </div>

                {qty === 0 ? (
                  <button
                    onClick={() => onAddPreOrderItem(item)}
                    className="flex items-center gap-1 rounded-xl border border-success/40 bg-success/10 px-3 py-1.5 text-xs font-extrabold text-success hover:bg-success hover:text-white"
                  >
                    <Plus size={18} />
                    <span>ADD</span>
                  </button>
                ) : (
                  <div className="flex items-center rounded-xl border border-success/50 bg-success/15 p-0.5">
                    <button
                      onClick={() => onUpdatePreOrderQty(item.id, -1)}
                      className="h-6 w-6 rounded-lg bg-surface text-success font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="px-2 font-black text-xs text-text-primary">{qty}</span>
                    <button
                      onClick={() => onUpdatePreOrderQty(item.id, 1)}
                      className="h-6 w-6 rounded-lg bg-success text-white font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pre-Order Summary Bar */}
        {preOrders.length > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-success p-4 text-white shadow-xl">
            <div>
              <p className="text-xs font-medium">Pre-Ordered Items ({preOrders.length})</p>
              <p className="font-black text-base">
                Subtotal: ₹{preOrders.reduce((s, p) => s + p.unitPrice * p.qty, 0)}
              </p>
            </div>
            <button
              onClick={onFinalize}
              className="flex items-center gap-1 rounded-xl bg-white/20 px-4 py-2 text-xs font-extrabold text-white"
            >
              <span>Finalize Booking</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
