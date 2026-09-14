// RESPONSIBILITY: Defines the strict API response contract for the Waiter module.

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  error?: string;
  statusCode?: number;
}
