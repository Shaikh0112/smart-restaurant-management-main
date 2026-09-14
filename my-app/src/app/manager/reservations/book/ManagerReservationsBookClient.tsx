// @ts-nocheck
﻿"use client";

// RESPONSIBILITY: Online Advance Table Booking & Zero-Wait Pre-Ordering System (`/manager/reservations/book`).
// Customer selects Date, Time, and Guest Count (e.g. 10 Persons).
// Calculates per-person deposit (10 x â‚¹100 = â‚¹1,000), collects payment via multi-gateway,
// and opens the Zero-Wait Pre-Order Menu Screen to select dishes prior to arrival.
// Saved customer profile persistence ensures zero re-entering of contact info!
// DATA FLOW: manager_reservations/book/page.tsx -> createAdvanceReservation() -> STORAGE_KEYS.ADVANCE_RESERVATIONS

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UtensilsCrossed } from "lucide-react";

import { getTenantById, getActiveTenants, createAdvanceReservation } from "@/lib/tenantService";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/app/auth/auth_hooks/useAuth";
import type { AppMenuItem, AppTenant, AppPreOrderItem } from "@/types/appTypes";

import { AuthGateway } from "./manager_reservations_book_components/AuthGateway";
import { ReservationForm } from "./manager_reservations_book_components/ReservationForm";
import { PreOrderMenu } from "./manager_reservations_book_components/PreOrderMenu";
import { ConfirmationScreen } from "./manager_reservations_book_components/ConfirmationScreen";
import { PaymentModal } from "./manager_reservations_book_components/PaymentModal";

export const dynamic = 'force-dynamic';

const ADVANCE_RATE_PER_PERSON = 100 as const; // â‚¹100 per guest

function AdvanceReservationBookingPageContent() {
  const searchParams = useSearchParams();
  const tenantIdParam = searchParams.get("tenant") || "tenant-royal-spice-01";

  const { currentUser, login, signupCustomer, isHydrated } = useAuth();

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
      paymentStatus: "PAID",
      paymentTxnId: txnId,
      preOrderItems: [],
      status: "CONFIRMED",
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

  if (!isHydrated) {
    return null;
  }

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-page text-text-primary min-h-screen">
        <UtensilsCrossed size={40} className="text-primary mb-2" />
        <p className="text-sm font-bold">Loading Restaurant Booking Engineâ€¦</p>
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
                ðŸ“ {tenant.address} Â· {tenant.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 border border-primary/30 px-3.5 py-1 text-xs font-extrabold text-primary">
              Online Advance Booking
            </span>
          </div>
        </div>

        {/* ── STEP 0: Authentication Gateway ────────────────────────────────────── */}
        {!currentUser && (
          <AuthGateway tenantIdParam={tenantIdParam} />
        )}

        {/* ── STEP 1: Booking Details & Advance Deposit ─────────────────────────── */}
        {currentUser && step === 1 && (
          <ReservationForm
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
            advanceRatePerPerson={ADVANCE_RATE_PER_PERSON}
            setIsPaymentModalOpen={setIsPaymentModalOpen}
          />
        )}

        {/* ── STEP 2: Zero-Wait Pre-Order Menu Screen ─────────────────────────── */}
        {step === 2 && (
          <PreOrderMenu
            paymentTxnId={paymentTxnId}
            bookingDate={bookingDate}
            bookingTime={bookingTime}
            guestCount={guestCount}
            setStep={setStep}
            menuItems={menuItems}
            preOrders={preOrders}
            handleAddPreOrderItem={handleAddPreOrderItem}
            handleUpdatePreOrderQty={handleUpdatePreOrderQty}
          />
        )}

        {/* ── STEP 3: Final Confirmation Screen ─────────────────────────────────── */}
        {step === 3 && (
          <ConfirmationScreen
            tenant={tenant}
            bookingDate={bookingDate}
            bookingTime={bookingTime}
            totalAdvanceDeposit={totalAdvanceDeposit}
            preOrders={preOrders}
          />
        )}
      </div>

      {/* Multi-Option Deposit Payment Modal */}
      <PaymentModal
        isPaymentModalOpen={isPaymentModalOpen}
        setIsPaymentModalOpen={setIsPaymentModalOpen}
        guestCount={guestCount}
        totalAdvanceDeposit={totalAdvanceDeposit}
        handlePayAdvanceDeposit={handlePayAdvanceDeposit}
      />
    </div>
  );
}

export default function ManagerReservationsBookClient() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20 text-sm font-bold">Loading Booking Engine...</div>}>
      <AdvanceReservationBookingPageContent />
    </Suspense>
  );
}
