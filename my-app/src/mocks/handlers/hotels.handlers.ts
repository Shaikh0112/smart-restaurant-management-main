import { http, HttpResponse } from 'msw';
import { getStoredTenants } from '@/lib/tenantService';

export const hotelsHandlers = [
  http.get('*/api/v1/hotels', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const status = url.searchParams.get('status') || 'ALL';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    let items = getStoredTenants();
    if (status !== 'ALL') {
      items = items.filter(t => t.status === status);
    }
    if (search) {
      items = items.filter(t => 
        (t.restaurantName || '').toLowerCase().includes(search) ||
        (t.city || '').toLowerCase().includes(search)
      );
    }

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const paginated = items.slice((page - 1) * limit, page * limit);

    return HttpResponse.json({
      success: true,
      message: 'Hotels fetched successfully',
      data: paginated,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        limit
      }
    });
  }),
  
  http.post('*/api/v1/hotels/:id/suspend', ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: 'Hotel suspended successfully',
      data: null
    });
  }),
];
