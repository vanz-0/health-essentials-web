import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import BestSellers from "@/components/home/BestSellers";
import NewArrivals from "@/components/home/NewArrivals";
import Trust from "@/components/home/Trust";
import About from "@/components/home/About";
import Testimonials from "@/components/home/Testimonials";
import FlashBanner from "@/components/home/FlashBanner";
import UrgentDeal from "@/components/home/UrgentDeal";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useState, useMemo } from "react";
import SearchAndFilter, { FilterOptions } from "@/components/shop/SearchAndFilter";
import { fuzzyMatch, parsePriceQuery } from "@/lib/searchUtils";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import ExitIntentModal from "@/components/contact/ExitIntentModal";
import ScrollSlideIn from "@/components/contact/ScrollSlideIn";

import productSerum from "@/assets/product-serum.jpg";
import productBodyButter from "@/assets/product-bodybutter.jpg";
import productShampoo from "@/assets/product-shampoo.jpg";
import productSunscreen from "@/assets/product-sunscreen.jpg";

import pSerum from "@/assets/product-serum.jpg";
import pShampoo from "@/assets/product-shampoo.jpg";
import pButter from "@/assets/product-bodybutter.jpg";
import pSunscreen from "@/assets/product-sunscreen.jpg";

const bestSellers = [
  { id: "serum", name: "Vitamin C Brightening Serum", price: 1950, image: pSerum, rating: 4.8, sale: true, category: "skincare" },
  { id: "shampoo", name: "Nourishing Shampoo", price: 1250, image: pShampoo, rating: 4.6, category: "haircare" },
  { id: "butter", name: "Shea Body Butter", price: 1450, image: pButter, rating: 4.9, category: "bodycare" },
  { id: "sunscreen", name: "Daily Mineral Sunscreen SPF 50", price: 2150, image: pSunscreen, rating: 4.7, category: "suncare" },
];

const arrivals = [
  { id: "serum", name: "Vitamin C Brightening Serum", price: 1950, image: pSerum },
  { id: "sunscreen", name: "Daily Mineral Sunscreen SPF 50", price: 2150, image: pSunscreen },
  { id: "butter", name: "Shea Body Butter", price: 1450, image: pButter },
  { id: "shampoo", name: "Nourishing Shampoo", price: 1250, image: pShampoo },
];

const Index = () => {
  const { isEnabled: fomoEnabled } = useFeatureFlag('bit_2_fomo');
  const { isEnabled: filteringEnabled } = useFeatureFlag('bit_4_filtering');
  
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
  
  // Calculate price range from products
  const priceRange = useMemo(() => {
    const prices = bestSellers.map(p => p.price);
    return {
      min: Math.floor(Math.min(...prices) / 100) * 100,
      max: Math.ceil(Math.max(...prices) / 100) * 100,
    };
  }, []);
  
  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...bestSellers];
    
    // Search filter - enhanced with fuzzy matching and natural language price
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      // Check for natural language price query
      const priceQuery = parsePriceQuery(query);
      if (priceQuery) {
        if (priceQuery.min !== undefined) {
          filtered = filtered.filter(product => product.price >= priceQuery.min!);
        }
        if (priceQuery.max !== undefined) {
          filtered = filtered.filter(product => product.price <= priceQuery.max!);
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
      filtered = filtered.filter(product => 
        product.price >= min && product.price <= max
      );
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
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
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
  }, [searchQuery, activeFilters]);
  
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

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: "Vitamin C Brightening Serum",
    image: [
      pSerum,
    ],
    brand: {
      "@type": "Brand",
      name: "1Health Essentials",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: "1950",
      availability: "https://schema.org/InStock",
      url: "/#shop",
    },
  };

  return (
    <div className="font-sansBody">
      <Helmet>
        <title>1Health Essentials | Natural Beauty & Wellness in Kiambu</title>
        <meta name="description" content="Premium cosmetics and personal care in Thindiqua, Kiambu. Natural, cruelty-free, quality-tested. Shop online or visit Brentwood Arcade." />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">{JSON.stringify(businessJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      </Helmet>

      <FlashBanner endTime={flashSaleEnd} message="Flash Sale ends in" />
      <Header />
      <main>
        <Hero />
        
        {/* FOMO Urgent Deals Section - Only shown when Bit 2 is enabled */}
        {fomoEnabled && (
          <section className="container py-8">
            <div className="grid grid-cols-2 gap-4 w-full">
              <UrgentDeal
                title="Vitamin C Brightening Serum"
                discount={30}
                originalPrice={2499}
                timeLeft={180} // 3 hours in minutes
                claimed={47}
                total={100}
                image={productSerum}
              />
              <UrgentDeal
                title="Shea Body Butter Special"
                discount={25}
                originalPrice={1899}
                timeLeft={420} // 7 hours in minutes
                claimed={23}
                total={50}
                image={productBodyButter}
              />
            </div>
          </section>
        )}
        
        <Categories />
        
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
        
        <BestSellers 
          products={filteringEnabled ? filteredProducts : bestSellers} 
          title={filteringEnabled && (searchQuery || (activeFilters.categories && activeFilters.categories.length > 0)) ? "Search Results" : "Best Sellers"}
        />
        <NewArrivals items={arrivals} />
        <Trust />
        <About />
        <Testimonials />

        {/* Placeholder sections for navigation targets */}
        <section id="services" className="container mt-24">
          <h2 className="font-serifDisplay text-2xl font-semibold">Our Services</h2>
          <p className="mt-2 text-muted-foreground">Skin consultations, routine building, and personalized recommendations. (Details coming soon)</p>
        </section>

        <section id="contact" className="container mt-24">
          <h2 className="font-serifDisplay text-2xl font-semibold">Contact Us</h2>
          <p className="mt-2 text-muted-foreground">Call 0735558830 or visit us at Brentwood Arcade, Thindiqua, Kiambu.</p>
        </section>

        <section id="blog" className="container mt-24">
          <h2 className="font-serifDisplay text-2xl font-semibold">From Our Blog</h2>
          <p className="mt-2 text-muted-foreground">Beauty tips, ingredient spotlights, and wellness insights. (Coming soon)</p>
        </section>
      </main>
      <Footer />
      
      {/* Contact Capture Points */}
      <ExitIntentModal />
      <ScrollSlideIn />
    </div>
  );
};

export default Index;
