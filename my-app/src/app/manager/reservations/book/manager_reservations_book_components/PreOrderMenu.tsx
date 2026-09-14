import React from 'react';
import { CheckCircle2, ArrowRight, Sparkles, Plus } from 'lucide-react';
import type {  AppMenuItem, AppPreOrderItem  } from "@/types/appTypes";

interface PreOrderMenuProps {
  paymentTxnId: string;
  bookingDate: string;
  bookingTime: string;
  guestCount: number;
  setStep: (val: number) => void;
  menuItems: AppMenuItem[];
  preOrders: AppPreOrderItem[];
  handleAddPreOrderItem: (item: AppMenuItem) => void;
  handleUpdatePreOrderQty: (itemId: string, delta: number) => void;
}

export function PreOrderMenu({
  paymentTxnId,
  bookingDate,
  bookingTime,
  guestCount,
  setStep,
  menuItems,
  preOrders,
  handleAddPreOrderItem,
  handleUpdatePreOrderQty
}: PreOrderMenuProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
          <div>
            <h3 className="font-extrabold text-sm text-text-primary">
              Advance Table Reserved! (Txn ID: {paymentTxnId})
            </h3>
            <p className="text-xs text-text-secondary">
              Date: {bookingDate} at {bookingTime} · {guestCount} Persons
            </p>
          </div>
        </div>
        <button
          onClick={() => setStep(3)}
          className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-white shadow-md"
        >
          <span>Confirm & Done</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Zero-Wait Pre-Ordering Menu */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500 fill-amber-500 animate-pulse" />
            <h2 className="font-black text-base text-text-primary">
              2. Zero-Wait Pre-Order Dishes (Optional)
            </h2>
          </div>
          <span className="text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
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
                  <p className="text-[11px] font-black text-emerald-500 mt-0.5">₹{item.price}</p>
                </div>

                {qty === 0 ? (
                  <button
                    onClick={() => handleAddPreOrderItem(item)}
                    className="flex items-center gap-1 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-extrabold text-emerald-500 hover:bg-emerald-500 hover:text-white"
                  >
                    <Plus size={13} />
                    <span>ADD</span>
                  </button>
                ) : (
                  <div className="flex items-center rounded-xl border border-emerald-500/50 bg-emerald-500/15 p-0.5">
                    <button
                      onClick={() => handleUpdatePreOrderQty(item.id, -1)}
                      className="h-6 w-6 rounded-lg bg-surface text-emerald-500 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="px-2 font-black text-xs text-text-primary">{qty}</span>
                    <button
                      onClick={() => handleUpdatePreOrderQty(item.id, 1)}
                      className="h-6 w-6 rounded-lg bg-emerald-500 text-white font-bold text-xs"
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
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-500 p-4 text-white shadow-xl">
            <div>
              <p className="text-xs font-medium">Pre-Ordered Items ({preOrders.length})</p>
              <p className="font-black text-base">
                Subtotal: ₹{preOrders.reduce((s, p) => s + p.unitPrice * p.qty, 0)}
              </p>
            </div>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-1 rounded-xl bg-white/20 px-4 py-2 text-xs font-extrabold text-white"
            >
              <span>Finalize Booking</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
