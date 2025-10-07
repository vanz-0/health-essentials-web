import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type Order = {
  id: string;
  user_id: string | null;
  customer_email: string;
  customer_name: string | null;
  order_items: any;
  shipping_address: any;
  subtotal: number;
  tax_amount: number | null;
  total_amount: number;
  currency: string;
  order_status: string;
  payment_status: string;
  payment_intent_id: string | null;
  stripe_session_id: string | null;
  phone_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const useOrders = (filters?: { status?: string }) => {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.id, filters?.status],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("order_status", filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
  });

  const { data: orderStats } = useQuery({
    queryKey: ["order-stats", user?.id],
    queryFn: async () => {
      if (!user) return { total: 0, processing: 0, shipped: 0, delivered: 0 };

      const { data, error } = await supabase
        .from("orders")
        .select("order_status")
        .eq("user_id", user.id);

      if (error) throw error;

      const stats = {
        total: data.length,
        processing: data.filter((o) => o.order_status === "processing").length,
        shipped: data.filter((o) => o.order_status === "shipped").length,
        delivered: data.filter((o) => o.order_status === "delivered").length,
      };

      return stats;
    },
    enabled: !!user,
  });

  return {
    orders,
    orderStats,
    isLoading,
  };
};

export const useOrderDetails = (orderId: string) => {
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) throw error;
      return data as Order;
    },
    enabled: !!orderId,
  });

  return {
    order,
    isLoading,
  };
};
