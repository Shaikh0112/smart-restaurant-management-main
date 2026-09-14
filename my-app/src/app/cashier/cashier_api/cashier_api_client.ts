// RESPONSIBILITY: cashier_api_client module logic and UI.
import type { ApiResponse } from './cashier_api';

const MOCK_BASE_URL = '/api/v1/cashier';

async function fetchWithTenant<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  // Simulate fetching active tenant from session/auth (Rule 28)
  const activeTenantId = 'tenant-01'; // Should ultimately come from a centralized session store

  const headers = new Headers(options?.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('x-tenant-id', activeTenantId);

  try {
    const res = await fetch(`${MOCK_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      statusCode: 500
    };
  }
}

export const cashierApiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => fetchWithTenant<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, payload: any, options?: RequestInit) => fetchWithTenant<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(payload) }),
};
