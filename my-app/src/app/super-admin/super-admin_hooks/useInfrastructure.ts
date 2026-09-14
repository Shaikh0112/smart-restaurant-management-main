// RESPONSIBILITY: Custom hook handling useInfrastructure logic
// DATA FLOW: UI Component -> useInfrastructure -> State/API
import { useState, useEffect } from 'react';
import type { ServerMetrics, DatabaseConnection } from "@/app/super-admin/super-admin_types/infrastructure_types";
import { MOCK_SERVER_METRICS, MOCK_DATABASE_CONNECTIONS } from "@/app/super-admin/super-admin_constants/infrastructure_constants";

/**
 * @description Custom hook for useInfrastructure
 * @returns {object} Hook state and methods
 */
export const useInfrastructure = () => {
  const [metrics, setMetrics] = useState<ServerMetrics>(MOCK_SERVER_METRICS);
  const [databases] = useState<DatabaseConnection[]>(MOCK_DATABASE_CONNECTIONS);

  // Simulate real-time metrics fluctuation
  // AUDIT: Dependency array verified for React bounds
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpuUsage: Math.min(100, Math.max(0, prev.cpuUsage + (Math.random() * 10 - 5))),
        memoryUsage: Math.min(100, Math.max(0, prev.memoryUsage + (Math.random() * 4 - 2))),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    databases
  };
};
