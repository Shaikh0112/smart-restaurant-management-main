import React from "react";
import { UtensilsCrossed } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface OrderItemDisplay {
  itemId: string;
  name: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  status: string;
}

interface CustomerOrderBillSummaryProps {
  orderItems: OrderItemDisplay[];
  subtotal: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
}

export function CustomerOrderBillSummary({
  orderItems,
  subtotal,
  cgst,
  sgst,
  grandTotal,
}: CustomerOrderBillSummaryProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <UtensilsCrossed size={18} className="text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Running Bill & Dishes ({orderItems.reduce((acc, i) => acc + i.qty, 0)})
          </h2>
        </div>
        <span className="text-[10px] font-bold text-success bg-success/10 px-2.5 py-0.5 rounded-full border border-success/30">
          Active Running Order
        </span>
      </div>

      {/* Itemized Dishes List */}
      <div className="flex flex-col divide-y divide-border/60">
        {orderItems.length === 0 ? (
          <p className="py-3 text-xs text-text-disabled text-center">No active items in order.</p>
        ) : (
          orderItems.map((item, idx) => (
            <div key={`${item.itemId}-${idx}`} className="flex items-center justify-between py-3">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-text-primary">{item.name}</span>
                  <span className="rounded-md bg-page border border-border px-2 py-0.5 text-[11px] font-extrabold text-primary">
                    ×{item.qty}
                  </span>
                </div>

                {item.notes && (
                  <span className="text-[11px] italic text-warning">
                    Note: {item.notes}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-text-primary font-mono">
                  {formatCurrency(item.totalPrice)}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  item.status === "READY"
                    ? "bg-success/20 text-success border border-success/30"
                    : item.status === "SERVED"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-warning/20 text-warning border border-warning/30"
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Estimated Tax & Grand Total Summary */}
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-page p-3.5 mt-2 text-xs">
        <div className="flex justify-between text-text-secondary">
          <span>Items Subtotal:</span>
          <span className="font-mono font-semibold text-text-primary">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Taxes & Fees:</span>
          <span className="font-mono text-text-primary">{formatCurrency(cgst + sgst)}</span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between items-center">
          <span className="font-bold text-text-primary text-sm">Estimated Total Bill:</span>
          <span className="font-mono font-extrabold text-base text-success">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
