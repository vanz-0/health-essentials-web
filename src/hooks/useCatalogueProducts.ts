import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CatalogueProduct {
  id: string;
  name: string;
  price: number | string;
  image: string;
  description: string;
  fun_fact: string;
  category?: string;
  image_number?: string;
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
        // Parse price and adjust to odd numbers
        const priceMatch = item['Estimated Price (KES)']?.match(/\d+/);
        let basePrice = priceMatch ? parseInt(priceMatch[0]) : 0;
        
        // Convert to attractive odd pricing
        const adjustPrice = (price: number) => {
          if (price === 0) return 679;
          if (price >= 1500) return Math.floor(price / 100) * 100 - 1; // e.g., 1500 -> 1499
          if (price >= 1000) return Math.floor(price / 100) * 100 + 99; // e.g., 1100 -> 1099
          if (price >= 500) return Math.floor(price / 50) * 50 + 49; // e.g., 800 -> 849
          return Math.floor(price / 10) * 10 + 9; // e.g., 320 -> 329
        };
        
        const numericPrice = adjustPrice(basePrice);
        
        // Randomize ratings between 4.0 and 4.9
        const ratings = [4.0, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 4.9];
        const randomRating = ratings[item.id % ratings.length];
        
        return {
          id: item.id.toString(),
          name: item.Name,
          price: numericPrice,
          priceDisplay: `KSh ${numericPrice.toLocaleString()}`,
          image: item.Product_poto_link || '/placeholder.svg',
          description: item.description || '',
          fun_fact: item.fun_fact || '',
          category: item.category?.toLowerCase(),
          image_number: item.image_number,
          rating: randomRating,
          sale: index % 5 === 0, // Mark every 5th product as on sale
        };
      }) as CatalogueProduct[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}
