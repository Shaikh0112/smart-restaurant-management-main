import React from "react";
import { CreditCard, X, ArrowRight } from "lucide-react";

interface ManagerSubscriptionModalProps {
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  txnRefInput: string;
  setTxnRefInput: (val: string) => void;
  handlePaySubscription: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function ManagerSubscriptionModal({
  isPaymentModalOpen,
  setIsPaymentModalOpen,
  txnRefInput,
  setTxnRefInput,
  handlePaySubscription,
  isSubmitting,
}: ManagerSubscriptionModalProps) {
  if (!isPaymentModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-background/60 backdrop-blur-md border border-border/50 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
          <div className="flex items-center gap-2 text-emerald-500 font-bold">
            <CreditCard size={20} />
            <span>Subscription Payment Gateway</span>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="text-text-muted hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 mb-4">
          <p className="text-xs text-text-muted">Approved SaaS POS License</p>
          <p className="font-black text-xl text-emerald-500">₹2,999 / Year</p>
        </div>

        <form onSubmit={handlePaySubscription} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary">
              Transaction Reference / UTR Number
            </label>
            <input
              type="text"
              value={txnRefInput}
              onChange={(e) => setTxnRefInput(e.target.value)}
              placeholder="e.g. TXN987654321"
              className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-black text-xs text-white shadow-lg hover:bg-emerald-600 active:scale-95 transition-all"
          >
            <span>Submit Subscription Payment (₹2,999)</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
