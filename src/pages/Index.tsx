import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import BestSellers from "@/components/home/BestSellers";
import NewArrivals from "@/components/home/NewArrivals";
import Trust from "@/components/home/Trust";
import About from "@/components/home/About";
import Testimonials from "@/components/home/Testimonials";
import FlashBanner from "@/components/home/FlashBanner";
import UrgentDeal from "@/components/home/UrgentDeal";
import Categories from "@/components/home/Categories";
import ChallengeBanner from "@/components/home/ChallengeBanner";
import HotDealsCarousel from "@/components/home/HotDealsCarousel";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useState, useMemo, useEffect } from "react";
import SearchAndFilter, { FilterOptions } from "@/components/shop/SearchAndFilter";
import { fuzzyMatch, parsePriceQuery } from "@/lib/searchUtils";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import ExitIntentModal from "@/components/contact/ExitIntentModal";
import ScrollSlideIn from "@/components/contact/ScrollSlideIn";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { useCatalogueProducts } from "@/hooks/useCatalogueProducts";
import { useBestSellerProducts } from "@/hooks/useBestSellerProducts";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { isEnabled: fomoEnabled } = useFeatureFlag('bit_2_fomo');
  const { isEnabled: filteringEnabled } = useFeatureFlag('bit_4_filtering');
  
  // Fetch optimized best sellers (only 4-8 products)
  const { data: bestSellerProducts = [], isLoading: bestSellersLoading } = useBestSellerProducts();
  
  // Fetch all catalogue products for other sections (Hot Deals, New Arrivals)
  const { data: catalogueProducts = [], isLoading: catalogueLoading, error } = useCatalogueProducts();
  
  const isLoading = bestSellersLoading || catalogueLoading;
  
  // Persisted filters
  const { filters: persistedFilters, setFilters: setPersistedFilters, isLoaded } = usePersistedFilters();
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Partial<FilterOptions>>(
    isLoaded ? persistedFilters : { sortBy: 'name' }
  );
  
  // Update persisted filters when active filters change
  useMemo(() => {
    if (isLoaded) {
      setPersistedFilters(activeFilters);
    }
  }, [activeFilters, isLoaded, setPersistedFilters]);
  
  // Use optimized best sellers from dedicated hook
  const bestSellers = bestSellerProducts;

  const arrivals = useMemo(() => {
    return catalogueProducts.slice(8, 16);
  }, [catalogueProducts]);

  // Auto-rotating hot deals
  const [currentDealIndex, setCurrentDealIndex] = useState(0);
  
  const hotDealsPool = useMemo(() => {
    // Create pairs of deals that will rotate
    const deals = [];
    for (let i = 0; i < Math.min(catalogueProducts.length, 8); i += 2) {
      if (catalogueProducts[i + 1]) {
        deals.push([catalogueProducts[i], catalogueProducts[i + 1]]);
      }
    }
    return deals;
  }, [catalogueProducts]);

  const hotDeals = useMemo(() => {
    if (hotDealsPool.length === 0) return [];
    return hotDealsPool[currentDealIndex % hotDealsPool.length];
  }, [hotDealsPool, currentDealIndex]);

  // Auto-rotate deals every 3 minutes (180 seconds)
  useEffect(() => {
    if (!fomoEnabled || hotDealsPool.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentDealIndex(prev => (prev + 1) % hotDealsPool.length);
    }, 180000); // 3 minutes
    
    return () => clearInterval(interval);
  }, [fomoEnabled, hotDealsPool.length]);

  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (catalogueProducts.length === 0) return { min: 0, max: 10000 };
    const prices = catalogueProducts.map(p => typeof p.price === 'number' ? p.price : 0);
    return {
      min: Math.floor(Math.min(...prices) / 100) * 100,
      max: Math.ceil(Math.max(...prices) / 100) * 100,
    };
  }, [catalogueProducts]);
  
  // Filter and sort products - only apply filters if user has actively searched or filtered
  const filteredProducts = useMemo(() => {
    // If no active search/filter, return all best sellers
    const hasActiveSearch = searchQuery.trim().length > 0;
    const hasActiveCategories = activeFilters.categories && activeFilters.categories.length > 0;
    const hasActivePriceRange = activeFilters.priceRange && 
      (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 10000);
    const hasActiveRating = activeFilters.minRating && activeFilters.minRating > 0;
    const hasActiveFilters = hasActiveSearch || hasActiveCategories || hasActivePriceRange || hasActiveRating || activeFilters.onSale;
    
    // If no active filters, return all best sellers
    if (!hasActiveFilters) {
      return [...bestSellers];
    }
    
    let filtered = [...bestSellers];
    
    // Search filter - enhanced with fuzzy matching and natural language price
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      // Check for natural language price query
      const priceQuery = parsePriceQuery(query);
      if (priceQuery) {
        if (priceQuery.min !== undefined) {
          filtered = filtered.filter(product => {
            const numPrice = typeof product.price === 'number' ? product.price : 0;
            return numPrice >= priceQuery.min!;
          });
        }
        if (priceQuery.max !== undefined) {
          filtered = filtered.filter(product => {
            const numPrice = typeof product.price === 'number' ? product.price : 0;
            return numPrice <= priceQuery.max!;
          });
        }
      } else {
        // Regular text search with fuzzy matching
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          fuzzyMatch(product.name, query) ||
          (product.category && fuzzyMatch(product.category, query))
        );
      }
    }
    
    // Category filter
    if (activeFilters.categories && activeFilters.categories.length > 0) {
      filtered = filtered.filter(product => 
        activeFilters.categories!.includes(product.category || '')
      );
    }
    
    // Price range filter
    if (activeFilters.priceRange) {
      const { min, max } = activeFilters.priceRange;
      filtered = filtered.filter(product => {
        const numPrice = typeof product.price === 'number' ? product.price : 0;
        return numPrice >= min && numPrice <= max;
      });
    }
    
    // Rating filter
    if (activeFilters.minRating) {
      filtered = filtered.filter(product => 
        (product.rating || 0) >= activeFilters.minRating!
      );
    }
    
    // On sale filter
    if (activeFilters.onSale) {
      filtered = filtered.filter(product => product.sale === true);
    }
    
    // In stock filter (for future use - assuming all products are in stock for now)
    // if (activeFilters.inStock) {
    //   filtered = filtered.filter(product => product.inStock !== false);
    // }
    
    // Sort products
    switch (activeFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : 0;
          const priceB = typeof b.price === 'number' ? b.price : 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : 0;
          const priceB = typeof b.price === 'number' ? b.price : 0;
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    return filtered;
  }, [searchQuery, activeFilters, bestSellers]);
  
  // Flash sale ends in 2 hours (example)
  const flashSaleEnd = new Date(Date.now() + 2 * 60 * 60 * 1000);

  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "1Health Essentials",
    image: "https://lovable.dev/opengraph-image-p98pqg.png",
    telephone: "+254735558830",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Brentwood Arcade, Thindiqua",
      addressLocality: "Kiambu",
      addressCountry: "KE",
    },
    url: "/",
  };

  const productJsonLd = bestSellers[0] ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: bestSellers[0].name,
    image: [bestSellers[0].image],
    brand: {
      "@type": "Brand",
      name: "1Health Essentials",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: bestSellers[0].price.toString(),
      availability: "https://schema.org/InStock",
      url: "/#shop",
    },
  } : null;

  // Show loading skeletons only for best sellers, let other sections load progressively
  const showBestSellersLoading = bestSellersLoading && bestSellers.length === 0;

  return (
    <div className="font-sansBody">
      <Helmet>
        <title>1Health Essentials | Natural Beauty & Wellness in Kiambu</title>
        <meta name="description" content="Premium cosmetics and personal care in Thindiqua, Kiambu. Natural, cruelty-free, quality-tested. Shop online or visit Brentwood Arcade." />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">{JSON.stringify(businessJsonLd)}</script>
        {productJsonLd && <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>}
      </Helmet>

      <FlashBanner endTime={flashSaleEnd} message="Flash Sale ends in" />
      <Header />
      <main>
        <Hero />
        
        {/* FOMO Urgent Deals Section - Only shown when Bit 2 is enabled */}
        {fomoEnabled && hotDeals.length >= 2 && (
          <section className="container py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <UrgentDeal
                key={`deal-0-${currentDealIndex}`}
                id={hotDeals[0].id}
                title={hotDeals[0].name}
                discount={30}
                originalPrice={typeof hotDeals[0].price === 'number' ? hotDeals[0].price * 1.3 : 2499}
                timeLeft={180}
                claimed={47}
                total={100}
                image={hotDeals[0].image}
              />
              <UrgentDeal
                key={`deal-1-${currentDealIndex}`}
                id={hotDeals[1].id}
                title={hotDeals[1].name}
                discount={25}
                originalPrice={typeof hotDeals[1].price === 'number' ? hotDeals[1].price * 1.25 : 1899}
                timeLeft={420}
                claimed={23}
                total={50}
                image={hotDeals[1].image}
              />
            </div>
          </section>
        )}
        
        {/* Search and Filter - Only shown when Bit 4 is enabled */}
        {filteringEnabled && (
          <SearchAndFilter
            onSearch={setSearchQuery}
            onFilter={setActiveFilters}
            searchQuery={searchQuery}
            activeFilters={activeFilters}
            productCount={filteredProducts.length}
            products={bestSellers}
            minPrice={priceRange.min}
            maxPrice={priceRange.max}
          />
        )}
        
        {showBestSellersLoading ? (
          <section className="container mt-8">
            <div className="mb-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-1 w-20 mt-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-96 w-full rounded-lg" />
              ))}
            </div>
          </section>
        ) : (
          <BestSellers 
            products={filteringEnabled && filteredProducts.length > 0 ? filteredProducts : bestSellers} 
            title={filteringEnabled && (searchQuery || (activeFilters.categories && activeFilters.categories.length > 0)) && filteredProducts.length > 0 ? "Search Results" : "Best Sellers"}
            displayMode="carousel"
          />
        )}
        
        <Categories />
        
        {/* Hot Deals Carousel using copywriting tone */}
        {catalogueProducts.length > 0 && <HotDealsCarousel products={catalogueProducts} />}
        
        <NewArrivals items={arrivals.map(item => ({
          ...item,
          price: typeof item.price === 'number' ? item.price : 0
        }))} />
        
        <div id="challenge" className="scroll-mt-20">
          <ChallengeBanner />
        </div>
        
        <Trust />
        <About />
        <Testimonials />
      </main>
      <Footer />
      
      {/* Contact Capture Points */}
      <ExitIntentModal />
      <ScrollSlideIn />
      
      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
};

export default Index;
