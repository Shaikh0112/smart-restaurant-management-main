"use client";
// RESPONSIBILITY: Component rendering SecuritySettingsForm using React Hook Form

import React from "react";
import type { SecuritySettings } from "@/app/super-admin/super-admin_types/security_types";
import { useSecuritySettingsForm } from './useSecuritySettingsForm';

interface Props {
  settings: SecuritySettings;
  onUpdate: (newSettings: Partial<SecuritySettings>) => void;
}

export default function SecuritySettingsForm({ settings, onUpdate }: Props) {
  const { form } = useSecuritySettingsForm({ 
    initialSettings: settings, 
    onSubmit: (data) => onUpdate(data) 
  });
  
  const { register, formState: { errors } } = form;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-bold text-text-primary mb-4">Global Security Policies</h2>
      
      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        {/* 2FA Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-body font-medium text-text-primary">Enforce Two-Factor Authentication (2FA)</p>
            <p className="text-table-header text-text-secondary">Require all restaurant managers to use OTP for login.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page" 
              {...register('enforce2FA')}
            />
            <div className="w-11 h-6 bg-secondary/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:motion-safe:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Session Timeout */}
        <div>
          <label className="block text-body font-medium text-text-primary mb-1">
            Global Session Timeout (Minutes)
          </label>
          <input 
            type="number" min="1"
            {...register('sessionTimeoutMinutes', { valueAsNumber: true })}
            onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
            className="w-full bg-page border border-border rounded-md px-3 py-2 text-body text-text-primary focus:outline-none focus:border-primary"
          />
          {errors.sessionTimeoutMinutes && <p className="text-sm text-red-500 mt-1">{errors.sessionTimeoutMinutes.message}</p>}
          <p className="text-table-header text-text-secondary mt-1">Users will be automatically logged out after this period of inactivity.</p>
        </div>

        {/* Failed Logins */}
        <div>
          <label className="block text-body font-medium text-text-primary mb-1">
            Max Failed Login Attempts
          </label>
          <input 
            type="number" min="1"
            {...register('maxFailedLoginAttempts', { valueAsNumber: true })}
            onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
            className="w-full bg-page border border-border rounded-md px-3 py-2 text-body text-text-primary focus:outline-none focus:border-primary"
          />
          {errors.maxFailedLoginAttempts && <p className="text-sm text-red-500 mt-1">{errors.maxFailedLoginAttempts.message}</p>}
          <p className="text-table-header text-text-secondary mt-1">Account will be locked after this many consecutive failed attempts.</p>
        </div>
      </form>
    </div>
  );
}
