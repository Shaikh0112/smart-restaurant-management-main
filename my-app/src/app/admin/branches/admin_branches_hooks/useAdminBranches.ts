import { useState, useEffect } from "react";
import type { AdminBranch } from "@/app/admin/admin_types/AdminBranchesTypes";

// RESPONSIBILITY: Fetch and manage Admin Branches data from API (stubbed via MSW).
export function useAdminBranches() {
  const [branches, setBranches] = useState<AdminBranch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/v1/admin/branches");
        if (!res.ok) throw new Error("Failed to fetch branches");
        const json = await res.json();
        setBranches(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return { branches, isLoading, error };
}
