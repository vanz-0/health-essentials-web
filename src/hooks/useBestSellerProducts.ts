import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/home/BestSellers";

export function useBestSellerProducts() {
  return useQuery({
    queryKey: ["best-seller-products"],
    queryFn: async () => {
      // Step 1: Get active best seller product numbers
      const { data: config, error: configError } = await supabase
        .from("best_sellers_config")
        .select("product_num")
        .eq("active", true)
        .order("display_order", { ascending: true });

      if (configError) throw configError;
      
      // If no best sellers configured, fetch random products
      if (!config || config.length === 0) {
        const { data: randomProducts, error: randomError } = await supabase
          .from("Catalogue1")
          .select("*")
          .limit(8);
        
        if (randomError) throw randomError;
        if (!randomProducts) return [];
        
        // Shuffle and transform random products
        const shuffled = [...randomProducts].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 8).map((item, index) => {
          const productNum = item["Product Num"] || "";
          const imageNumber = productNum.match(/\d+/)?.[0] || "1";
          const seed = productNum.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const rating = 4.0 + (seed % 11) / 10;

          return {
            id: productNum,
            name: item["Product Name"] || "Product",
            price: item.Price || 0,
            priceDisplay: `KES ${(item.Price || 0).toLocaleString()}`,
            image: `https://syymqotfxkmchtjsmhkr.supabase.co/storage/v1/object/public/Cosmetics%20Photos/${imageNumber}.png`,
            rating: Number(rating.toFixed(1)),
            sale: index < 3, // First 3 products are Holiday Deals
            category: item["Product Type"] || undefined,
            product_type: item["Product Type"] || undefined,
            productNum: productNum,
            productType: item["Product Type"] || undefined,
            size: item.Size || undefined,
            useCase: item["Use case"] || undefined,
            copy: item["Attatchment Copy"] || undefined,
            instructions: item["Attatchment Instructions"] || undefined,
            funFact: item["Attatchment funfact"] || undefined,
          };
        });
      }

      // Step 2: Fetch only those specific products from Catalogue1
      const productNums = config.map(c => c.product_num);
      const { data: catalogueData, error: catalogueError } = await supabase
        .from("Catalogue1")
        .select("*")
        .in("Product Num", productNums);

      if (catalogueError) throw catalogueError;
      if (!catalogueData) return [];

      // Step 3: Transform to Product format with proper ordering
      const products: Product[] = catalogueData.map((item, index) => {
        const productNum = item["Product Num"] || "";
        const imageNumber = productNum.match(/\d+/)?.[0] || "1";
        
        // Calculate a rating between 4.0-5.0 based on product number
        const seed = productNum.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const rating = 4.0 + (seed % 11) / 10;

        return {
          id: productNum,
          name: item["Product Name"] || "Product",
          price: item.Price || 0,
          priceDisplay: `KES ${(item.Price || 0).toLocaleString()}`,
          image: `https://syymqotfxkmchtjsmhkr.supabase.co/storage/v1/object/public/Cosmetics%20Photos/${imageNumber}.png`,
          rating: Number(rating.toFixed(1)),
          sale: index < 3, // First 3 products in display order are Holiday Deals
          category: item["Product Type"] || undefined,
          product_type: item["Product Type"] || undefined,
          productNum: productNum,
          productType: item["Product Type"] || undefined,
          size: item.Size || undefined,
          useCase: item["Use case"] || undefined,
          copy: item["Attatchment Copy"] || undefined,
          instructions: item["Attatchment Instructions"] || undefined,
          funFact: item["Attatchment funfact"] || undefined,
        };
      });

      // Maintain the order from best_sellers_config
      const orderedProducts = productNums
        .map(num => products.find(p => p.productNum === num))
        .filter((p): p is Product => p !== undefined);

      // Mark first 3 products (in display order) as Holiday Deals
      return orderedProducts.map((p, index) => ({
        ...p,
        sale: index < 3
      }));
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}
