// RESPONSIBILITY: cashier_api module logic and UI.
import { cashierApiClient } from './cashier_api_client';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

// API Verbs as per Rule 72
export const cashierApi = {
  fetchCashierTables: async (): Promise<ApiResponse<any>> => {
    return cashierApiClient.get('/tables');
  },
  fetchCashierOrders: async (): Promise<ApiResponse<any>> => {
    return cashierApiClient.get('/orders');
  },
  fetchCashierMenu: async (): Promise<ApiResponse<any>> => {
    return cashierApiClient.get('/menu');
  },
  fetchCashierServiceRequests: async (): Promise<ApiResponse<any>> => {
    return cashierApiClient.get('/service-requests');
  },
  fetchCashierShiftMetrics: async (): Promise<ApiResponse<any>> => {
    return cashierApiClient.get('/shift/metrics');
  },
  checkoutCashierOrder: async (payload: any): Promise<ApiResponse<any>> => {
    return cashierApiClient.post('/checkout', payload);
  }
};
