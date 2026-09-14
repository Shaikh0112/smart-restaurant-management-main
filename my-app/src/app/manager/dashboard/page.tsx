// RESPONSIBILITY: Server-side entry point for Manager Dashboard page.
// DATA FLOW: Server -> ManagerDashboardClient

import ManagerDashboardClient from './ManagerDashboardClient';

export default function DashboardPage() {
  return <ManagerDashboardClient />;
}
