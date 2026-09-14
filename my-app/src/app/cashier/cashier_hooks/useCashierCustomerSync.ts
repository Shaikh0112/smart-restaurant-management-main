"use client";
// RESPONSIBILITY: useCashierCustomerSync module logic and UI.
// DATA FLOW: Local component state -> External API
import { useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import type { AppServiceRequest } from "@/types/appTypes";

export function useCashierCustomerSync({
  selectedTableId,
  selectedTableNumber,
  serviceRequests,
  selectedTableInfo,
  setCrmCustomerPhone,
  setCrmCustomerName,
}: {
  selectedTableId: string;
  selectedTableNumber: string;
  serviceRequests: any[];
  selectedTableInfo?: any;
  setCrmCustomerPhone: (phone: string) => void;
  setCrmCustomerName: (name: string) => void;
}) {
  const normKey = useCallback((s?: string) => {
    if (!s) return "";
    return s.toLowerCase().trim().replace(/^(table|tbl|t)-?/i, "").trim().padStart(2, "0");
  }, []);

  // Auto-fill customer phone
  useEffect(() => {
    if (!selectedTableId) {
      setCrmCustomerPhone("");
      setCrmCustomerName("");
      return;
    }

    const normSelId = normKey(selectedTableId);
    const normSelNum = normKey(selectedTableNumber);

    // 0. Check direct dedicated localStorage key
    if (typeof window !== "undefined") {
      const storedPhone =
        (normSelNum ? window.localStorage.getItem(`table_phone_${normSelNum}`) : null) ||
        (normSelId ? window.localStorage.getItem(`table_phone_${normSelId}`) : null);

      if (storedPhone && storedPhone.length >= 10) {
        const clean = storedPhone.replace(/\D/g, "").slice(0, 10);
        setCrmCustomerPhone(clean);
        setCrmCustomerName(`Guest (Table ${selectedTableNumber || normSelNum})`);
        return;
      }
    }

    // 1. Check ALL service requests for phone number
    const billReq = serviceRequests.find(
      (r) =>
        r &&
        r.type === "BILL" &&
        (normKey(r.tableId) === normSelId ||
          normKey(r.tableNumber) === normSelId ||
          normKey(r.tableId) === normSelNum ||
          normKey(r.tableNumber) === normSelNum)
    );

    if (billReq?.customMessage) {
      const phoneMatch = billReq.customMessage.match(/\b\d{10}\b/);
      if (phoneMatch) {
        setCrmCustomerPhone(phoneMatch[0]);
        setCrmCustomerName(`Guest (Table ${selectedTableNumber || normSelNum})`);
        return;
      }
    }

    // 2. Check if active order has customerInfo phone
    if (selectedTableInfo?.order?.customerInfo?.phone) {
      const cleanPhone = selectedTableInfo.order.customerInfo.phone.replace(/\D/g, "");
      if (cleanPhone.length >= 10) {
        setCrmCustomerPhone(cleanPhone.slice(0, 10));
        setCrmCustomerName(selectedTableInfo.order.customerInfo.name || "Guest");
        return;
      }
    }

    // 3. Otherwise leave empty
    setCrmCustomerPhone("");
    setCrmCustomerName("");
  }, [selectedTableId, selectedTableNumber, serviceRequests, selectedTableInfo, setCrmCustomerPhone, setCrmCustomerName, normKey]);

  // Listen to cross-tab storage changes
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (!selectedTableId) return;
      if (e.key?.startsWith("table_phone_") || e.key === STORAGE_KEYS.SERVICE_REQUESTS) {
        const normSelNum = normKey(selectedTableNumber);
        const normSelId = normKey(selectedTableId);
        const stored =
          (normSelNum ? window.localStorage.getItem(`table_phone_${normSelNum}`) : null) ||
          (normSelId ? window.localStorage.getItem(`table_phone_${normSelId}`) : null);

        if (stored && stored.length >= 10) {
          const clean = stored.replace(/\D/g, "").slice(0, 10);
          setCrmCustomerPhone(clean);
          setCrmCustomerName(`Guest (Table ${selectedTableNumber || normSelNum})`);
        }
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [selectedTableId, selectedTableNumber, setCrmCustomerPhone, setCrmCustomerName, normKey]);

  const resolveCustomerPhoneForCheckout = useCallback((currentPhone: string) => {
    let resolvedPhone = currentPhone;
    const normSelId = normKey(selectedTableId);
    const normSelNum = normKey(selectedTableNumber);

    if (!resolvedPhone || resolvedPhone.length < 10) {
      if (typeof window !== "undefined") {
        const stored =
          (normSelNum ? window.localStorage.getItem(`table_phone_${normSelNum}`) : null) ||
          (normSelId ? window.localStorage.getItem(`table_phone_${normSelId}`) : null);

        if (stored && stored.length >= 10) {
          resolvedPhone = stored.replace(/\D/g, "").slice(0, 10);
        }
      }
    }

    if (!resolvedPhone || resolvedPhone.length < 10) {
      try {
        const rawReqs = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEYS.SERVICE_REQUESTS) : null;
        if (rawReqs) {
          const reqs: AppServiceRequest[] = JSON.parse(rawReqs);
          const billReq = reqs.find(
            (r) =>
              r &&
              r.type === "BILL" &&
              (normKey(r.tableId) === normSelId ||
                normKey(r.tableNumber) === normSelId ||
                normKey(r.tableId) === normSelNum ||
                normKey(r.tableNumber) === normSelNum)
          );
          if (billReq?.customMessage) {
            const phoneMatch = billReq.customMessage.match(/\b\d{10}\b/);
            if (phoneMatch) {
              resolvedPhone = phoneMatch[0];
            }
          }
        }
      } catch (err) {
        console.error("Error reading service request phone:", err);
      }
    }

    if (!resolvedPhone || resolvedPhone.length < 10) {
      if (selectedTableInfo?.order?.customerInfo?.phone) {
        const clean = selectedTableInfo.order.customerInfo.phone.replace(/\D/g, "");
        if (clean.length >= 10) resolvedPhone = clean.slice(0, 10);
      }
    }

    return resolvedPhone;
  }, [normKey, selectedTableId, selectedTableNumber, selectedTableInfo]);

  const clearCustomerData = useCallback(() => {
    if (typeof window !== "undefined" && selectedTableNumber) {
      window.localStorage.removeItem(`table_phone_${normKey(selectedTableNumber)}`);
    }
  }, [normKey, selectedTableNumber]);

  return { resolveCustomerPhoneForCheckout, clearCustomerData, normKey };
}
