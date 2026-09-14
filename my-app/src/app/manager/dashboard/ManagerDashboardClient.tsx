// @ts-nocheck
"use client";

// RESPONSIBILITY: Manager Tenant Dashboard (`/manager/dashboard`).
// Displays "Create Your Restaurant" button when no hotel exists.
// Hosts Create Hotel Modal, Approval Pending Tracker, Pay Subscription Button,
// and Active POS Tenant Tools (Staff Creator, Menu Creator, Table Creator).
// DATA FLOW: tenantService -> STORAGE_KEYS.SAAS_TENANTS -> owner/dashboard/page.tsx -> UI

import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  CheckCircle2,
  Clock,
  CreditCard,
  Utensils,
  Grid3x3,
} from "lucide-react";
import { getTenantsByOwner, registerNewTenant, updateTenantStatus } from "@/lib/tenantService";
import { dispatchNotification } from "@/lib/notificationService";
import { useAuth } from "@/app/auth/auth_hooks/useAuth";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { AppTenant, AppUser, AppMenuItem, AppTable, UserRole } from "@/types/appTypes";

import { ManagerLaunchpad } from "./manager_dashboard_components/ManagerLaunchpad";
import { ManagerMenuQuickCreator } from "./manager_dashboard_components/ManagerMenuQuickCreator";
import { ManagerTableQuickCreator } from "./manager_dashboard_components/ManagerTableQuickCreator";
import { ManagerHotelOnboardingModal } from "./manager_dashboard_components/ManagerHotelOnboardingModal";
import { ManagerSubscriptionModal } from "./manager_dashboard_components/ManagerSubscriptionModal";

