# Kitchen Features & Architecture Documentation

## Overview
This module is strictly isolated to the **kitchen** role in the Smart Restaurant Management system. In accordance with the project's **Total Role Isolation** architecture, this folder contains all pages, components, hooks, and types specifically built for the kitchen. This prevents cross-role bugs and AI hallucinations by isolating role-specific UI and logic.

## Directory Structure
- **kitchen_api/**: Contains `kitchen_api_client.ts` with standardized `fetch` wrappers and `ApiResponse<T>` error boundaries.
- **kitchen_components/**: Contains all React components used exclusively by this module. Files are strictly micro-modularized and capped in size to ensure single-responsibility (e.g. `KitchenKotCard` is split into Header, Actions, Item).
- **kitchen_hooks/**: Contains TanStack React Query hooks (`useKitchenKotQuery`, `useKitchenStockMutations`) and complex business logic. The `.tsx` components are purely view layers.
- **kitchen_types/**: Centralized TypeScript interfaces. Types are extracted into specific domains (`KitchenKdsTypes`, `KitchenMenuTypes`, `KitchenInventoryTypes`) and aggregated via `KitchenTypes.ts`.

## Core Features & Pages
- **/** (Kitchen Display System): The main KDS for active tracking of KOTs (Pending, Cooking, Ready). Re-architected with sub-components for high readability.
- **/inventory**: Stock and inventory management, tracking raw materials, low stock alerts, and generating printable Supplier POs.
- **/menu**: Menu and item master management, covering pricing, categories, combos, and recipe specifications. Modals use `react-hook-form` + `zod` for robust client-side validation.

## Centralized Data & State Management
- **Network & State**: Replaced raw `localStorage` with **TanStack React Query** for robust, cacheable, asynchronous data fetching.
- **Mock Service Worker (MSW)**: API calls are mocked using MSW (`src/mocks/handlers/kitchen.handlers.ts`). This allows pure UI iteration without needing a real backend.
- **Error Monitoring**: Wrapped in `KitchenErrorBoundary.tsx` to trap component crashes and show a graceful fallback UI instead of crashing the entire React tree.

## Strict Architectural Rules (AI & Developer Instructions)
1. **Micro-Modularization & File Size Ceilings**: Every file must contain only one React component. Files should strictly not exceed ~300 lines.
2. **Total Role Isolation**: Never import business components from other roles.
3. **Hyper-Descriptive Naming**: Ensure new components strictly adhere to the `Kitchen[ComponentName]` naming convention. 
4. **Separation of Logic and UI**: Keep heavy logic inside `_hooks`. Use `react-hook-form` for form state instead of controlled `useState` inputs.
5. **Interface Isolation**: All TypeScript definitions must go into the centralized `_types` directory. Do not define complex Types inline.
6. **Theme Independence (No Inline Colors)**: Never use arbitrary Tailwind bracket colors (e.g., `bg-[#1A1A2E]`). Strictly use semantic tokens (`bg-card`, `bg-page`, `text-primary`).
7. **Server vs. Client Components**: `page.tsx` files are Server Components. Push `"use client"` directives down to the Orchestrator or micro-modularized leaf components.
8. **Absolute Imports Only**: Always use absolute imports (`@/app/...`).
9. **Z-Index & Elevations**: Strictly adhere to standardized z-indexes (e.g. `z-50` for modals). No arbitrary `z-[9990]`.
10. **Loaders & Fallbacks**: Every mutation/submit action must feature a `Loader2` spinning icon and disable the submit button while `isSubmitting` is true.
