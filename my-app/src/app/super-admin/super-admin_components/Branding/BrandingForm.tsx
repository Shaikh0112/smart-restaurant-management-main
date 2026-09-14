"use client";
// RESPONSIBILITY: Component rendering BrandingForm using React Hook Form

import React from "react";
import Image from "next/image";
import type { TenantBranding } from "@/app/super-admin/super-admin_types/branding_types";
import { useBrandingForm } from './useBrandingForm';

interface Props {
  branding: TenantBranding;
  isSaving: boolean;
  onUpdate: (updates: Partial<TenantBranding>) => void;
  onSave: () => void;
}

export default function BrandingForm({ branding, isSaving, onUpdate, onSave }: Props) {
  const { form, handleSubmit } = useBrandingForm({ 
    initialBranding: branding, 
    onSubmit: onSave,
    onAutoSave: onUpdate // the parent relies on onUpdate to live-preview the branding color etc.
  });
  
  const { register, watch, formState: { errors } } = form;
  const isWhiteLabelEnabled = watch('isWhiteLabelEnabled');
  const primaryColor = watch('primaryColor') || branding.primaryColor;
  const logoUrl = watch('logoUrl') || branding.logoUrl;

  return (
    <div className="bg-card border border-border rounded-lg p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-text-primary">White-Label Configuration</h2>
          <p className="text-body text-text-secondary">Customize the look and feel of the tenant platform.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page" 
            {...register('isWhiteLabelEnabled')}
          />
          <div className="w-11 h-6 bg-secondary/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:motion-safe:transition-all peer-checked:bg-primary"></div>
          <span className="ml-3 text-body font-medium text-text-primary">
            {isWhiteLabelEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={`flex flex-col gap-6 ${!isWhiteLabelEnabled && 'opacity-50 pointer-events-none'}`}>
          <div>
            <label className="block text-body font-medium text-text-primary mb-1">
              Custom CNAME Domain
            </label>
            <div className="flex items-center">
              <span className="bg-page border border-r-0 border-border rounded-l-md px-3 py-2 text-text-secondary text-body">
                https://
              </span>
              <input 
                type="text" 
                {...register('customDomain')}
                placeholder="pos.yourcompany.com"
                className="flex-1 bg-page border border-border rounded-r-md px-3 py-2 text-body text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
            {errors.customDomain && <p className="text-sm text-red-500 mt-1">{errors.customDomain.message}</p>}
            <p className="text-table-header text-text-secondary mt-1">Make sure to point your DNS CNAME record to our servers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-body font-medium text-text-primary mb-1">
                Platform Logo URL
              </label>
              <input 
                type="text" 
                {...register('logoUrl')}
                className="w-full bg-page border border-border rounded-md px-3 py-2 text-body text-text-primary focus:outline-none focus:border-primary"
              />
              {errors.logoUrl && <p className="text-sm text-red-500 mt-1">{errors.logoUrl.message}</p>}
              {logoUrl && !errors.logoUrl && (
                <div className="mt-4 p-4 border border-border rounded-md bg-page flex items-center justify-center">
                  <Image src={logoUrl} alt="Tenant Logo" width={200} height={48} className="h-12 w-auto object-contain" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-body font-medium text-text-primary mb-1">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  {...register('primaryColor')}
                  className="h-10 w-20 cursor-pointer bg-page border border-border rounded-md"
                />
                <input 
                  type="text" 
                  {...register('primaryColor')}
                  className="flex-1 bg-page border border-border rounded-md px-3 py-2 text-body text-text-primary focus:outline-none focus:border-primary font-mono uppercase"
                />
              </div>
              {errors.primaryColor && <p className="text-sm text-red-500 mt-1">{errors.primaryColor.message}</p>}
              
              <div className="mt-4 p-4 border border-border rounded-md">
                <p className="text-table-header text-text-secondary mb-2">Preview:</p>
                <button 
                  type="button"
                  className="w-full text-white py-2 rounded-md font-medium text-body motion-safe:transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
                  style={{ backgroundColor: primaryColor }}
                >
                  Sample Action Button
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex justify-end">
          <button 
            type="submit"
            disabled={isSaving || !isWhiteLabelEnabled}
            className="bg-primary text-white px-6 py-2 rounded-md font-medium text-body hover:bg-primary/90 motion-safe:transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
