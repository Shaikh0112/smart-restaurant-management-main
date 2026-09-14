import type { LucideIcon } from "lucide-react";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

export type StatusConfig = {
  textClass: string;
  bgClass: string;
  icon: LucideIcon | null;
  label: string;
};

// Based on Rule 4: Status Badge Rules
export const getStatusConfig = (status: string): StatusConfig => {
  const normalizedStatus = status.toUpperCase();

  switch (normalizedStatus) {
    // SUCCESS
    case "ACTIVE":
    case "WORKING":
    case "PRESENT":
    case "SENT":
    case "DELIVERED":
    case "RESOLVED":
    case "PAID":
    case "FULFILLED":
    case "COMPLETED":
    case "SUCCESS":
      return {
        textClass: "text-success",
        bgClass: "bg-success-bg border-success/30",
        icon: CheckCircle2,
        label: status,
      };

    // WARNING
    case "EXPIRING SOON":
    case "PENDING":
    case "IN-PROGRESS":
    case "MODERATE":
    case "MAINTENANCE":
    case "HELD":
    case "LATE":
    case "APPROVAL_PENDING":
    case "IN_PROGRESS":
      return {
        textClass: "text-warning",
        bgClass: "bg-warning-bg border-warning/30",
        icon: AlertTriangle,
        label: status,
      };

    // DANGER
    case "OCCUPIED":
    case "SUSPENDED":
    case "FAILED":
    case "LOW TRUST":
    case "OVERDUE":
    case "DUE":
    case "BROKEN":
    case "ERROR":
      return {
        textClass: "text-danger",
        bgClass: "bg-danger-bg border-danger/30",
        icon: XCircle,
        label: status,
      };

    // INFO
    case "NEW":
    case "INTERESTED":
    case "VISITED":
      return {
        textClass: "text-info",
        bgClass: "bg-info-bg border-info/30",
        icon: Info,
        label: status,
      };

    // MUTED/SECONDARY
    case "EXITED":
    case "INACTIVE":
    case "EXPIRED":
    case "LOST":
    case "CANCELLED":
    case "FORFEITED":
      return {
        textClass: "text-text-secondary",
        bgClass: "bg-[#1E1E2E] border-border",
        icon: null,
        label: status,
      };

    default:
      return {
        textClass: "text-text-secondary",
        bgClass: "bg-border border-border",
        icon: null,
        label: status,
      };
  }
};

export const getBadgeConfig = getStatusConfig;

