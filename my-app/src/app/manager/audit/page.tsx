// RESPONSIBILITY: Server-side entry point for Manager Audit page.
// DATA FLOW: Server -> ManagerAuditClient

import ManagerAuditClient from './ManagerAuditClient';

export default function AuditPage() {
  return <ManagerAuditClient />;
}
