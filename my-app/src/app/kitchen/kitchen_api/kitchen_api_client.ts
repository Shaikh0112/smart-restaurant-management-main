// RESPONSIBILITY: Centralized API client for Kitchen Module.
// Provides standardized fetch methods, error interception, and ApiResponse<T> interface.

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

// Helper to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function kitchenApiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // In actual production, you would attach headers like Authorization or x-tenant-id here.
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || result.error || 'Unknown API Error');
    }

    return result as ApiResponse<T>;
  } catch (error) {
    // Centralized error interception (replaces random console.errors in UI)
    const errorMessage = error instanceof Error ? error.message : 'Unknown Network Error';
    
    // Instead of console.error, we could send this to an observability service (Sentry, Datadog)
    // kitchenMonitoring.captureException(error, { endpoint, options });
    
    throw new Error(errorMessage);
  }
}
