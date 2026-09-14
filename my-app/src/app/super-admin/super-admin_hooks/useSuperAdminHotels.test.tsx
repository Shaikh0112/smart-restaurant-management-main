import { renderHook, waitFor } from '@testing-library/react';
import { useSuperAdminHotels } from './useSuperAdminHotels';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { expect, test, describe, vi } from 'vitest';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/super-admin/hotels',
  useSearchParams: () => new URLSearchParams(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useSuperAdminHotels', () => {
  test('fetches and returns hotels from MSW mock', async () => {
    const { result } = renderHook(() => useSuperAdminHotels(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tenants.length).toBeGreaterThan(0);
    expect(result.current.filteredTenants.length).toBeGreaterThan(0);
  });
});
