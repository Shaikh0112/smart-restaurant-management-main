import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { broadcastFormSchema, type BroadcastFormValues } from './broadcasts.form.schema';

interface UseNewBroadcastFormProps {
  onSubmit: (data: BroadcastFormValues) => void;
}

export function useNewBroadcastForm({ onSubmit }: UseNewBroadcastFormProps) {
  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastFormSchema),
    defaultValues: {
      title: '',
      message: '',
      priority: 'info',
      targetAudience: 'all'
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    form.reset();
  });

  return {
    form,
    handleSubmit
  };
}
