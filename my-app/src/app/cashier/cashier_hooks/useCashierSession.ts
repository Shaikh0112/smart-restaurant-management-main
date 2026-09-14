// RESPONSIBILITY: useCashierSession module logic and UI.
// DATA FLOW: Local component state -> External API
export interface CashierSession {
  user: {
    id: string;
    name: string;
    role: string;
  };
  tenant: {
    id: string;
    name: string;
    address: string;
    gstin: string;
    merchantUpi: string;
  };
}

// Temporary mock implementation until integrated with full auth architecture
export function useCashierSession(): CashierSession {
  return {
    user: {
      id: "auth-user-01",
      name: "Cashier Active",
      role: "CASHIER",
    },
    tenant: {
      id: "tenant-01",
      name: "Royal Spice Bistro",
      address: "123, MG Road, Bengaluru - 560001",
      gstin: "29ABCDE1234F1Z5",
      merchantUpi: "merchant@tenant.upi",
    }
  };
}
