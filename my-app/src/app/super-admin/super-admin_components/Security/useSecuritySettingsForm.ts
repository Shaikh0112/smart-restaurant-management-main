import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { securityFormSchema, type SecurityFormValues } from './security.form.schema';
import { useEffect } from 'react';
import type { SecuritySettings } from '@/app/super-admin/super-admin_types/security_types';

interface UseSecuritySettingsFormProps {
  initialSettings: SecuritySettings;
  onSubmit: (data: SecurityFormValues) => void;
}

export function useSecuritySettingsForm({ initialSettings, onSubmit }: UseSecuritySettingsFormProps) {
  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      enforce2FA: initialSettings.enforce2FA,
      sessionTimeoutMinutes: initialSettings.sessionTimeoutMinutes,
      maxFailedLoginAttempts: initialSettings.maxFailedLoginAttempts,
    }
  });

  // Watch for changes to auto-submit, as per the original design (it called onUpdate immediately)
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name) {
        // We only trigger submit if the specific field is valid
        form.handleSubmit((data) => onSubmit(data))();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onSubmit]);

  return { form };
}
