"use client";
import { getStatusConfig } from "@/config/statusBadgeConfig";
// RESPONSIBILITY: Component rendering CouponsTable

import React from 'react';
import type { Coupon } from "@/app/super-admin/super-admin_types/coupons_types";
import { Power, Trash2 } from 'lucide-react';

interface Props {
  coupons: Coupon[];
  onToggleStatus: (id: string) => void;
}

export default function CouponsTable({ coupons, onToggleStatus }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'depleted': return 'bg-warning/10 text-warning';
      case 'expired': return 'bg-danger/10 text-danger';
      default: return 'bg-secondary/10 text-text-secondary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-page/50">
        <h2 className="text-base font-bold text-text-primary">Global Coupons</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-md text-body font-medium hover:bg-primary/90 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page">
          + Create Coupon
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-page/30 text-text-secondary text-table-header uppercase tracking-wider">
              <th className="p-4 font-medium">Code</th>
              <th className="p-4 font-medium">Discount</th>
              <th className="p-4 font-medium">Usage</th>
              <th className="p-4 font-medium">Expires At</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-body">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-border hover:bg-page/50 motion-safe:transition-colors">
                <td className="p-4 text-text-primary font-mono font-bold tracking-wide">{coupon.code}</td>
                <td className="p-4 text-text-primary">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`} Off
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-text-primary text-table-header">{coupon.currentUses} / {coupon.maxUses}</span>
                    <div className="w-full bg-page rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ width: `${Math.min((coupon.currentUses / coupon.maxUses) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-text-secondary text-table-header">
                  {new Date(coupon.expiresAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-table-header font-medium capitalize ${getStatusColor(coupon.status)}`}>
                    {coupon.status}
                  </span>
                </td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <button 
                    onClick={() => onToggleStatus(coupon.id)}
                    className="p-2 text-text-secondary hover:text-text-primary motion-safe:transition-colors rounded-md hover:bg-page disabled:opacity-30"
                    title="Toggle Status"
                    disabled={coupon.status === 'expired' || coupon.status === 'depleted'}
                  >
                    <Power size={16} strokeWidth={2} />
                  </button>
                  <button 
                    className="p-2 text-danger hover:bg-danger/10 motion-safe:transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
                    title="Delete Coupon"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-secondary text-body">
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
