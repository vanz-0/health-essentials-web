import { Helmet } from "react-helmet-async";
import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Sparkles } from "lucide-react";
import { useCatalogueProducts, CatalogueProduct } from "@/hooks/useCatalogueProducts";
import { CategoryCarousel } from "@/components/beauty/CategoryCarousel";
import ProductQuickView from "@/components/shop/ProductQuickView";

// Category mapping (same as shop filters)
const categoryMapping: Record<string, string[]> = {
  "Soaps & Cleansers": ["Body wash", "Cleanser", "Cleaning Soap"],
  "Body Lotions & Oils": ["Body lotion", "Body cream", "Body butter", "Body oil"],
  "Hair Care": ["Shampoo", "Conditioner", "Hair treatment", "Hair food"],
  "Face Care": ["Face cream", "Facial serum", "Facial toner"],
  "Makeup": ["Foundation", "Lipstick", "Mascara", "Eyeliner"],
  "Fragrances": ["Eau de Parfum", "Perfume"],
  "Hair Styling": ["Hair gel", "Hair spray", "Hair mousse"],
};

export default function BeautyTips() {
  const { data: products = [], isLoading } = useCatalogueProducts();
  const [selectedProduct, setSelectedProduct] = useState<CatalogueProduct | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Filter and group products by category
  const categorizedProducts = useMemo(() => {
    // Filter out products without fun facts or with "Insufficient information"
    const validProducts = products.filter(
      (product) => 
        product.funFact && 
        !product.funFact.includes("Insufficient information available")
    );

    // Group by categories
    const grouped: Record<string, CatalogueProduct[]> = {};

    Object.entries(categoryMapping).forEach(([categoryName, productTypes]) => {
      const categoryProducts = validProducts.filter((product) =>
        productTypes.some((type) => 
          product.product_type?.toLowerCase() === type.toLowerCase()
        )
      );

      if (categoryProducts.length > 0) {
        grouped[categoryName] = categoryProducts;
      }
    });

    return grouped;
  }, [products]);

  const handleProductClick = (product: CatalogueProduct) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  if (isLoading) {
    return (
      <div className="font-sansBody min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading beauty tips...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sansBody">
      <Helmet>
        <title>Beauty Tips & Guides | 1Health Essentials</title>
        <meta name="description" content="Discover expert beauty tips, skincare routines, and haircare guides. Learn how to get the most from your natural beauty products." />
        <link rel="canonical" href="/beauty-tips" />
      </Helmet>

      <Header />
      <main className="min-h-screen pt-[112px]">
        <section className="bg-gradient-to-b from-primary/10 to-background py-12">
          <div className="container">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="font-serifDisplay text-3xl md:text-4xl font-bold">Beauty Tips & Guides</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Expert advice and care instructions for your beauty routine
            </p>
          </div>
        </section>

        <section className="container py-12">
          {Object.keys(categorizedProducts).length > 0 ? (
            Object.entries(categorizedProducts).map(([categoryName, categoryProducts]) => (
              <CategoryCarousel
                key={categoryName}
                categoryName={categoryName}
                products={categoryProducts}
                onProductClick={handleProductClick}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No beauty tips available at the moment.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
      
      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          open={isQuickViewOpen}
          onOpenChange={setIsQuickViewOpen}
        />
      )}
    </div>
  );
}