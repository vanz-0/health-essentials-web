import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BestSellers from "@/components/home/BestSellers";
import SearchAndFilter, { FilterOptions } from "@/components/shop/SearchAndFilter";
import { useState, useMemo, useEffect } from "react";
import { fuzzyMatch, parsePriceQuery } from "@/lib/searchUtils";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCatalogueProducts } from "@/hooks/useCatalogueProducts";

const PRODUCTS_PER_PAGE = 50;

// Category mapping from URL filter to product types
const getCategoryProductTypes = (categoryFilter: string): string[] => {
  const mappings: Record<string, string[]> = {
    'soaps': ['Body wash', 'Body Wash', 'Cleanser', 'Cleaning Soap', 'Cleanser (bar soap)', 'Cleanser (Bar Soap)', 'Bath & shampoo (2-in-1 cleanser)', 'Body Cleanser', 'Bubble bath / Bath and shower cleanser', 'Face wash', 'Facial Cleanser', 'Handwash', 'Hair & Body Wash (2-in-1)', 'Makeup Remover & Facial Cleanser'],
    'body-lotions': ['Body lotion', 'Body Lotion', 'Body cream', 'Body Cream', 'Body butter', 'Body oil', 'Body Oil', 'Body Oil Gel', 'Body Gel Oil', 'Body Oil (Body Gel Oil)', 'Body serum', 'Body gloss (moisturizer)', 'Hand & body lotion', 'Hand & Body Lotion', 'Hand and body lotion', 'Deep Hydrating Hand & Body Lotion', 'Lotion'],
    'hair-care': ['Hair Shampoo', 'Shampoo', 'Conditioner', 'Hair & Scalp Conditioner', 'Herbal Hair & Scalp Conditioner', 'Hair treatment', 'Hair masque', 'Hair food', 'Hair Food', 'Hair food (moisture treatment)', 'Hair lotion', 'Hair Lotion', 'Hair oil', 'Leave-in conditioner', 'Leave-in treatment', 'Leave-in hair treatment', 'Leave-in hair strengthener', 'Hair conditioner/moisturizer', 'Hair & scalp treatment', 'Hair care (anti-dandruff treatment)', 'Hair treatment/moisturising cream', 'Hair loss treatment (ampoules/serum)', 'Growth Lotion'],
    'face-care': ['Face cream', 'Facial serum', 'Facial Serum', 'Face Serum', 'Face & Body Serum', 'Facial toner', 'Facial Toner', 'Eye cream', 'Eye Cream', 'Face & body lotion', 'Face & Body Scrub', 'Facial Whitening & Firming Cream', 'Fairness Cream', 'Firming + Brightening Cream', 'Beauty cream (moisturizer)', 'Cream (moisturizer)', 'Cream (moisturiser)', 'Daily Moisturizer', 'Anti-aging serum', 'Cleanser (Micellar Water)', 'Face wash foam', 'Cleanser foam', 'Cleanser (mousse)', 'Foaming Mousse', 'Eye mask', 'Aloe Vera Gel'],
    'makeup': ['Foundation', 'Lipstick', 'Lipgloss', 'Lip gloss (matte)', 'Mascara', 'Eyeliner', 'Eyeshadow palette', 'Blush palette', 'Concealer', 'Contouring Palette', 'Highlighter, Eyeshadow, Face Powder', 'Lip balm', 'Lip oil', 'Lip scrub', 'Flavored Lip Gloss', 'Eyelash extension'],
    'fragrances': ['Eau de Parfum', 'Eau de Parfum (perfume)', 'Eau de Parfum (Perfume)', 'Eau de Toilette (fragrance)', 'Eau de Toilette (fragrance/perfume)', 'Fragrance (Eau de Toilette)', 'Fine Fragrance Mist', 'Perfume', 'Perfume (Eau de Toilette)', 'Perfume Mist', 'Scent Mist'],
    'hair-styling': ['Hair gel', 'Hair styling gel wax', 'Gel Wax', 'Hair spray', 'Hair Sheen Spray', 'Hair styling mousse', 'Foam wrap (hair styling mousse)', 'Curling mousse', 'Hair pomade', 'Hair wax', 'Styling Gel', 'Leave-in spray']
  };
  
  return mappings[categoryFilter] || [];
};

export default function Shop() {
  const { data: allProducts, isLoading, error } = useCatalogueProducts();
  const { filters: persistedFilters, setFilters: setPersistedFilters, isLoaded } = usePersistedFilters();
  const [searchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Partial<FilterOptions>>(
    isLoaded ? persistedFilters : { sortBy: 'name' }
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize search query from URL parameter
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  // Handle initial category from URL
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && !activeFilters.categories?.length) {
      const productTypes = getCategoryProductTypes(categoryParam);
      if (productTypes.length > 0) {
        setActiveFilters(prev => ({ ...prev, productTypes }));
      }
    }
  }, [searchParams]);
  
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
      const query = searchQuery.toLowerCase().trim();
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
        // Strict keyword matching on name and use_case only
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.use_case?.toLowerCase().includes(query)
        );
      }
    }
    
    if (activeFilters.categories && activeFilters.categories.length > 0) {
      // Map category IDs to product types
      const categoryMappings: Record<string, string[]> = {
        'soaps': ['Body wash', 'Body Wash', 'Cleanser', 'Cleaning Soap', 'Cleanser (bar soap)', 'Cleanser (Bar Soap)', 'Bath & shampoo (2-in-1 cleanser)', 'Body Cleanser', 'Bubble bath / Bath and shower cleanser', 'Face wash', 'Facial Cleanser', 'Handwash'],
        'body-lotions': ['Body lotion', 'Body Lotion', 'Body cream', 'Body Cream', 'Body butter', 'Body oil', 'Body Oil', 'Body Oil Gel', 'Body Gel Oil', 'Body serum', 'Hand & body lotion', 'Hand & Body Lotion'],
        'hair-care': ['Hair Shampoo', 'Shampoo', 'Conditioner', 'Hair & Scalp Conditioner', 'Hair treatment', 'Hair food', 'Hair Food', 'Hair lotion', 'Hair Lotion', 'Hair oil', 'Leave-in conditioner'],
        'face-care': ['Face cream', 'Facial serum', 'Facial Serum', 'Face Serum', 'Facial toner', 'Facial Toner', 'Eye cream', 'Eye Cream', 'Face & body lotion', 'Anti-aging serum'],
        'makeup': ['Foundation', 'Lipstick', 'Lipgloss', 'Mascara', 'Eyeliner', 'Eyeshadow palette', 'Blush palette', 'Concealer'],
        'fragrances': ['Eau de Parfum', 'Eau de Toilette (fragrance)', 'Perfume', 'Fine Fragrance Mist'],
        'hair-styling': ['Hair gel', 'Hair spray', 'Hair styling mousse', 'Hair pomade', 'Gel Wax'],
      };
      
      const allowedProductTypes = activeFilters.categories.flatMap(cat => categoryMappings[cat] || []);
      
      if (allowedProductTypes.length > 0) {
        filtered = filtered.filter(product => 
          allowedProductTypes.some(type => product.product_type?.includes(type))
        );
      }
    }

    if (activeFilters.productTypes && activeFilters.productTypes.length > 0) {
      filtered = filtered.filter(product => 
        activeFilters.productTypes!.includes(product.product_type || '')
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
  }, [allProducts, searchQuery, activeFilters]);

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          products={paginatedProducts} 
          title={searchQuery || (activeFilters.categories && activeFilters.categories.length > 0) ? "Search Results" : "All Products"}
          displayMode="grid"
        />

        {totalPages > 1 && (
          <div className="container py-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
