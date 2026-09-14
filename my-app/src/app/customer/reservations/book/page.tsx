// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { UtensilsCrossed, User } from "lucide-react";

import { getTenantById, getActiveTenants, createAdvanceReservation } from "@/lib/tenantService";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/app/auth/auth_hooks/useAuth";
import type { AppMenuItem, AppTenant, AppPreOrderItem } from "@/types/appTypes";
import { CustomerReservationBookingForm } from "../customer_reservations_components/CustomerReservationBookingForm";
import { CustomerReservationPreOrderMenu } from "../customer_reservations_components/CustomerReservationPreOrderMenu";
import { CustomerReservationPaymentModal } from "../customer_reservations_components/CustomerReservationPaymentModal";

export const dynamic = 'force-dynamic';

const ADVANCE_RATE_PER_PERSON = 100 as const;

function AdvanceReservationBookingPageContent() {
  const searchParams = useSearchParams();
  const tenantIdParam = searchParams.get("tenant") || "tenant-royal-spice-01";

  const { currentUser, isHydrated } = useAuth();

  const [tenant, setTenant] = useState<AppTenant | null>(null);
  const [menuItems] = useLocalStorage<AppMenuItem[]>(STORAGE_KEYS.MENU, []);

  // Form State
  const [bookingDate, setBookingDate] = useState<string>("2026-08-16");
  const [bookingTime, setBookingTime] = useState<string>("19:30");
  const [guestCount, setGuestCount] = useState<number>(4);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");

  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name);
      setCustomerPhone(currentUser.phone || "");
      setCustomerEmail(currentUser.email || "");
    }
  }, [currentUser]);

  // Booking Flow Steps: 1 = Form & Payment, 2 = Pre-Order Menu, 3 = Confirmation
  const [step, setStep] = useState<number>(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentTxnId, setPaymentTxnId] = useState<string>("");
  const [preOrders, setPreOrders] = useState<AppPreOrderItem[]>([]);
  const [reservationId, setReservationId] = useState<string>("");

  useEffect(() => {
    const found = getTenantById(tenantIdParam);
    if (found) {
      setTenant(found);
    } else {
      const active = getActiveTenants();
      if (active.length > 0) setTenant(active[0]);
    }
  }, [tenantIdParam]);

  const totalAdvanceDeposit = useMemo(() => guestCount * ADVANCE_RATE_PER_PERSON, [guestCount]);

  const handlePayAdvanceDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const txnId = `TXN_RES_${Date.now().toString().slice(-6)}`;
    setPaymentTxnId(txnId);
    setIsPaymentModalOpen(false);

    // Save initial reservation
    const res = createAdvanceReservation({
      tenantId: tenant?.tenantId || tenantIdParam,
      customerName,
      customerPhone,
      customerEmail,
      guestCount,
      perPersonAdvance: ADVANCE_RATE_PER_PERSON,
      totalAdvanceDeposit,
      bookingDate,
      bookingTime,
      paymentStatus: "PENDING",
      paymentTxnId: txnId,
      preOrderItems: [],
      status: "PENDING",
    });

    setReservationId(res.id);
    setStep(2); // Proceed to Zero-Wait Pre-Ordering
  };

  const handleAddPreOrderItem = (item: AppMenuItem) => {
    setPreOrders((prev) => {
      const existing = prev.find((p) => p.itemId === item.id);
      if (existing) {
        return prev.map((p) => (p.itemId === item.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { itemId: item.id, name: item.name, qty: 1, unitPrice: item.price }];
    });
  };

  const handleUpdatePreOrderQty = (itemId: string, delta: number) => {
    setPreOrders((prev) => {
      return prev
        .map((p) => {
          if (p.itemId === itemId) {
            const nextQty = p.qty + delta;
            return nextQty > 0 ? { ...p, qty: nextQty } : null;
          }
          return p;
        })
        .filter(Boolean) as AppPreOrderItem[];
    });
  };

  if (!isHydrated) return null;

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-page text-text-primary min-h-screen">
        <UtensilsCrossed size={18} className="text-primary mb-2" />
        <p className="text-sm font-bold">Loading Restaurant Booking Engine…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page p-4 sm:p-6 lg:p-8 text-text-primary">
      <div className="mx-auto max-w-4xl flex flex-col gap-6">
        {/* Header */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={tenant.logoUrl}
              alt={tenant.restaurantName}
              className="h-14 w-14 rounded-2xl object-cover border border-border"
            />
            <div>
              <h1 className="font-black text-2xl text-text-primary">
                {tenant.restaurantName}
              </h1>
              <p className="text-xs text-text-secondary">
                 {tenant.address} · {tenant.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 border border-primary/30 px-3.5 py-1 text-xs font-extrabold text-primary">
              Online Advance Booking
            </span>
          </div>
        </div>

        {/* ─── STEP 0: Authentication Gateway ────────────────────────────────────── */}
        {!currentUser && (
          <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-xl flex flex-col items-center justify-center gap-6 max-w-md mx-auto w-full text-center mt-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
              <User size={18} />
            </div>
            <div>
              <h2 className="font-black text-2xl text-text-primary mb-2">
                Authentication Required
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Please log in or create a customer account to continue with your advance table booking.
              </p>
            </div>
            
            <Link 
              href={`/auth/login?redirect=${encodeURIComponent(`/customer/reservations/book?tenant=${tenantIdParam}`)}`}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-black text-white hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <User size={18} />
              Continue to Login / Sign Up
            </Link>
          </div>
        )}

        {/* ─── STEP 1: Booking Details & Advance Deposit ─────────────────────── */}
        {currentUser && step === 1 && (
          <CustomerReservationBookingForm
            bookingDate={bookingDate}
            setBookingDate={setBookingDate}
            bookingTime={bookingTime}
            setBookingTime={setBookingTime}
            guestCount={guestCount}
            setGuestCount={setGuestCount}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            customerEmail={customerEmail}
            setCustomerEmail={setCustomerEmail}
            totalAdvanceDeposit={totalAdvanceDeposit}
            perPersonRate={ADVANCE_RATE_PER_PERSON}
            onPayClick={() => setIsPaymentModalOpen(true)}
          />
        )}

        {/* ─── STEP 2: Zero-Wait Pre-Order Menu Screen ───────────────────────── */}
        {step === 2 && (
          <CustomerReservationPreOrderMenu
            paymentTxnId={paymentTxnId}
            bookingDate={bookingDate}
            bookingTime={bookingTime}
            guestCount={guestCount}
            menuItems={menuItems}
            preOrders={preOrders}
            onAddPreOrderItem={handleAddPreOrderItem}
            onUpdatePreOrderQty={handleUpdatePreOrderQty}
            onFinalize={() => setStep(3)}
          />
        )}

        {/* ─── STEP 3: Final Confirmation Screen ─────────────────────────────────── */}
        {step === 3 && (
          <div className="flex flex-col items-center text-center p-8 rounded-3xl border border-success/40 bg-card shadow-2xl gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20 text-success text-3xl">
              
            </div>
            <h2 className="text-2xl font-black text-text-primary">
              Table Reservation Confirmed!
            </h2>
            <p className="text-xs text-text-secondary max-w-sm">
              We look forward to serving you at <strong>{tenant.restaurantName}</strong> on {bookingDate} at {bookingTime}.
            </p>
            <div className="rounded-2xl border border-border bg-surface p-4 text-xs font-bold text-text-primary w-full max-w-xs">
              <p>Advance Paid: ₹{totalAdvanceDeposit}</p>
              <p className="text-[11px] text-text-muted font-normal mt-0.5">Pre-Ordered Dishes: {preOrders.length} item(s)</p>
            </div>
            <Link
              href="/"
              className="mt-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-primary/90"
            >
              Back to Marketplace
            </Link>
          </div>
        )}
      </div>

      <CustomerReservationPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        guestCount={guestCount}
        totalAdvanceDeposit={totalAdvanceDeposit}
        onPay={handlePayAdvanceDeposit}
      />
    </div>
  );
}

export default function AdvanceReservationBookingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20 text-sm font-bold">Loading Booking Engine...</div>}>
      <AdvanceReservationBookingPageContent />
    </Suspense>
  );
}
