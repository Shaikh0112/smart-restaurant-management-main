// RESPONSIBILITY: Server Component root for Waiter Booking Flow.
import { WaiterBookingLayout } from "@/app/waiter/waiter_booking_components/WaiterBookingLayout";
import { WaiterBookingForm } from "@/app/waiter/waiter_booking_components/WaiterBookingForm";

export default function WaiterBookingPage() {
  return (
    <WaiterBookingLayout>
      <WaiterBookingForm />
    </WaiterBookingLayout>
  );
}
