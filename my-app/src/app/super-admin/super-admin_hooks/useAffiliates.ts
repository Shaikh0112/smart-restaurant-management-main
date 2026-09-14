import { toast } from "sonner";
// RESPONSIBILITY: Custom hook handling useAffiliates logic
// DATA FLOW: UI Component -> useAffiliates -> State/API
import { useState } from 'react';
import type { Affiliate, AffiliateKPIs } from "@/app/super-admin/super-admin_types/affiliates_types";
import { MOCK_AFFILIATES, MOCK_AFFILIATE_KPIS } from "@/app/super-admin/super-admin_constants/affiliates_constants";

/**
 * @description Custom hook for useAffiliates
 * @returns {object} Hook state and methods
 */
export const useAffiliates = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(MOCK_AFFILIATES);
  const [kpis] = useState<AffiliateKPIs>(MOCK_AFFILIATE_KPIS);
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  const processPayout = (id: string) => {
    setIsProcessingPayout(true);
    setTimeout(() => {
      setAffiliates(prev => prev.map(a => 
        a.id === id ? { ...a, pendingPayout: 0 } : a
      ));
      setIsProcessingPayout(false);
      toast.success('Payout processed successfully via Stripe Connect.');
    }, 1500);
  };

  const toggleStatus = (id: string) => {
    setAffiliates(prev => prev.map(a => 
      a.id === id ? { ...a, status: a.status === 'active' ? 'suspended' : 'active' } : a
    ));
  };

  return {
    affiliates,
    kpis,
    isProcessingPayout,
    processPayout,
    toggleStatus
  };
};
