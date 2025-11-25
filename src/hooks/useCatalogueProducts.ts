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
  productNum?: string;
  copy?: string;
  funFact?: string;
}

export function useCatalogueProducts() {
  return useQuery({
    queryKey: ['catalogue-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Catalogue1')
        .select('*');
      
      if (error) throw error;
      if (!data) return [];
      
      // Transform to match Product interface used throughout the app
      return data.map((item, index) => {
        const productNum = item['Product Num'];
        const price = Number(item.Price) || 0;
        
        // Construct image URL from Product Num using Supabase storage
        const imageUrl = productNum 
          ? `https://syymqotfxkmchtjsmhkr.supabase.co/storage/v1/object/public/Cosmetics%20Photos/${productNum}`
          : '/placeholder.svg';
        
        // Randomize ratings between 4.0 and 4.9
        const ratings = [4.0, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 4.9];
        const seed = productNum ? productNum.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) : index;
        const randomRating = ratings[seed % ratings.length];
        
        return {
          id: productNum || `product-${index}`,
          name: item['Product Name'] || 'Unnamed Product',
          price: price,
          priceDisplay: `KSh ${price.toLocaleString()}`,
          image: imageUrl,
          description: item['Attatchment Copy'] || '',
          fun_fact: item['Attatchment funfact'] || '',
          category: item['Product Type']?.toLowerCase(),
          product_type: item['Product Type'],
          size: item.Size,
          use_case: item['Use case'],
          instructions: item['Attatchment Instructions'],
          rating: randomRating,
          sale: index % 5 === 0,
          productNum: productNum,
          copy: item['Attatchment Copy'],
          funFact: item['Attatchment funfact'],
        };
      }) as CatalogueProduct[];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
