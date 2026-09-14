// RESPONSIBILITY: Server-side entry point for Manager Qr page.
// DATA FLOW: Server -> ManagerQrClient

import ManagerQrClient from './ManagerQrClient';

export default function QrPage() {
  return <ManagerQrClient />;
}
