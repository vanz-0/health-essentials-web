import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export type Address = {
  id: number;
  user_id: string;
  label: string;
  full_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  phone_number: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type AddressInput = Omit<Address, "id" | "user_id" | "created_at" | "updated_at">;

export const useAddresses = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Address[];
    },
    enabled: !!user,
  });

  const addAddress = useMutation({
    mutationFn: async (address: AddressInput) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_addresses")
        .insert({
          ...address,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] });
      toast({
        title: "Address added",
        description: "Your address has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding address",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAddress = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<AddressInput> }) => {
      const { data, error } = await supabase
        .from("user_addresses")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] });
      toast({
        title: "Address updated",
        description: "Your address has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating address",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("user_addresses")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] });
      toast({
        title: "Address deleted",
        description: "Your address has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting address",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const setDefaultAddress = useMutation({
    mutationFn: async (id: number) => {
      if (!user) throw new Error("User not authenticated");

      // First, unset all default addresses
      await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);

      // Then set the new default
      const { error } = await supabase
        .from("user_addresses")
        .update({ is_default: true })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] });
      toast({
        title: "Default address updated",
        description: "This address is now your default.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error setting default address",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    addresses,
    isLoading,
    addAddress: addAddress.mutate,
    updateAddress: updateAddress.mutate,
    deleteAddress: deleteAddress.mutate,
    setDefaultAddress: setDefaultAddress.mutate,
    isAdding: addAddress.isPending,
    isUpdating: updateAddress.isPending,
    isDeleting: deleteAddress.isPending,
  };
};
