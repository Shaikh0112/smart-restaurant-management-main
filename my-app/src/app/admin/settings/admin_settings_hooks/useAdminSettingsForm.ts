// RESPONSIBILITY: State management and business logic for AdminSettingsForm.
// DATA FLOW: localStorage -> Hook State -> Components

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { adminSettingsSchema, type AdminSettingsFormValues } from "../admin_settings_types/admin_settings.schema";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import { showToast } from "@/lib/toastService";
import type { AppRestaurantSettings } from "@/types/appTypes";

export function useAdminSettingsForm() {
  const [settings, setSettings] = useLocalStorage<AppRestaurantSettings>(
    STORAGE_KEYS.RESTAURANT_SETTINGS,
    {} as AppRestaurantSettings
  );

  const form = useForm<AdminSettingsFormValues>({
    resolver: zodResolver(adminSettingsSchema),
    defaultValues: settings || {},
  });

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      form.reset(settings);
    }
  }, [settings, form]);

  const onSubmit = (data: AdminSettingsFormValues) => {
    setSettings(data as AppRestaurantSettings);
    showToast({
      type: "success",
      title: "Settings Saved",
      message: "Master restaurant settings updated successfully!",
    });
  };

  return { form, onSubmit };
}
