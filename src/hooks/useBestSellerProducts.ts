import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/home/BestSellers";

// Calculate week number since epoch for deterministic shuffling
const getWeekSeed = () => {
  const epochStart = new Date('2024-01-01').getTime();
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  return Math.floor((now - epochStart) / weekMs);
};

// Seeded random number generator (Mulberry32)
const seededRandom = (seed: number) => {
  return () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Deterministic shuffle using seeded random
const seededShuffle = <T,>(array: T[], seed: number): T[] => {
  const shuffled = [...array];
  const random = seededRandom(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Transform catalogue item to Product format
const transformToProduct = (item: Record<string, unknown>): Product => {
  const productNum = (item["Product Num"] as string) || "";
  const imageNumber = productNum.match(/\d+/)?.[0] || "1";
  const seed = productNum.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = 4.0 + (seed % 11) / 10;

  return {
    id: productNum,
    name: (item["Product Name"] as string) || "Product",
    price: (item.Price as number) || 0,
    priceDisplay: `KES ${((item.Price as number) || 0).toLocaleString()}`,
    image: `https://syymqotfxkmchtjsmhkr.supabase.co/storage/v1/object/public/Cosmetics%20Photos/${imageNumber}.png`,
    rating: Number(rating.toFixed(1)),
    sale: false,
    category: (item["Product Type"] as string) || undefined,
    product_type: (item["Product Type"] as string) || undefined,
    productNum: productNum,
    productType: (item["Product Type"] as string) || undefined,
    size: (item.Size as string) || undefined,
    useCase: (item["Use case"] as string) || undefined,
    copy: (item["Attatchment Copy"] as string) || undefined,
    instructions: (item["Attatchment Instructions"] as string) || undefined,
    funFact: (item["Attatchment funfact"] as string) || undefined,
  };
};

export function useBestSellerProducts() {
  const weekSeed = getWeekSeed();
  
  return useQuery({
    queryKey: ["best-seller-products", weekSeed],
    queryFn: async () => {
      // Fetch a larger pool of products for weekly rotation
      const { data: allProducts, error: productsError } = await supabase
        .from("Catalogue1")
        .select("*")
        .limit(32);

      if (productsError) throw productsError;
      if (!allProducts || allProducts.length === 0) return [];

      // Get configured best sellers for priority weighting
      const { data: config } = await supabase
        .from("best_sellers_config")
        .select("product_num")
        .eq("active", true)
        .order("display_order", { ascending: true });

      const configuredNums = new Set(config?.map(c => c.product_num) || []);
      
      // Separate configured and non-configured products
      const configuredProducts: Product[] = [];
      const otherProducts: Product[] = [];
      
      allProducts.forEach(item => {
        const product = transformToProduct(item);
        if (configuredNums.has(product.productNum || '')) {
          configuredProducts.push(product);
        } else {
          otherProducts.push(product);
        }
      });

      // Apply weekly seeded shuffle to both groups
      const shuffledConfigured = seededShuffle(configuredProducts, weekSeed);
      const shuffledOthers = seededShuffle(otherProducts, weekSeed + 1000);

      // Interleave: prioritize configured products (take more from configured pool)
      const result: Product[] = [];
      let configIdx = 0;
      let otherIdx = 0;
      
      // Take 5 from configured, 3 from others (or fill from what's available)
      for (let i = 0; i < 8; i++) {
        if (i < 5 && configIdx < shuffledConfigured.length) {
          result.push(shuffledConfigured[configIdx++]);
        } else if (otherIdx < shuffledOthers.length) {
          result.push(shuffledOthers[otherIdx++]);
        } else if (configIdx < shuffledConfigured.length) {
          result.push(shuffledConfigured[configIdx++]);
        }
      }

      // Fill any remaining slots
      while (result.length < 8 && configIdx < shuffledConfigured.length) {
        result.push(shuffledConfigured[configIdx++]);
      }
      while (result.length < 8 && otherIdx < shuffledOthers.length) {
        result.push(shuffledOthers[otherIdx++]);
      }

      // Mark first 3 products as Holiday Deals
      return result.map((p, index) => ({
        ...p,
        sale: index < 3
      }));
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}
