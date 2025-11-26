import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BestSellerConfig {
  id: string;
  product_num: string;
  display_order: number;
  active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useBestSellers() {
  return useQuery({
    queryKey: ["best-sellers-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("best_sellers_config")
        .select("*")
        .eq("active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as BestSellerConfig[];
    },
  });
}
