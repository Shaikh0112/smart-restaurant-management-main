// RESPONSIBILITY: Service for recording order events in the Waiter module.

export function recordOrderEvent(event: {
  orderId: string;
  type: string;
  message: string;
  actorRole: "WAITER" | "KITCHEN" | "CASHIER" | "SYSTEM";
}) {
  console.log(`[EVENT: ${event.type}] Order ${event.orderId}: ${event.message} (by ${event.actorRole})`);
  // In a real implementation, this would save the event to the order's history in the database.
}
