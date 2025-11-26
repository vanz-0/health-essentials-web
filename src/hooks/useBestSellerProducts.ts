import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/home/BestSellers";

export function useBestSellerProducts() {
  return useQuery({
    queryKey: ["best-seller-products"],
    queryFn: async () => {
      // Step 1: Try to get configured best sellers
      const { data: config, error: configError } = await supabase
        .from("best_sellers_config")
        .select("product_num")
        .eq("active", true)
        .order("display_order", { ascending: true });

      if (configError) {
        console.error("Error fetching best sellers config:", configError);
      }

      let catalogueData;
      
      // Step 2: If best sellers are configured, fetch those specific products
      if (config && config.length > 0) {
        const productNums = config.map(c => c.product_num);
        const { data, error: catalogueError } = await supabase
          .from("Catalogue1")
          .select("*")
          .in("Product Num", productNums);

        if (catalogueError) {
          console.error("Error fetching configured best sellers:", catalogueError);
        } else {
          catalogueData = data;
        }
      }
      
      // Step 3: Fallback - if no configured best sellers or fetch failed, get products under 1000 KES
      if (!catalogueData || catalogueData.length === 0) {
        const { data, error: fallbackError } = await supabase
          .from("Catalogue1")
          .select("*")
          .lt("Price", 1000)
          .order("Price", { ascending: true })
          .limit(8);

        if (fallbackError) {
          console.error("Error fetching fallback products:", fallbackError);
          return [];
        }
        catalogueData = data;
      }

      if (!catalogueData || catalogueData.length === 0) return [];

      // Step 4: Transform to Product format
      const products: Product[] = catalogueData.map((item) => {
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
          sale: false,
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

      // Maintain the order from best_sellers_config if applicable
      if (config && config.length > 0) {
        const productNums = config.map(c => c.product_num);
        const orderedProducts = productNums
          .map(num => products.find(p => p.productNum === num))
          .filter((p): p is Product => p !== undefined);
        
        return orderedProducts.length > 0 ? orderedProducts : products;
      }

      return products;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}

