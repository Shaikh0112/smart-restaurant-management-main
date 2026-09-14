// RESPONSIBILITY: Server-side entry point for Manager Inventory page.
// DATA FLOW: Server -> ManagerInventoryClient

import ManagerInventoryClient from './ManagerInventoryClient';

export default function InventoryPage() {
  return <ManagerInventoryClient />;
}
