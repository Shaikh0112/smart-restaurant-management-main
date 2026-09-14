"use client";
// RESPONSIBILITY: Component rendering NewBroadcastForm using React Hook Form

import React from 'react';
import type { BroadcastPriority } from "@/app/super-admin/super-admin_types/broadcasts_types";
import { Send, Calendar } from 'lucide-react';
import { useNewBroadcastForm } from './useNewBroadcastForm';

interface Props {
  isSending: boolean;
  onSubmit: (data: { title: string, message: string, priority: BroadcastPriority, targetAudience: 'all' | 'active_only' | 'specific_tenants' }) => void;
}

export default function NewBroadcastForm({ isSending, onSubmit }: Props) {
  const { form, handleSubmit } = useNewBroadcastForm({ onSubmit });
  const { register, formState: { errors } } = form;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-base font-bold text-text-primary mb-4">Compose Global Broadcast</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-small font-medium text-text-primary mb-1">Alert Title</label>
          <input 
            type="text" 
            {...register('title')}
            placeholder="e.g. Scheduled System Maintenance"
            className="w-full bg-page border border-border rounded-md px-3 py-2 text-body text-text-primary focus:outline-none focus:border-primary"
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-small font-medium text-text-primary mb-1">Priority Level</label>
            <select 
              {...register('priority')}
              className="w-full bg-page border border-border rounded-md px-3 py-2 text-body text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="info">Info (Blue)</option>
              <option value="warning">Warning (Yellow)</option>
              <option value="critical">Critical (Red)</option>
            </select>
          </div>
          <div>
            <label className="block text-small font-medium text-text-primary mb-1">Target Audience</label>
            <select 
              {...register('targetAudience')}
              className="w-full bg-page border border-border rounded-md px-3 py-2 text-body text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="all">All Tenants</option>
              <option value="active_only">Active Tenants Only</option>
              <option value="specific_tenants">Specific Tenants (Manual)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-small font-medium text-text-primary mb-1">Message Body</label>
          <textarea 
            {...register('message')}
            placeholder="Enter the alert content that will appear on tenant dashboards..."
            className="w-full bg-page border border-border rounded-md px-3 py-2 text-body text-text-primary focus:outline-none focus:border-primary min-h-[100px]"
          />
          {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <button 
            type="submit"
            disabled={isSending}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-md text-body font-medium hover:bg-primary/90 motion-safe:transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
          >
            <Send size={16} strokeWidth={2} />
            {isSending ? 'Sending...' : 'Send Broadcast Now'}
          </button>
          <button 
            type="button"
            className="flex items-center gap-2 bg-page border border-border text-text-primary px-5 py-2 rounded-md text-body font-medium hover:bg-border motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
          >
            <Calendar size={16} strokeWidth={2} /> Schedule
          </button>
        </div>
      </form>
    </div>
  );
}
