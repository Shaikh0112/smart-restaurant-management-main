// RESPONSIBILITY: Custom hook handling useCoupons logic
// DATA FLOW: UI Component -> useCoupons -> State/API
import { useState } from 'react';
import type { Coupon, CouponKPIs } from "@/app/super-admin/super-admin_types/coupons_types";
import { MOCK_COUPONS, MOCK_COUPON_KPIS } from "@/app/super-admin/super-admin_constants/coupons_constants";

/**
 * @description Custom hook for useCoupons
 * @returns {object} Hook state and methods
 */
export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [kpis] = useState<CouponKPIs>(MOCK_COUPON_KPIS);
  const [isCreating, setIsCreating] = useState(false);

  const toggleStatus = (id: string) => {
    setCoupons(prev => prev.map(c => {
      if (c.id === id) {
        if (c.status === 'expired' || c.status === 'depleted') return c;
        return { ...c, status: c.status === 'active' ? 'expired' : 'active' };
      }
      return c;
    }));
  };

  return {
    coupons,
    kpis,
    isCreating,
    setIsCreating,
    toggleStatus
  };
};
