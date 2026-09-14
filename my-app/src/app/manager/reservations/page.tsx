// RESPONSIBILITY: Server-side entry point for Manager Reservations page.
// DATA FLOW: Server -> ManagerReservationsClient

import ManagerReservationsClient from './ManagerReservationsClient';

export default function ReservationsPage() {
  return <ManagerReservationsClient />;
}
