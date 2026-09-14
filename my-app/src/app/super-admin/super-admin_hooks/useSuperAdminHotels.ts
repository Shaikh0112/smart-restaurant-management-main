// RESPONSIBILITY: Custom hook isolating search, filter, and state management for Super Admin Hotels Directory using React Query.
// DATA FLOW: SuperAdminApi -> React Query -> useSuperAdminHotels -> HotelsPage -> SuperAdminHotelsTable

import { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AppTenant } from "@/types/appTypes";
import { SuperAdminApi } from "@/app/super-admin/super-admin_api/super-admin_api";

export function useSuperAdminHotels() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [selectedTenantToSuspend, setSelectedTenantToSuspend] = useState<AppTenant | null>(null);

  // Read URL State
  const search = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "ALL";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortDir = (searchParams.get("sortDir") as "asc" | "desc") || "desc";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  // Update URL helper
  const updateUrlParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.keys(updates).forEach((key) => {
        if (updates[key] === null || updates[key] === "") {
          params.delete(key);
        } else {
          params.set(key, updates[key] as string);
        }
      });
      if (!updates.page && updates.page !== null) {
        params.set("page", "1");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // React Query for data fetching
  const { data, isLoading, error } = useQuery({
    queryKey: ['super-admin', 'hotels', { search, statusFilter, sortBy, sortDir, page, limit }],
    queryFn: () => SuperAdminApi.fetchHotels({ search, status: statusFilter, sortBy, sortDir, page, limit }),
  });

  // React Query mutation for suspend
  const suspendMutation = useMutation({
    mutationFn: (tenantId: string) => SuperAdminApi.suspendHotel(tenantId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'hotels'] });
      setSelectedTenantToSuspend(null);
    },
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      updateUrlParams({ sortDir: sortDir === "asc" ? "desc" : "asc" });
    } else {
      updateUrlParams({ sortBy: field, sortDir: "asc" });
    }
  };

  const handleSuspendTenant = useCallback((tenantId: string) => {
    suspendMutation.mutate(tenantId);
  }, [suspendMutation]);

  return {
    tenants: data?.data || [], 
    filteredTenants: data?.data || [], // Backend handles pagination/filtering now
    pagination: {
      totalItems: data?.meta?.totalItems || 0,
      totalPages: data?.meta?.totalPages || 1,
      currentPage: page,
      limit,
    },
    sorting: { sortBy, sortDir },
    search,
    statusFilter,
    setSearch: (val: string) => updateUrlParams({ search: val }),
    setStatusFilter: (val: string) => updateUrlParams({ status: val }),
    setPage: (val: number) => updateUrlParams({ page: val.toString() }),
    setLimit: (val: number) => updateUrlParams({ limit: val.toString(), page: "1" }),
    handleSort,
    selectedTenantToSuspend,
    setSelectedTenantToSuspend,
    handleSuspendTenant,
    isLoading,
    error,
    isSuspending: suspendMutation.isPending
  };
}
