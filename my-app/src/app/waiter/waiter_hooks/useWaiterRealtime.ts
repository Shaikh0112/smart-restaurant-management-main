// DATA FLOW: Simulated WebSocket → React Query Invalidation
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { waiterKeys } from './useWaiterQueries';

export function useWaiterRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Simulate incoming KDS updates or service requests every 30 seconds
    const intervalId = setInterval(() => {
      // In a real app, this would be a socket.on('event', ...)
      queryClient.invalidateQueries({ queryKey: waiterKeys.orders() });
      queryClient.invalidateQueries({ queryKey: waiterKeys.serviceRequests() });
    }, 30000);

    return () => clearInterval(intervalId);
  }, [queryClient]);
}
