import type { AppTenant } from '@/types/appTypes';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: any;
  error?: string;
  statusCode?: number;
}

export const SuperAdminApi = {
  fetchHotels: async (params?: Record<string, any>): Promise<ApiResponse<AppTenant[]>> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          searchParams.append(key, String(params[key]));
        }
      });
    }
    const res = await fetch(`/api/v1/hotels?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch hotels');
    return res.json();
  },
  
  fetchHotelById: async (id: string): Promise<ApiResponse<AppTenant>> => {
    const res = await fetch(`/api/v1/hotels/${id}`);
    if (!res.ok) throw new Error('Failed to fetch hotel');
    return res.json();
  },

  createHotel: async (dto: Partial<AppTenant>): Promise<ApiResponse<AppTenant>> => {
    const res = await fetch('/api/v1/hotels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Failed to create hotel');
    return res.json();
  },

  updateHotel: async (id: string, dto: Partial<AppTenant>): Promise<ApiResponse<AppTenant>> => {
    const res = await fetch(`/api/v1/hotels/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Failed to update hotel');
    return res.json();
  },

  suspendHotel: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetch(`/api/v1/hotels/${id}/suspend`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to suspend hotel');
    return res.json();
  }
};