export default function ManagerDashboardClient() {
  const [tenants, setTenants] = useState<AppTenant[]>([]);
  const [activeTenant, setActiveTenant] = useState<AppTenant | null>(null);

  // LocalStorage state for Menu, and Tables
  const [menuItems, setMenuItems] = useLocalStorage<AppMenuItem[]>(STORAGE_KEYS.MENU, []);
  const [tables, setTables] = useLocalStorage<AppTable[]>(STORAGE_KEYS.TABLES, []);

  // Modals state
  const [isCreateHotelOpen, setIsCreateHotelOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"LAUNCHPAD" | "MENU" | "TABLES">("LAUNCHPAD");

  // Form states
  const [hotelForm, setHotelForm] = useState({
    restaurantName: "",
    tagline: "Authentic Fine Dining",
    city: "Bengaluru",
    address: "",
    landmark: "",
    pincode: "560038",
    cuisineTypes: "North Indian, Biryani, Mughlai",
    costForTwo: 1000,
    fssaiNumber: "",
    gstinNumber: "",
    upiVpa: "restaurant@upi",
    logoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  });

  const [menuForm, setMenuForm] = useState({
    name: "",
    price: 240,
    category: "Main Course",
    station: "Kitchen" as AppMenuItem["station"],
  });

  const [tableForm, setTableForm] = useState({
    tableNumber: "T-05",
    section: "Dining" as AppTable["section"],
  });

  const [txnRefInput, setTxnRefInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentUser } = useAuth();

  const refreshTenants = React.useCallback(() => {
    if (!currentUser) {
      setTenants([]);
      setActiveTenant(null);
      return;
    }
    const ownerTenants = getTenantsByOwner(currentUser.id, currentUser.phone || undefined);
    setTenants(ownerTenants);
    if (ownerTenants.length > 0) {
      setActiveTenant(ownerTenants[0]);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshTenants();
    
    // Auto-refresh when tab is focused (e.g. switching back from Super Admin)
    const handleFocus = () => refreshTenants();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refreshTenants]);

  // Redirect to admin dashboard if ACTIVE
  useEffect(() => {
    if (activeTenant?.status === "ACTIVE") {
      window.location.href = "/admin/dashboard";
    }
  }, [activeTenant]);

  // 1. Submit "Create Hotel" Request
  const handleCreateHotel = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cuisinesArray = hotelForm.cuisineTypes.split(",").map((c) => c.trim());

    setTimeout(() => {
      const created = registerNewTenant({
        restaurantName: hotelForm.restaurantName,
        tagline: hotelForm.tagline,
        city: hotelForm.city,
        address: hotelForm.address,
        landmark: hotelForm.landmark,
        pincode: hotelForm.pincode,
        cuisineTypes: cuisinesArray,
        costForTwo: Number(hotelForm.costForTwo),
        fssaiNumber: hotelForm.fssaiNumber,
        gstinNumber: hotelForm.gstinNumber,
        upiVpa: hotelForm.upiVpa,
        logoUrl: hotelForm.logoUrl,
        bannerUrl: hotelForm.bannerUrl,
        ownerId: currentUser?.id,
        ownerPhone: currentUser?.phone || undefined,
        ownerName: currentUser?.name || "Manager",
      });

      // Dispatch Notification to Super Admin
      dispatchNotification({
        role: "SUPER_ADMIN",
        type: "HOTEL_REGISTRATION_NEW",
        title: "New Hotel Registration Request 🏨",
        message: `Hotel "${created.restaurantName}" (${created.city}) submitted by Owner. Please review FSSAI & GSTIN.`,
        route: "/super-admin/requests",
        playSound: true,
        soundType: "BELL",
      });

      setActiveTenant(created);
      refreshTenants();
      setIsSubmitting(false);
      setIsCreateHotelOpen(false);
    }, 600);
  };

  // 2. Submit Subscription Payment
  const handlePaySubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTenant) return;

    setIsSubmitting(true);
    const txnId = txnRefInput || `TXN_${Date.now().toString().slice(-6)}`;

    setTimeout(() => {
      const updated = updateTenantStatus(activeTenant.tenantId, "PAYMENT_SUBMITTED", txnId);
      if (updated) {
        setActiveTenant(updated);
      }

      dispatchNotification({
        role: "SUPER_ADMIN",
        type: "PAYMENT_SUBMITTED",
        title: "Subscription Fee Payment Submitted 💳",
        message: `Hotel "${activeTenant.restaurantName}" submitted advance subscription payment (Txn ID: ${txnId}).`,
        route: "/super-admin/payments",
        playSound: true,
        soundType: "READY",
      });

      setIsSubmitting(false);
      setIsPaymentModalOpen(false);
    }, 600);
  };

  // 4. Create Menu Item
  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuForm.name) return;

    const newItem: AppMenuItem = {
      id: `item_${Date.now()}`,
      name: menuForm.name,
      price: Number(menuForm.price),
      category: menuForm.category,
      station: menuForm.station,
      isAvailable: true,
      variants: [],
      recipe: [],
      isSpecial: false,
    };

    setMenuItems([...menuItems, newItem]);
    setMenuForm({ name: "", price: 240, category: "Main Course", station: "Kitchen" });
  };

  // 5. Create Table
  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableForm.tableNumber) return;

    const newTable: AppTable = {
      id: `tbl_${Date.now()}`,
      tableNumber: tableForm.tableNumber,
      section: tableForm.section,
      status: "AVAILABLE",
      currentOrderId: null,
      mergedTables: [],
    };

    setTables([...tables, newTable]);
    setTableForm({ tableNumber: "", section: "Dining" });
  };

  return (
    <div className="min-h-screen bg-page p-4 sm:p-6 lg:p-8 text-text-primary">
      <div className="mx-auto max-w-6xl flex flex-col gap-6">
        {/* Header */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-amber-500 text-white shadow-lg">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="h1 text-text-primary">
                Manager Control Center
              </h1>
              <p className="body text-text-secondary">
                Manage restaurant profile, subscription payments, staff, menu items & dining tables
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateHotelOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-xs font-extrabold text-white shadow-lg hover:bg-primary/90 active:scale-95 transition-all"
          >
            <Plus size={18} />
            <span>Create Your Restaurant</span>
          </button>
        </div>

        {/* ── NO HOTEL CREATED YET ────────────────────────────────────────────── */}
        {!activeTenant ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border rounded-3xl bg-card">
            <Building2 size={56} className="text-primary mb-4 opacity-80" />
            <h2 className="h2 text-text-primary">No Restaurant Profile Created</h2>
            <p className="body text-text-secondary mt-1.5 max-w-md">
              Welcome to Smart POS 360! Click the button below to fill in your restaurant details and submit your application for Super Admin approval.
            </p>
            <button
              onClick={() => setIsCreateHotelOpen(true)}
              className="mt-6 flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-black text-xs text-white shadow-xl hover:bg-primary/90 active:scale-95 transition-all"
            >
              <Plus size={18} />
              <span>➕ Create Your Restaurant Now</span>
            </button>
          </div>
        ) : (
          /* ── ACTIVE OR PENDING HOTEL STATE ────────────────────────────────── */
          <div className="flex flex-col gap-6">
            {/* Active Hotel Details Card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeTenant.logoUrl}
                  alt={activeTenant.restaurantName}
                  className="h-16 w-16 rounded-2xl object-cover border border-border shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="h2 text-text-primary">
                      {activeTenant.restaurantName}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-0.5 text-[10px] font-extrabold border ${
                        activeTenant.status === "ACTIVE"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                          : activeTenant.status === "PAYMENT_PENDING"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-500 animate-pulse"
                          : activeTenant.status === "PAYMENT_SUBMITTED"
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-500"
                          : "bg-surface border-border text-text-secondary"
                      }`}
                    >
                      Status: {activeTenant.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="body text-text-secondary mt-0.5">
                    📍 {activeTenant.address} · {activeTenant.city}
                  </p>
                </div>
              </div>

              {/* Action Buttons based on status */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {activeTenant.status === "APPROVAL_PENDING" && (
                  <div className="flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs font-bold text-amber-500">
                    <Clock size={18} className="animate-spin" />
                    <span>Waiting for Super Admin Approval…</span>
                  </div>
                )}

                {activeTenant.status === "PAYMENT_PENDING" && (
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-black text-black shadow-xl hover:bg-amber-400 active:scale-95 transition-all animate-pulse"
                  >
                    <CreditCard size={18} />
                    <span>💳 Pay Advance Subscription Fee (₹2,999 / Year)</span>
                  </button>
                )}

                {activeTenant.status === "PAYMENT_SUBMITTED" && (
                  <div className="flex items-center gap-2 rounded-2xl border border-blue-500/40 bg-blue-500/10 p-3 text-xs font-bold text-blue-500">
                    <CheckCircle2 size={18} />
                    <span>Payment Submitted · Verifying Activation…</span>
                  </div>
                )}
              </div>
            </div>

            {/* Management Tabs Navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {[
                { id: "LAUNCHPAD", label: "Launchpad", icon: Grid3x3 },
                { id: "MENU", label: "Menu Creator", icon: Utensils },
                { id: "TABLES", label: "Table Setup", icon: Grid3x3 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-md"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface"
                  }`}
                >
                  <tab.icon size={15} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: LAUNCHPAD */}
            {activeTab === "LAUNCHPAD" && (
              <ManagerLaunchpad activeTenant={activeTenant} />
            )}


            {/* TAB 3: MENU CREATOR */}
            {activeTab === "MENU" && (
              <ManagerMenuQuickCreator
                menuForm={menuForm}
                setMenuForm={setMenuForm}
                handleCreateMenuItem={handleCreateMenuItem}
                menuItems={menuItems}
              />
            )}

            {/* TAB 4: TABLES CREATOR */}
            {activeTab === "TABLES" && (
              <ManagerTableQuickCreator
                tableForm={tableForm}
                setTableForm={setTableForm}
                handleCreateTable={handleCreateTable}
                tables={tables}
              />
            )}
          </div>
        )}
      </div>

      {/* ── CREATE HOTEL FORM MODAL ────────────────────────────────────────── */}
      <ManagerHotelOnboardingModal
        isCreateHotelOpen={isCreateHotelOpen}
        setIsCreateHotelOpen={setIsCreateHotelOpen}
        hotelForm={hotelForm}
        setHotelForm={setHotelForm}
        handleCreateHotel={handleCreateHotel}
        isSubmitting={isSubmitting}
      />

      {/* ── SUBSCRIPTION PAYMENT MODAL ────────────────────────────────────── */}
      <ManagerSubscriptionModal
        isPaymentModalOpen={isPaymentModalOpen}
        setIsPaymentModalOpen={setIsPaymentModalOpen}
        txnRefInput={txnRefInput}
        setTxnRefInput={setTxnRefInput}
        handlePaySubscription={handlePaySubscription}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
