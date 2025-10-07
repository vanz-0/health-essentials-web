import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export type UserSettings = {
  id: number;
  user_id: string;
  theme: string | null;
  language: string | null;
  timezone: string | null;
  email_verified: boolean | null;
  phone_verified: boolean | null;
  marketing_emails: boolean | null;
  notification_preferences: any;
  two_factor_enabled: boolean | null;
  two_factor_method: string | null;
  last_password_change: string | null;
  require_password_change: boolean | null;
  failed_login_attempts: number | null;
  locked_until: string | null;
  created_at: string;
  updated_at: string;
};

export const useUserSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["user-settings", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as UserSettings | null;
    },
    enabled: !!user,
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: Partial<UserSettings>) => {
      if (!user) throw new Error("User not authenticated");

      const { id, created_at, updated_at, user_id, ...safeUpdates } = updates as any;
      
      const { data, error } = await supabase
        .from("user_settings")
        .upsert([{
          user_id: user.id,
          ...safeUpdates,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings", user?.id] });
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate,
    isUpdating: updateSettings.isPending,
  };
};
