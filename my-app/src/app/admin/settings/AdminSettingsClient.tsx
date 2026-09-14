"use client";

// RESPONSIBILITY: Admin Master Restaurant Settings page.
// Configures Restaurant Name, Logo, Address, Phone, GSTIN, Tax rates, VPA, SLA Thresholds.
// DATA FLOW: useAdminSettingsForm -> AdminSettingsPage -> form submit -> localStorage

import React from "react";
import { AuthGuard } from "@/app/auth/auth_components/AuthGuard";
import { useAdminSettingsForm } from "./admin_settings_hooks/useAdminSettingsForm";
import { Save, Store, Receipt, Sliders } from "lucide-react";

export function AdminSettingsClient() {
  const { form, onSubmit } = useAdminSettingsForm();
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Master Restaurant Settings</h1>
            <p className="text-sm text-text-secondary">Configure branding, taxes, VPA, and SLA rules</p>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary-hover motion-safe:transition-colors"
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
              <h3 className="font-bold text-base text-text-primary">Restaurant Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Restaurant Name</label>
                <input
                  type="text"
                  {...register("restaurantName")}
                  className={`w-full rounded-xl border bg-input px-3.5 py-2 text-text-primary focus:outline-none ${errors.restaurantName ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}`}
                />
                {errors.restaurantName && <p className="text-xs text-danger mt-1">{errors.restaurantName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Phone Number</label>
                <input
                  type="text"
                  {...register("phone")}
                  className={`w-full rounded-xl border bg-input px-3.5 py-2 text-text-primary focus:outline-none ${errors.phone ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}`}
                />
                {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-secondary mb-1">Address</label>
                <input
                  type="text"
                  {...register("address")}
                  className={`w-full rounded-xl border bg-input px-3.5 py-2 text-text-primary focus:outline-none ${errors.address ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}`}
                />
                {errors.address && <p className="text-xs text-danger mt-1">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          {/* Taxes & Financials */}
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-success border-b border-border pb-3">
              <Receipt className="h-5 w-5" />
              <h3 className="font-bold text-base text-text-primary">Taxes, UPI VPA & Invoicing</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">GSTIN Number</label>
                <input
                  type="text"
                  {...register("gstin")}
                  className={`w-full rounded-xl border bg-input px-3.5 py-2 text-text-primary focus:outline-none ${errors.gstin ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}`}
                />
                {errors.gstin && <p className="text-xs text-danger mt-1">{errors.gstin.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">UPI VPA Address</label>
                <input
                  type="text"
                  {...register("upiVpa")}
                  className={`w-full rounded-xl border bg-input px-3.5 py-2 text-text-primary focus:outline-none ${errors.upiVpa ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}`}
                />
                {errors.upiVpa && <p className="text-xs text-danger mt-1">{errors.upiVpa.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">CGST Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("cgstPercent", { valueAsNumber: true })}
                  className={`w-full rounded-xl border bg-input px-3.5 py-2 text-text-primary focus:outline-none ${errors.cgstPercent ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}`}
                min={0} onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }} />
                {errors.cgstPercent && <p className="text-xs text-danger mt-1">{errors.cgstPercent.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">SGST Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("sgstPercent", { valueAsNumber: true })}
                  className={`w-full rounded-xl border bg-input px-3.5 py-2 text-text-primary focus:outline-none ${errors.sgstPercent ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}`}
                min={0} onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }} />
                {errors.sgstPercent && <p className="text-xs text-danger mt-1">{errors.sgstPercent.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Service Charge (%)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("serviceChargePercent", { valueAsNumber: true })}
                  className={`w-full rounded-xl border bg-input px-3.5 py-2 text-text-primary focus:outline-none ${errors.serviceChargePercent ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}`}
                min={0} onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }} />
                {errors.serviceChargePercent && <p className="text-xs text-danger mt-1">{errors.serviceChargePercent.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Loyalty --- per 1 Point</label>
                <input
                  type="number"
                  {...register("loyaltyRupeesPerPoint", { valueAsNumber: true })}
                  className={`w-full rounded-xl border bg-input px-3.5 py-2 text-text-primary focus:outline-none ${errors.loyaltyRupeesPerPoint ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}`}
                min={0} onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }} />
                {errors.loyaltyRupeesPerPoint && <p className="text-xs text-danger mt-1">{errors.loyaltyRupeesPerPoint.message}</p>}
              </div>
            </div>
          </div>

          {/* KDS & Operational SLAs */}
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-warning border-b border-border pb-3">
              <Sliders className="h-5 w-5" />
              <h3 className="font-bold text-base text-text-primary">KDS & Kitchen SLA Rules</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Default Prep Time (Mins)</label>
                <input
                  type="number"
                  {...register("defaultPrepTimeMins", { valueAsNumber: true })}
                  className={`w-full rounded-xl border bg-input px-3.5 py-2 text-text-primary focus:outline-none ${errors.defaultPrepTimeMins ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}`}
                min={0} onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }} />
                {errors.defaultPrepTimeMins && <p className="text-xs text-danger mt-1">{errors.defaultPrepTimeMins.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">KDS SLA Yellow Warning (Mins)</label>
                <input
                  type="number"
                  {...register("kdsSlaWarningMins", { valueAsNumber: true })}
                  className={`w-full rounded-xl border bg-input px-3.5 py-2 text-text-primary focus:outline-none ${errors.kdsSlaWarningMins ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}`}
                min={0} onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }} />
                {errors.kdsSlaWarningMins && <p className="text-xs text-danger mt-1">{errors.kdsSlaWarningMins.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">KDS SLA Red Alert (Mins)</label>
                <input
                  type="number"
                  {...register("kdsSlaDangerMins", { valueAsNumber: true })}
                  className={`w-full rounded-xl border bg-input px-3.5 py-2 text-text-primary focus:outline-none ${errors.kdsSlaDangerMins ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'}`}
                min={0} onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }} />
                {errors.kdsSlaDangerMins && <p className="text-xs text-danger mt-1">{errors.kdsSlaDangerMins.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary-hover motion-safe:transition-colors"
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
