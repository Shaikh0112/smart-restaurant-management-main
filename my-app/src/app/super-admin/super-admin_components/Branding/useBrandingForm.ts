import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandingFormSchema, type BrandingFormValues } from './branding.form.schema';
import { useEffect } from 'react';
import type { TenantBranding } from '@/app/super-admin/super-admin_types/branding_types';

interface UseBrandingFormProps {
  initialBranding: TenantBranding;
  onSubmit: (data: BrandingFormValues) => void;
  onAutoSave?: (data: Partial<BrandingFormValues>) => void;
}

export function useBrandingForm({ initialBranding, onSubmit, onAutoSave }: UseBrandingFormProps) {
  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingFormSchema),
    defaultValues: {
      isWhiteLabelEnabled: initialBranding.isWhiteLabelEnabled,
      customDomain: initialBranding.customDomain || '',
      logoUrl: initialBranding.logoUrl || '',
      primaryColor: initialBranding.primaryColor || '#000000',
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });
  
  // Watch for changes to update local state dynamically without full submission
  useEffect(() => {
    if (!onAutoSave) return;
    const subscription = form.watch((value, { name }) => {
      if (name) {
         onAutoSave({ [name]: value[name as keyof typeof value] });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onAutoSave]);

  return { form, handleSubmit };
}
