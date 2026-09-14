import { CashierOrchestrator } from "./cashier_components/CashierOrchestrator";

// RESPONSIBILITY: Cashier POS Server Component Shell (AI Isolation).
export default function CashierPage() {
  return (
    <div className="min-h-screen bg-page text-text-primary p-4 sm:p-6 lg:p-8">
      <CashierOrchestrator />
    </div>
  );
}
