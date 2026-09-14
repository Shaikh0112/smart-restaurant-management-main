import { http, HttpResponse } from 'msw';

export const kitchenHandlers = [
  // ---------------------------------------------------------
  // KDS (Kitchen Display System) Endpoints
  // ---------------------------------------------------------
  
  // Get active KOTs
  http.get('/api/kitchen/kots/active', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          kotId: 'KOT-101',
          orderId: 'ORD-5001',
          tableNumber: 'Table 4',
          station: 'Kitchen',
          timestamp: Date.now() - 1000 * 60 * 5, // 5 mins ago
          items: [
            { id: 'item-1', menuItemId: 'm-1', name: 'Paneer Tikka', quantity: 2, status: 'COOKING' },
            { id: 'item-2', menuItemId: 'm-2', name: 'Garlic Naan', quantity: 4, status: 'PENDING' },
          ],
        },
        {
          kotId: 'KOT-102',
          orderId: 'ORD-5002',
          tableNumber: 'Table 7',
          station: 'Bar',
          timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
          priority: 'URGENT',
          items: [
            { id: 'item-3', menuItemId: 'm-3', name: 'Mojito', quantity: 1, status: 'PENDING', notes: 'Less ice' },
          ],
        }
      ]
    });
  }),

  // Get completed KOTs
  http.get('/api/kitchen/kots/completed', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          kotId: 'KOT-099',
          orderId: 'ORD-4999',
          tableNumber: 'Table 2',
          station: 'Kitchen',
          timestamp: Date.now() - 1000 * 60 * 45,
          completedAt: Date.now() - 1000 * 60 * 10,
          items: [
            { id: 'item-4', menuItemId: 'm-4', name: 'Butter Chicken', quantity: 1, status: 'DELIVERED' },
          ],
        }
      ]
    });
  }),

  // Update KOT Item Status
  http.patch('/api/kitchen/kots/:kotId/items/:itemId', async ({ request, params }) => {
    const { kotId, itemId } = params;
    const body = await request.json() as { status: string };
    
    return HttpResponse.json({
      success: true,
      message: `Updated item ${itemId} in ${kotId} to ${body.status}`
    });
  }),

  // Mark full KOT as ready
  http.post('/api/kitchen/kots/:kotId/ready', ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: `KOT ${params.kotId} marked as ready`
    });
  }),

  // Void/Reject Item
  http.post('/api/kitchen/kots/:kotId/items/:itemId/void', ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: `Item ${params.itemId} voided in ${params.kotId}`
    });
  }),

  // Set Prep Time
  http.post('/api/kitchen/kots/:kotId/items/:itemId/preptime', async ({ request, params }) => {
    const body = await request.json() as { mins: number };
    return HttpResponse.json({
      success: true,
      message: `Prep time set to ${body.mins} mins for item ${params.itemId}`
    });
  }),

  // ---------------------------------------------------------
  // Kitchen Inventory Endpoints
  // ---------------------------------------------------------

  http.get('/api/kitchen/inventory', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { id: 'inv-1', name: 'Fresh Paneer', category: 'DAIRY', unit: 'kg', currentStock: 5.5, threshold: 2, expiryDate: '2026-10-01', station: 'Kitchen', lastRestocked: '2026-09-10' },
        { id: 'inv-2', name: 'Chicken Breast', category: 'MEAT', unit: 'kg', currentStock: 1.2, threshold: 5, expiryDate: '2026-09-15', station: 'Kitchen', lastRestocked: '2026-09-11' },
      ]
    });
  }),

  http.post('/api/kitchen/inventory', async ({ request }) => {
    const item = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...item, id: `inv-${Date.now()}` } });
  }),

  http.patch('/api/kitchen/inventory/:id', async ({ request, params }) => {
    const updates = await request.json() as any;
    return HttpResponse.json({ success: true, data: { id: params.id, ...updates } });
  }),

  http.delete('/api/kitchen/inventory/:id', ({ params }) => {
    return HttpResponse.json({ success: true, message: `Deleted ${params.id}` });
  }),

  // ---------------------------------------------------------
  // Kitchen Menu Endpoints
  // ---------------------------------------------------------

  http.get('/api/kitchen/menu', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { id: 'm-1', name: 'Paneer Tikka', category: 'Starters', station: 'Kitchen', price: 280, isAvailable: true, isSpecial: true, variants: [], recipe: null },
        { id: 'm-2', name: 'Garlic Naan', category: 'Breads', station: 'Bakery', price: 60, isAvailable: true, isSpecial: false, variants: [], recipe: null },
      ]
    });
  }),

  http.post('/api/kitchen/menu', async ({ request }) => {
    const item = await request.json() as any;
    return HttpResponse.json({ success: true, data: { ...item, id: `m-${Date.now()}` } });
  }),

  http.patch('/api/kitchen/menu/:id', async ({ request, params }) => {
    const updates = await request.json() as any;
    return HttpResponse.json({ success: true, data: { id: params.id, ...updates } });
  }),

  http.delete('/api/kitchen/menu/:id', ({ params }) => {
    return HttpResponse.json({ success: true, message: `Deleted ${params.id}` });
  }),
];
