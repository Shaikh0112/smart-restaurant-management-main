// RESPONSIBILITY: Custom hook handling useJobs logic
// DATA FLOW: UI Component -> useJobs -> State/API
import { useState } from 'react';
import type { BackgroundJob, JobMetrics } from "@/app/super-admin/super-admin_types/jobs_types";
import { MOCK_JOBS, MOCK_JOB_METRICS } from "@/app/super-admin/super-admin_constants/jobs_constants";

/**
 * @description Custom hook for useJobs
 * @returns {object} Hook state and methods
 */
export const useJobs = () => {
  const [jobs, setJobs] = useState<BackgroundJob[]>(MOCK_JOBS);
  const [metrics] = useState<JobMetrics>(MOCK_JOB_METRICS);
  const [isRetrying, setIsRetrying] = useState(false);

  const retryJob = (id: string) => {
    setIsRetrying(true);
    setTimeout(() => {
      setJobs(prev => prev.map(j => 
        j.id === id ? { ...j, status: 'processing', error: undefined } : j
      ));
      setIsRetrying(false);
    }, 1000);
  };

  return {
    jobs,
    metrics,
    isRetrying,
    retryJob
  };
};
