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
      return data.map(item => {
        // Parse price - it's stored as text like "Ksh 800 - Ksh 1100"
        // Extract first number for filtering/sorting
        const priceMatch = item['Estimated Price (KES)']?.match(/\d+/);
        const numericPrice = priceMatch ? parseInt(priceMatch[0]) : 0;
        
        return {
          id: item.id.toString(),
          name: item.Name,
          price: numericPrice,
          priceDisplay: item['Estimated Price (KES)'] || 'Contact for pricing',
          image: item.Product_poto_link || '/placeholder.svg',
          description: item.description || '',
          fun_fact: item.fun_fact || '',
          category: item.category?.toLowerCase(),
          image_number: item.image_number,
          rating: 4.5, // Default rating
          sale: false,
        };
      }) as CatalogueProduct[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}
