// RESPONSIBILITY: Server-side entry point for Manager Data page.
// DATA FLOW: Server -> ManagerDataClient

import ManagerDataClient from './ManagerDataClient';

export default function DataPage() {
  return <ManagerDataClient />;
}
