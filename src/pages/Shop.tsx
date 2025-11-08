import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BestSellers from "@/components/home/BestSellers";
import SearchAndFilter, { FilterOptions } from "@/components/shop/SearchAndFilter";
import { useState, useMemo } from "react";
import { fuzzyMatch, parsePriceQuery } from "@/lib/searchUtils";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useCatalogueProducts } from "@/hooks/useCatalogueProducts";

export default function Shop() {
  const { data: allProducts, isLoading, error } = useCatalogueProducts();
  const { filters: persistedFilters, setFilters: setPersistedFilters, isLoaded } = usePersistedFilters();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Partial<FilterOptions>>(
    isLoaded ? persistedFilters : { sortBy: 'name' }
  );
  
  useMemo(() => {
    if (isLoaded) {
      setPersistedFilters(activeFilters);
    }
  }, [activeFilters, isLoaded, setPersistedFilters]);
  
  const priceRange = useMemo(() => {
    if (!allProducts || allProducts.length === 0) {
      return { min: 0, max: 5000 };
    }
    const prices = allProducts.map(p => typeof p.price === 'number' ? p.price : 0);
    return {
      min: Math.floor(Math.min(...prices) / 100) * 100,
      max: Math.ceil(Math.max(...prices) / 100) * 100,
    };
  }, [allProducts]);
  
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    let filtered = [...allProducts];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const priceQuery = parsePriceQuery(query);
      
      if (priceQuery) {
        if (priceQuery.min !== undefined) {
          filtered = filtered.filter(product => {
            const price = typeof product.price === 'number' ? product.price : 0;
            return price >= priceQuery.min!;
          });
        }
        if (priceQuery.max !== undefined) {
          filtered = filtered.filter(product => {
            const price = typeof product.price === 'number' ? product.price : 0;
            return price <= priceQuery.max!;
          });
        }
      } else {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          fuzzyMatch(product.name, query) ||
          (product.category && fuzzyMatch(product.category, query))
        );
      }
    }
    
    if (activeFilters.categories && activeFilters.categories.length > 0) {
      filtered = filtered.filter(product => 
        activeFilters.categories!.includes(product.category || '')
      );
    }
    
    if (activeFilters.priceRange) {
      const { min, max } = activeFilters.priceRange;
      filtered = filtered.filter(product => {
        const price = typeof product.price === 'number' ? product.price : 0;
        return price >= min && price <= max;
      });
    }
    
    if (activeFilters.minRating) {
      filtered = filtered.filter(product => 
        (product.rating || 0) >= activeFilters.minRating!
      );
    }
    
    if (activeFilters.onSale) {
      filtered = filtered.filter(product => product.sale === true);
    }
    
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
  }, [searchQuery, activeFilters]);

  if (isLoading) {
    return (
      <div className="font-sansBody min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-sansBody min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-destructive mb-4">Failed to load products</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sansBody">
      <Helmet>
        <title>Shop | 1Health Essentials - Natural Beauty Products</title>
        <meta name="description" content="Browse our complete catalog of natural cosmetics and personal care products. Quality-tested, cruelty-free, and made with clean ingredients." />
        <link rel="canonical" href="/shop" />
      </Helmet>

      <Header />
      <main className="min-h-screen pt-[112px]">
        <section className="bg-gradient-to-b from-primary/10 to-background py-8 md:py-12">
          <div className="container">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="font-serifDisplay text-2xl md:text-3xl font-bold">Shop Our Collection</h1>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">Discover natural beauty and wellness products</p>
          </div>
        </section>

        <SearchAndFilter
          onSearch={setSearchQuery}
          onFilter={setActiveFilters}
          searchQuery={searchQuery}
          activeFilters={activeFilters}
          productCount={filteredProducts.length}
          products={allProducts || []}
          minPrice={priceRange.min}
          maxPrice={priceRange.max}
        />
        
        <BestSellers 
          products={filteredProducts} 
          title={searchQuery || (activeFilters.categories && activeFilters.categories.length > 0) ? "Search Results" : "All Products"}
        />
      </main>
      <Footer />
    </div>
  );
}
