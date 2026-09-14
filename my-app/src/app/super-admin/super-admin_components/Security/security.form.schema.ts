import { z } from 'zod';

export const securityFormSchema = z.object({
  enforce2FA: z.boolean(),
  sessionTimeoutMinutes: z.number().min(5, 'Minimum timeout is 5 minutes').max(1440, 'Maximum timeout is 1440 minutes (24h)'),
  maxFailedLoginAttempts: z.number().min(3, 'Must allow at least 3 attempts').max(10, 'Cannot exceed 10 attempts'),
});

export type SecurityFormValues = z.infer<typeof securityFormSchema>;
