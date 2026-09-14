// RESPONSIBILITY: Handles the payment simulation securely via backend mutation.
"use client";

import { useState } from "react";
import { CreditCard, Wallet, MapPin, X } from "lucide-react";
import { useSimulatePaymentMutation } from "@/app/waiter/waiter_hooks/useWaiterMutations";
import { showToast } from "@/lib/toastService";

interface WaiterPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: (transactionId: string) => void;
}

export function WaiterPaymentModal({ isOpen, onClose, amount, onSuccess }: WaiterPaymentModalProps) {
  const paymentMutation = useSimulatePaymentMutation();
  const [method, setMethod] = useState<"UPI" | "CARD" | "CASH">("UPI");

  if (!isOpen) return null;

  function handlePay() {
    paymentMutation.mutate({ amount, method }, {
      onSuccess: (res) => {
        showToast({ type: "success", title: "Payment Successful", message: "Transaction completed." });
        onSuccess(res.data.transactionId);
      },
      onError: () => {
        showToast({ type: "error", title: "Payment Failed", message: "Could not process payment." });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-bold text-text-primary">Complete Payment</h2>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-surface-hover active:scale-95">
            <X size={18} className="text-text-secondary" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center rounded-lg bg-primary/10 py-6">
            <span className="text-sm font-semibold text-text-secondary">Amount to Pay</span>
            <span className="text-3xl font-extrabold text-primary">₹{amount}</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setMethod("UPI")}
              className={[`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors`, method === "UPI" ? "border-primary bg-primary/10 text-primary" : "border-border text-text-secondary hover:border-text-disabled"].join(" ")}
            >
              <MapPin size={18} />
              <span className="text-xs font-bold">UPI</span>
            </button>
            <button
              onClick={() => setMethod("CARD")}
              className={[`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors`, method === "CARD" ? "border-primary bg-primary/10 text-primary" : "border-border text-text-secondary hover:border-text-disabled"].join(" ")}
            >
              <CreditCard size={18} />
              <span className="text-xs font-bold">Card</span>
            </button>
            <button
              onClick={() => setMethod("CASH")}
              className={[`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors`, method === "CASH" ? "border-primary bg-primary/10 text-primary" : "border-border text-text-secondary hover:border-text-disabled"].join(" ")}
            >
              <Wallet size={18} />
              <span className="text-xs font-bold">Cash</span>
            </button>
          </div>
        </div>

        <div className="border-t border-border p-4">
          <button
            onClick={handlePay}
            disabled={paymentMutation.isPending}
            className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-50 active:scale-95"
          >
            {paymentMutation.isPending ? "Processing..." : `Pay ₹${amount}`}
          </button>
        </div>
      </div>
    </div>
  );
}
