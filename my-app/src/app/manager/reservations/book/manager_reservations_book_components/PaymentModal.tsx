import React from 'react';
import { CreditCard, X, Smartphone, ArrowRight } from 'lucide-react';

interface PaymentModalProps {
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (val: boolean) => void;
  guestCount: number;
  totalAdvanceDeposit: number;
  handlePayAdvanceDeposit: (e: React.FormEvent) => void;
}

export function PaymentModal({
  isPaymentModalOpen,
  setIsPaymentModalOpen,
  guestCount,
  totalAdvanceDeposit,
  handlePayAdvanceDeposit
}: PaymentModalProps) {
  if (!isPaymentModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
          <div className="flex items-center gap-2 text-emerald-500 font-bold">
            <CreditCard size={20} />
            <span>Advance Deposit Payment Gateway</span>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="text-text-muted hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 mb-4">
          <p className="text-xs text-text-muted">Table Deposit ({guestCount} Guests)</p>
          <p className="font-black text-xl text-emerald-500">₹{totalAdvanceDeposit}</p>
        </div>

        <form onSubmit={handlePayAdvanceDeposit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl border border-emerald-500 bg-emerald-500/10 text-emerald-500 text-xs font-bold flex items-center gap-2">
              <Smartphone size={16} /> PhonePe / UPI
            </div>
            <div className="p-3 rounded-xl border border-border bg-input text-text-secondary text-xs font-bold flex items-center gap-2">
              <CreditCard size={16} /> Card / NetBanking
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-black text-xs text-white shadow-lg hover:bg-emerald-600 active:scale-95 transition-all"
          >
            <span>Complete ₹{totalAdvanceDeposit} Deposit Payment</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
