import { z } from 'zod';

export const brandingFormSchema = z.object({
  isWhiteLabelEnabled: z.boolean(),
  customDomain: z.string().optional(),
  logoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color code'),
});

export type BrandingFormValues = z.infer<typeof brandingFormSchema>;
