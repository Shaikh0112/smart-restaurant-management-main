// @ts-nocheck
"use client";

// RESPONSIBILITY: Admin Master Restaurant Settings page.
// Configures Restaurant Name, Logo, Address, Phone, GSTIN, Tax rates, VPA, SLA Thresholds.
// DATA FLOW: localStorage (app_restaurant_settings) -> AdminSettingsPage -> form submit -> localStorage

import React, { useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import { AuthGuard } from "@/app/auth/auth_components/AuthGuard";
import { toast } from "sonner";
import type { AppRestaurantSettings } from "@/types/appTypes";
import { Building2, Save, Store, Receipt, Sliders, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const settingsSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant Name is required"),
  phone: z.string().min(1, "Phone Number is required"),
  address: z.string().min(1, "Address is required"),
  gstin: z.string().optional(),
  upiVpa: z.string().optional(),
  cgstPercent: z.number({ invalid_type_error: "Required" }).min(0, "Must be >= 0"),
  sgstPercent: z.number({ invalid_type_error: "Required" }).min(0, "Must be >= 0"),
  serviceChargePercent: z.number({ invalid_type_error: "Required" }).min(0, "Must be >= 0"),
  loyaltyRupeesPerPoint: z.number({ invalid_type_error: "Required" }).min(1, "Must be >= 1"),
  defaultPrepTimeMins: z.number({ invalid_type_error: "Required" }).min(1, "Must be >= 1"),
  kdsSlaWarningMins: z.number({ invalid_type_error: "Required" }).min(1, "Must be >= 1"),
  kdsSlaDangerMins: z.number({ invalid_type_error: "Required" }).min(1, "Must be >= 1"),
});

const DEFAULT_SETTINGS: AppRestaurantSettings = {
  restaurantName: "Spice Garden Restaurant",
  logoUrl: "",
  address: "123 MG Road, Connaught Place, New Delhi",
  phone: "9876543210",
  gstin: "07AAAAA0000A1Z5",
  currency: "₹",
  invoicePrefix: "INV-",
  kotPrefix: "KOT-",
  upiVpa: "spicegarden@upi",
  cgstPercent: 2.5,
  sgstPercent: 2.5,
  vatPercent: 0,
  serviceChargePercent: 5,
  loyaltyRupeesPerPoint: 100,
  defaultPrepTimeMins: 15,
  businessHours: "11:00 AM - 11:00 PM",
  receiptFooter: "Thank you for dining with us! Please come again.",
  kdsSlaWarningMins: 10,
  kdsSlaDangerMins: 15,
};

export default function ManagerSettingsClient() {
  const [settings, setSettings] = useLocalStorage<AppRestaurantSettings>(
    STORAGE_KEYS.RESTAURANT_SETTINGS,
    DEFAULT_SETTINGS
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppRestaurantSettings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  const onSubmit = (data: AppRestaurantSettings) => {
    setSettings({ ...settings, ...data });
    toast.success("Master restaurant settings updated successfully!");
  };

  return (
    <AuthGuard allowedRoles={["MANAGER"]}>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="h1 text-text-primary">Master Restaurant Settings</h1>
            <p className="body text-text-secondary">Configure branding, taxes, VPA, and SLA rules</p>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-hover transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Identity & Address */}
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-primary border-b border-border pb-3">
              <Store className="h-5 w-5" />
              <h3 className="h3 text-text-primary">Restaurant Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Restaurant Name</label>
                <input
                  type="text"
                  {...register("restaurantName")}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
                {errors.restaurantName && <p className="mt-1 text-xs text-red-500">{errors.restaurantName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Phone Number</label>
                <input
                  type="text"
                  {...register("phone")}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-secondary mb-1">Address</label>
                <input
                  type="text"
                  {...register("address")}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          {/* Taxes & Financials */}
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-500 border-b border-border pb-3">
              <Receipt className="h-5 w-5" />
              <h3 className="h3 text-text-primary">Taxes, UPI VPA & Invoicing</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">GSTIN Number</label>
                <input
                  type="text"
                  {...register("gstin")}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
                {errors.gstin && <p className="mt-1 text-xs text-red-500">{errors.gstin.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">UPI VPA Address</label>
                <input
                  type="text"
                  {...register("upiVpa")}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
                {errors.upiVpa && <p className="mt-1 text-xs text-red-500">{errors.upiVpa.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">CGST Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("cgstPercent", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
                {errors.cgstPercent && <p className="mt-1 text-xs text-red-500">{errors.cgstPercent.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">SGST Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("sgstPercent", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
                {errors.sgstPercent && <p className="mt-1 text-xs text-red-500">{errors.sgstPercent.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Service Charge (%)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("serviceChargePercent", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
                {errors.serviceChargePercent && <p className="mt-1 text-xs text-red-500">{errors.serviceChargePercent.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Loyalty ₹ per 1 Point</label>
                <input
                  type="number"
                  {...register("loyaltyRupeesPerPoint", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
                {errors.loyaltyRupeesPerPoint && <p className="mt-1 text-xs text-red-500">{errors.loyaltyRupeesPerPoint.message}</p>}
              </div>
            </div>
          </div>

          {/* KDS & Operational SLAs */}
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-500 border-b border-border pb-3">
              <Sliders className="h-5 w-5" />
              <h3 className="h3 text-text-primary">KDS & Kitchen SLA Rules</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Default Prep Time (Mins)</label>
                <input
                  type="number"
                  {...register("defaultPrepTimeMins", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
                {errors.defaultPrepTimeMins && <p className="mt-1 text-xs text-red-500">{errors.defaultPrepTimeMins.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">KDS SLA Yellow Warning (Mins)</label>
                <input
                  type="number"
                  {...register("kdsSlaWarningMins", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
                {errors.kdsSlaWarningMins && <p className="mt-1 text-xs text-red-500">{errors.kdsSlaWarningMins.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">KDS SLA Red Alert (Mins)</label>
                <input
                  type="number"
                  {...register("kdsSlaDangerMins", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
                {errors.kdsSlaDangerMins && <p className="mt-1 text-xs text-red-500">{errors.kdsSlaDangerMins.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-primary-hover transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save All Settings</span>
            </button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
