import { http, HttpResponse } from 'msw';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

const MOCK_BASE_URL = 'http://localhost:3000/api/v1/cashier';

export const cashierHandlers = [
  // 1. Fetch active tables
  http.get(`${MOCK_BASE_URL}/tables`, () => {
    return HttpResponse.json<ApiResponse<any>>({
      success: true,
      message: 'Tables fetched successfully',
      data: [
        { id: 't1', tableNumber: 'T1', status: 'AVAILABLE', orderType: 'DINE_IN' },
        { id: 't2', tableNumber: 'T2', status: 'OCCUPIED', orderType: 'DINE_IN' }
      ]
    });
  }),

  // 2. Checkout (Safe Financial Mutation)
  http.post(`${MOCK_BASE_URL}/checkout`, async ({ request }) => {
    const payload = await request.json();
    return HttpResponse.json<ApiResponse<any>>({
      success: true,
      message: 'Checkout completed successfully',
      data: {
        receiptId: 'REC-' + Math.floor(Math.random() * 100000),
        status: 'PAID'
      }
    });
  }),

  // 3. Payment Verification
  http.post(`${MOCK_BASE_URL}/payment/verify-upi`, async () => {
    return HttpResponse.json<ApiResponse<any>>({
      success: true,
      message: 'UPI Payment Verified',
      data: { verified: true }
    });
  }),

  // 4. Auth Verification
  http.post(`${MOCK_BASE_URL}/auth/verify-manager-pin`, async ({ request }) => {
    const { pin } = await request.json() as any;
    if (pin === '1234' || pin === '9999') {
      return HttpResponse.json<ApiResponse<any>>({ success: true, message: 'Authorized' });
    }
    return HttpResponse.json<ApiResponse<any>>({ success: false, message: 'Invalid PIN' }, { status: 403 });
  }),
];
