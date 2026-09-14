import React from 'react';
import { Calendar, Clock, Users, CreditCard } from 'lucide-react';

interface ReservationFormProps {
  bookingDate: string;
  setBookingDate: (val: string) => void;
  bookingTime: string;
  setBookingTime: (val: string) => void;
  guestCount: number;
  setGuestCount: (val: number) => void;
  customerName: string;
  setCustomerName: (val: string) => void;
  customerPhone: string;
  setCustomerPhone: (val: string) => void;
  customerEmail: string;
  setCustomerEmail: (val: string) => void;
  totalAdvanceDeposit: number;
  advanceRatePerPerson: number;
  setIsPaymentModalOpen: (val: boolean) => void;
}

export function ReservationForm({
  bookingDate, setBookingDate,
  bookingTime, setBookingTime,
  guestCount, setGuestCount,
  customerName, setCustomerName,
  customerPhone, setCustomerPhone,
  customerEmail, setCustomerEmail,
  totalAdvanceDeposit, advanceRatePerPerson,
  setIsPaymentModalOpen
}: ReservationFormProps) {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xl flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div>
          <h2 className="font-black text-lg text-text-primary">
            1. Reserve Table & Deposit
          </h2>
          <p className="text-xs text-text-secondary">
            Guaranteed dining table arrangement + zero waiting time
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-500">
          ₹{advanceRatePerPerson} / Guest Deposit
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-xs font-extrabold text-text-secondary">
            Booking Date
          </label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-input py-2.5 pl-9 pr-3 text-xs text-text-primary focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-extrabold text-text-secondary">
            Time Slot
          </label>
          <div className="relative">
            <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="time"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              className="w-full rounded-xl border border-border bg-input py-2.5 pl-9 pr-3 text-xs text-text-primary focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-extrabold text-text-secondary">
            Number of Guests (Persons)
          </label>
          <div className="relative">
            <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="number"
              min={1}
              max={30}
              value={guestCount}
              onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-xl border border-border bg-input py-2.5 pl-9 pr-3 text-xs text-text-primary focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Saved Profile Customer Details */}
      <div className="rounded-2xl border border-border/60 bg-surface/50 p-4 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
          Saved Guest Profile Contact Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-text-muted block mb-0.5">Guest Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-xl border border-border bg-card p-2 text-xs text-text-primary"
            />
          </div>
          <div>
            <label className="text-[11px] text-text-muted block mb-0.5">Phone Number</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full rounded-xl border border-border bg-card p-2 text-xs text-text-primary"
            />
          </div>
          <div>
            <label className="text-[11px] text-text-muted block mb-0.5">Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-card p-2 text-xs text-text-primary"
            />
          </div>
        </div>
      </div>

      {/* Advance Deposit Summary Card */}
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs text-text-muted">Calculated Advance Deposit</p>
          <p className="font-black text-2xl text-emerald-500">
            ₹{totalAdvanceDeposit}{" "}
            <span className="text-xs font-bold text-text-secondary">
              ({guestCount} Persons × ₹{advanceRatePerPerson})
            </span>
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            100% adjusted against your final food bill at table checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPaymentModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 font-black text-xs text-white shadow-xl hover:bg-emerald-600 active:scale-95 transition-all w-full sm:w-auto justify-center"
        >
          <CreditCard size={16} />
          <span>Pay ₹{totalAdvanceDeposit} Deposit & Book</span>
        </button>
      </div>
    </div>
  );
}
