"use client";
// @ts-nocheck

// RESPONSIBILITY: Modal allowing Cashier to split a table's bill equally (N guests) or itemized per person.
// DATA FLOW: cashier/page.tsx â†’ CashierGuestSplitModal â†’ UI

import { useState } from "react";
import { X, Users, Split, Printer, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import type { CashierCartItem, CashierTaxBreakdown } from "@/app/cashier/cashier_types/CashierTypes";
import { useGuestSplit } from "../cashier_hooks/useGuestSplit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const guestSplitSchema = z.object({
  guestCount: z.number().min(2, "Minimum 2 guests").max(50, "Maximum 50 guests"),
});

type GuestSplitFormValues = z.infer<typeof guestSplitSchema>;

interface CashierGuestSplitModalProps {
  isOpen: boolean;
  tableNumber: string;
  cartItems: CashierCartItem[];
  taxBreakdown: CashierTaxBreakdown;
  onClose: () => void;
}

export function CashierGuestSplitModal({
  isOpen,
  tableNumber,
  cartItems,
  taxBreakdown,
  onClose,
}: CashierGuestSplitModalProps) {
  const {
    splitMode,
    setSplitMode,
    guestCount,
    setGuestCount,
    paidGuests,
    toggleGuestPaid,
    equalPerGuest,
    isFullyPaid
  } = useGuestSplit(cartItems, taxBreakdown);

  const [confirming, setConfirming] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<GuestSplitFormValues>({
    resolver: zodResolver(guestSplitSchema),
    defaultValues: {
      guestCount: 2,
    },
  });

  if (!isOpen) return null;

  const handleGuestCountChange = (val: number) => {
    setValue("guestCount", val, { shouldValidate: true });
    setGuestCount(val);
  };

  const onSubmit = (data: GuestSplitFormValues) => {
    if (splitMode === "EQUAL" && !isFullyPaid) {
      alert("Please collect payment from all guests first.");
      return;
    }
    setConfirming(true);
  };

  const handleConfirm = () => {
    setConfirming(false);
    onClose();
  };


  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Split Bill per Guest"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl motion-safe:transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Split size={18} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Split Bill â€” Table {tableNumber}</h2>
              <p className="text-xs text-text-secondary">Divide payment equally or itemized per guest</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-page hover:text-text-primary motion-safe:transition-colors"
          >
            <X size={18} strokeWidth={2} />
          </button>        {confirming ? (
          <div className="mt-5 flex flex-col gap-5 text-center">
             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success">
                <CheckCircle2 size={18} strokeWidth={2} />
             </div>
             <h3 className="text-xl font-bold text-text-primary">Confirm Split Payment</h3>
             <p className="text-sm text-text-secondary">
               All shares have been settled. Are you sure you want to finalize this split transaction?
             </p>
             <div className="flex items-center justify-center gap-3 mt-4">
               <button
                 onClick={() => setConfirming(false)}
                 className="rounded-lg border border-border px-4 py-2 font-bold text-text-primary hover:bg-surface"
               >
                 Cancel
               </button>
               <button
                 onClick={handleConfirm}
                 className="rounded-lg bg-primary px-6 py-2 font-bold text-white hover:bg-primary-hover"
               >
                 Finalize Payment
               </button>
             </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-5 text-xs">
          {/* Mode Switcher */}
          <div className="flex rounded-xl border border-border bg-page p-1">
            <button
              type="button"
              onClick={() => setSplitMode("EQUAL")}
              className={[
                "flex-1 rounded-lg py-2 font-bold motion-safe:transition-all text-xs flex items-center justify-center gap-1.5",
                splitMode === "EQUAL" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              <Users size={18} strokeWidth={2} /> Equal N-Way Split
            </button>
            <button
              type="button"
              onClick={() => setSplitMode("ITEMIZED")}
              className={[
                "flex-1 rounded-lg py-2 font-bold motion-safe:transition-all text-xs flex items-center justify-center gap-1.5",
                splitMode === "ITEMIZED" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              <Split size={18} strokeWidth={2} /> Itemized Guest Split
            </button>
          </div>

          {/* EQUAL SPLIT MODE */}
          {splitMode === "EQUAL" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                <span className="font-bold text-text-primary">Number of Guests Sharing:</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleGuestCountChange(Math.max(2, guestCount - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card font-extrabold text-text-primary hover:bg-surface-hover"
                  >
                    -
                  </button>
                  <input type="number"
                    {...register("guestCount", { valueAsNumber: true })}
                    className="w-12 bg-transparent text-center text-base font-extrabold text-primary outline-hidden"
                    readOnly
                  onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault(); }}
                />
                  <button
                    type="button"
                    onClick={() => handleGuestCountChange(Math.min(50, guestCount + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card font-extrabold text-text-primary hover:bg-surface-hover"
                  >
                    +
                  </button>
                </div>
              </div>
              {errors.guestCount && (
                <p className="text-destructive text-xs">{errors.guestCount.message}</p>
              )}

              {/* Guest Shares List */}
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {Array.from({ length: guestCount }).map((_, idx) => {
                  const isPaid = !!paidGuests[idx];
                  return (
                    <div
                      key={idx}
                      className={[
                        "flex items-center justify-between rounded-xl border p-3 motion-safe:transition-colors",
                        isPaid ? "border-success/40 bg-success-bg/20" : "border-border/60 bg-surface",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-primary">Guest #{idx + 1}</span>
                        {isPaid && <span className="text-xs font-bold text-success uppercase">PAID</span>}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-text-primary text-sm">
                          {formatCurrency(equalPerGuest)}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleGuestPaid(idx)}
                          className={[
                            "rounded-lg px-2.5 py-1 font-bold text-xs border motion-safe:transition-colors",
                            isPaid
                              ? "bg-success text-white border-success"
                              : "border-border bg-card text-text-secondary hover:text-text-primary",
                          ].join(" ")}
                        >
                          {isPaid ? "Paid " : "Mark Paid"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ITEMIZED SPLIT MODE */}
          {splitMode === "ITEMIZED" && (
            <div className="flex flex-col gap-3">
              <p className="text-text-secondary text-xs">
                Items assigned to individual table guests. Total Bill: <strong className="text-text-primary">{formatCurrency(taxBreakdown.totalAmount)}</strong>
              </p>
              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.itemId} className="flex items-center justify-between rounded-lg border border-border/50 bg-surface p-2.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-text-primary">{item.name} × {item.qty}</span>
                      <span className="text-xs text-text-secondary">{formatCurrency(item.totalPrice)}</span>
                    </div>
                    <span className="rounded bg-page px-2 py-1 text-xs font-semibold text-text-secondary">
                      Guest #1
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
            <div className="flex flex-col">
              <span className="text-xs text-text-secondary uppercase">Total Bill</span>
              <span className="text-base font-extrabold text-text-primary">{formatCurrency(taxBreakdown.totalAmount)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-page px-3 py-2 font-bold text-text-primary hover:bg-surface motion-safe:transition-colors"
              >
                <Printer size={18} strokeWidth={2} /> Print Guest Receipts
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 font-bold text-white hover:bg-primary-hover motion-safe:transition-colors"
              >
                Done Splitting
              </button>
            </div>
          </div>
        </form>
        )}
      </div>
      </div>
    </div>
  );
}
