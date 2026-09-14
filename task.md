# Cashier Module Refactoring Plan

- [x] Part 1-6 (Assumed completed previously)
- [x] 7. Split `useCashierCheckout.ts` into multiple focused hooks (inventory, sales, CRM, order, table, audit, notification).
- [x] 8. Implement a backend-authoritative transaction wrapper to ensure atomic success of these mutations.
- [x] 9. Remove the hardcoded Cashier ID (`staff-01`), restaurant name, and `/waiter` route.
- [x] 10. Replace the boolean `isProcessing` with standard `FetchState = "idle" | "loading" | "success" | "error"`.
