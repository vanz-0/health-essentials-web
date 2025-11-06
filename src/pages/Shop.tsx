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

import pSerum from "@/assets/product-serum.jpg";
import pShampoo from "@/assets/product-shampoo.jpg";
import pButter from "@/assets/product-bodybutter.jpg";
import pSunscreen from "@/assets/product-sunscreen.jpg";

const allProducts = [
  { id: "serum", name: "Vitamin C Brightening Serum", price: 1950, image: pSerum, rating: 4.8, sale: true, category: "skincare" },
  { id: "shampoo", name: "Nourishing Shampoo", price: 1250, image: pShampoo, rating: 4.6, category: "haircare" },
  { id: "butter", name: "Shea Body Butter", price: 1450, image: pButter, rating: 4.9, category: "bodycare" },
  { id: "sunscreen", name: "Daily Mineral Sunscreen SPF 50", price: 2150, image: pSunscreen, rating: 4.7, category: "suncare" },
];

export default function Shop() {
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
    const prices = allProducts.map(p => p.price);
    return {
      min: Math.floor(Math.min(...prices) / 100) * 100,
      max: Math.ceil(Math.max(...prices) / 100) * 100,
    };
  }, []);
  
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const priceQuery = parsePriceQuery(query);
      
      if (priceQuery) {
        if (priceQuery.min !== undefined) {
          filtered = filtered.filter(product => product.price >= priceQuery.min!);
        }
        if (priceQuery.max !== undefined) {
          filtered = filtered.filter(product => product.price <= priceQuery.max!);
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
      filtered = filtered.filter(product => 
        product.price >= min && product.price <= max
      );
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

  return (
    <div className="font-sansBody">
      <Helmet>
        <title>Shop | 1Health Essentials - Natural Beauty Products</title>
        <meta name="description" content="Browse our complete catalog of natural cosmetics and personal care products. Quality-tested, cruelty-free, and made with clean ingredients." />
        <link rel="canonical" href="/shop" />
      </Helmet>

      <Header />
      <main className="min-h-screen">
        <section className="bg-secondary py-12">
          <div className="container">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="font-serifDisplay text-3xl md:text-4xl font-bold">Shop Our Catalog</h1>
            <p className="mt-2 text-muted-foreground">Discover premium natural beauty and wellness products</p>
          </div>
        </section>

        <SearchAndFilter
          onSearch={setSearchQuery}
          onFilter={setActiveFilters}
          searchQuery={searchQuery}
          activeFilters={activeFilters}
          productCount={filteredProducts.length}
          products={allProducts}
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
