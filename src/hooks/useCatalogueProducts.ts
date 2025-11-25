import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CatalogueProduct {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  image: string;
  description: string;
  fun_fact: string;
  category?: string;
  product_type?: string;
  size?: string;
  use_case?: string;
  instructions?: string;
  rating?: number;
  sale?: boolean;
}

export function useCatalogueProducts() {
  return useQuery({
    queryKey: ['catalogue-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('catalogue')
        .select('*')
        .order('id');
      
      if (error) throw error;
      
      // Transform to match Product interface used throughout the app
      return data.map((item, index) => {
        const price = Number(item.price) || 0;
        
        // Construct image URL from product_num using Supabase storage
        const imageUrl = item.product_num 
          ? `https://syymqotfxkmchtjsmhkr.supabase.co/storage/v1/object/public/Cosmetics%20Photos/${item.product_num}`
          : '/placeholder.svg';
        
        // Randomize ratings between 4.0 and 4.9
        const ratings = [4.0, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 4.9];
        const randomRating = ratings[item.id % ratings.length];
        
        return {
          id: item.id.toString(),
          name: item.name,
          price: price,
          priceDisplay: `KSh ${price.toLocaleString()}`,
          image: imageUrl,
          description: item.product_copy || item.use_case || '',
          fun_fact: item.fun_fact || '',
          category: item.product_type?.toLowerCase(),
          product_type: item.product_type,
          size: item.size,
          use_case: item.use_case,
          instructions: item.instructions,
          rating: randomRating,
          sale: index % 5 === 0, // Mark every 5th product as on sale
        };
      }) as CatalogueProduct[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}
