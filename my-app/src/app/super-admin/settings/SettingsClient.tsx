// RESPONSIBILITY: Super Admin Global SaaS Platform Settings View Layer.
// DATA FLOW: useSuperAdminSettings -> SettingsPage

"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Settings2, Save, Check } from "lucide-react";
import { useSuperAdminSettings } from "@/app/super-admin/super-admin_hooks/useSuperAdminSettings";

export default function SettingsPage() {
  const { settings, isSaved, updateSetting, handleSave } = useSuperAdminSettings();

  return (
    <div className="flex flex-col gap-6 max-w-[800px] mx-auto">
      <div>
        <div className="flex items-center gap-2 text-table-header text-text-secondary mb-1">
          <Link href="/super-admin/dashboard" className="hover:text-text-primary motion-safe:transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={12} strokeWidth={2} />
          <span className="text-text-primary font-medium">Settings</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-page-title font-bold text-text-primary">Platform Settings</h1>
            <p className="text-table-header text-text-secondary">Configure global variables, pricing, and system defaults.</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body font-medium text-white hover:bg-primary-hover motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
          >
            {isSaved ? <Check size={16} strokeWidth={2} /> : <Save size={16} strokeWidth={2} />}
            <span>{isSaved ? "Saved!" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-6 flex flex-col gap-8">
        {/* Core Setup */}
        <div>
          <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Settings2 size={18} className="text-text-primary" strokeWidth={2} /> Core Setup
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-body font-bold text-text-secondary mb-1">
                Platform Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => updateSetting("platformName", e.target.value)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-body text-text-primary focus:border-border-focus focus:ring-1 focus:ring-border-focus"
              />
            </div>
            <div>
              <label className="block text-body font-bold text-text-secondary mb-1">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => updateSetting("supportEmail", e.target.value)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-body text-text-primary focus:border-border-focus focus:ring-1 focus:ring-border-focus"
              />
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* SaaS Pricing Config */}
        <div>
          <h2 className="text-base font-semibold text-text-primary mb-4">SaaS Pricing Config</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-body font-bold text-text-secondary mb-1">Annual Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={settings.annualFee}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "+") e.preventDefault();
                }}
                onChange={(e) => updateSetting("annualFee", Number(e.target.value))}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-body text-text-primary focus:border-border-focus focus:ring-1 focus:ring-border-focus"
              />
              <p className="text-table-header text-text-secondary mt-1">Default setup price billed to new tenants.</p>
            </div>
            <div>
              <label className="block text-body font-bold text-text-secondary mb-1">Master GSTIN</label>
              <input
                type="text"
                value={settings.masterGstin}
                onChange={(e) => updateSetting("masterGstin", e.target.value)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-body text-text-primary focus:border-border-focus focus:ring-1 focus:ring-border-focus"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
