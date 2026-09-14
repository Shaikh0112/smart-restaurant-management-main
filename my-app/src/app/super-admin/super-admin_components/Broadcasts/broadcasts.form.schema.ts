import { z } from 'zod';

export const broadcastFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  priority: z.enum(['info', 'warning', 'critical']),
  targetAudience: z.enum(['all', 'active_only', 'specific_tenants'])
});

export type BroadcastFormValues = z.infer<typeof broadcastFormSchema>;
