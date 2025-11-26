import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface LoyaltyPoints {
  id: string;
  user_id: string;
  points_balance: number;
  total_earned: number;
  total_redeemed: number;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyTransaction {
  id: string;
  user_id: string;
  points: number;
  type: "earned" | "redeemed" | "expired";
  order_id?: string;
  description: string;
  created_at: string;
}

export function useLoyaltyPoints() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's loyalty points
  const { data: loyaltyPoints, isLoading: isLoadingPoints } = useQuery({
    queryKey: ["loyalty-points", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("loyalty_points")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as LoyaltyPoints | null;
    },
    enabled: !!user,
  });

  // Fetch user's loyalty transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["loyalty-transactions", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("loyalty_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as LoyaltyTransaction[];
    },
    enabled: !!user,
  });

  // Award points mutation
  const awardPoints = useMutation({
    mutationFn: async ({
      points,
      orderId,
      description,
    }: {
      points: number;
      orderId?: string;
      description: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      // Check if loyalty points record exists
      const { data: existing } = await supabase
        .from("loyalty_points")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("loyalty_points")
          .update({
            points_balance: existing.points_balance + points,
            total_earned: existing.total_earned + points,
          })
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from("loyalty_points")
          .insert({
            user_id: user.id,
            points_balance: points,
            total_earned: points,
          });

        if (insertError) throw insertError;
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from("loyalty_transactions")
        .insert({
          user_id: user.id,
          points,
          type: "earned",
          order_id: orderId,
          description,
        });

      if (transactionError) throw transactionError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-points"] });
      queryClient.invalidateQueries({ queryKey: ["loyalty-transactions"] });
    },
  });

  return {
    loyaltyPoints,
    transactions,
    isLoading: isLoadingPoints || isLoadingTransactions,
    awardPoints: awardPoints.mutate,
    isAwarding: awardPoints.isPending,
  };
}
