// @ts-nocheck
﻿// RESPONSIBILITY: Single source of truth for all TypeScript types used in the
// ManagerReservations module. No logic, no imports, no JSX â€” pure type definitions only.
// DATA FLOW: ManagerReservationsTypes.ts â†’ useManagerReservations.ts + all ManagerReservations components

import type { AppReservation, AppTable } from "@/types/appTypes";

// â”€â”€â”€ Form Values (Rule 7: types in _types file, not inline) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface ManagerReservationsFormValues {
  tableId:      string;
  customerName: string;
  phone:        string;
  guestCount:   number;
  slotTime:     string; // datetime-local string "YYYY-MM-DDTHH:MM"
}

// â”€â”€â”€ Tab Type (Rule 35: No inline string literals) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type ManagerReservationsTab = "UPCOMING" | "PAST";

// â”€â”€â”€ Hook Return Interface â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface UseOwnerReservationsReturn {
  upcoming:          AppReservation[];
  past:              AppReservation[];
  availableTables:   AppTable[];
  isSubmitting:      boolean;
  cancellingId:      string | null;
  addReservation:    (values: ManagerReservationsFormValues) => void;
  cancelReservation: (id: string) => void;
}

// â”€â”€â”€ Component Prop Interfaces â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface ManagerReservationsTableProps {
  manager_reservations: AppReservation[];
  tab:          ManagerReservationsTab;
  cancellingId: string | null;
  onCancel:     (id: string) => void;
}

export interface ManagerReservationsFormModalProps {
  isOpen:          boolean;
  availableTables: AppTable[];
  isSubmitting:    boolean;
  onSubmit:        (values: ManagerReservationsFormValues) => void;
  onClose:         () => void;
}
