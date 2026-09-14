# Cashier Theme Contract

This document maps all used Tailwind CSS tokens in the Cashier Module to ensure 100% compliance with the `global_design_system.md`.

## Colors
- **Backgrounds**: `--bg-surface`, `--bg-card`, `--bg-floating` for nested panels and modals.
- **Text**: `text-primary`, `text-secondary`, `text-muted`.
- **Status (via `statusBadgeConfig.ts`)**:
  - Success: `text-success`, `bg-success-bg`, `border-success/30`
  - Warning: `text-warning`, `bg-warning-bg`, `border-warning/30`
  - Danger: `text-danger`, `bg-danger-bg`, `border-danger/30`
  - Info: `text-info`, `bg-info-bg`, `border-info/30`

## Payment Modes
- **Cash**: `--pay-cash` (mapped to Emerald derivatives)
- **UPI**: `--pay-upi` (mapped to Purple/Indigo derivatives)
- **Card**: `--pay-card` (mapped to Blue derivatives)

## Sizing & Layout
- **Text Sizes**: Restricted strictly to standard Tailwind typography tokens (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`). Zero arbitrary pixel sizes (`text-[11px]`).
- **Icons**: Lucide Icons use `size={18}` and `strokeWidth={2}`.
- **Radius**: Modals use `--radius-xl` (`rounded-xl`), nested cards use `--radius-lg` (`rounded-lg`).

## Interactions & Accessibility
- **Focus**: `focus-visible:ring-2` to support keyboard navigation.
- **Motion**: All transitions are guarded with `motion-safe:transition-all` to respect system accessibility preferences.
