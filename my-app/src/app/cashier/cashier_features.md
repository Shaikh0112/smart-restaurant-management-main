# Cashier Module Architecture & Features

## Core Architecture
- **Server/Client Segregation**: Strict boundary enforcement. The root `page.tsx` is a React Server Component.
- **State Management**: Handled via `zustand` (`useCashierUIStore`) for layout density and UI states.
- **Data Fetching**: Managed via `@tanstack/react-query` to ensure cache validity, optimistic updates, and background syncing.
- **Modular Hooks**: Large transactional hooks are isolated (e.g. `useCashierCheckout` invokes independent boundaries like `useCheckoutSales` and `useCheckoutInventory`).

## Key Features
1. **Interactive Cart & Order Management**: Real-time KOT syncing, guest splitting (EQUAL / ITEMIZED), and dynamic tax calculations.
2. **Shift Management & Reconciliation**: Secure Z-Report generation with "RECONCILE" type-to-confirm validation.
3. **Advanced Filtering & Pagination**: URL-driven state for Top Items tables to ensure shareability and proper history stack.
4. **Resilience**: `CashierSectionErrorBoundary` prevents full-app crashes when isolated modules fail.
5. **Keyboard Shortcuts**: Power user support via globally registered hotkeys (F2, F4, F8, F9).

## Security Posture
- Total elimination of hardcoded bypass PINs (1234 / 9999).
- Type-To-Confirm destruct validations.
- `useBeforeUnload` protection to prevent accidental unmounting during active checkout processes.
- Masked CRM data (phone numbers) on active displays.
