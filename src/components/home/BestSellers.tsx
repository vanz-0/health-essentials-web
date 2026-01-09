import { useState, useMemo } from "react";
import { Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useSeasonalTheme } from "@/contexts/SeasonalThemeContext";
import InventoryAlert from "./InventoryAlert";
import WishlistButton from "@/components/wishlist/WishlistButton";
import ProductQuickView from "@/components/shop/ProductQuickView";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export type Product = {
  id: string;
  name: string;
  price: number | string;
  priceDisplay?: string;
  image: string;
  rating?: number;
  sale?: boolean;
  category?: string;
  product_type?: string;
  productNum?: string;
  productType?: string;
  size?: string;
  useCase?: string;
  copy?: string;
  instructions?: string;
  funFact?: string;
  description?: string;
};

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isEnabled: cartEnabled } = useFeatureFlag('bit_6_shopping_cart');
  const { theme } = useSeasonalTheme();
  const [showQuickView, setShowQuickView] = useState(false);
  
  // Randomized inventory based on product id
  const getRandomStock = (id: string) => {
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const oddNumbers = [3, 7, 9, 11, 13];
    return oddNumbers[seed % oddNumbers.length];
  };
  const remaining = getRandomStock(product.id);
  return (
    <>
      <ProductQuickView 
        product={product} 
        open={showQuickView} 
        onOpenChange={setShowQuickView} 
      />
      <div className="rounded-lg border p-2 md:p-3 hover:shadow-sm transition-shadow">
        <div className="relative overflow-hidden rounded-md group">
        {product.sale && (
          <span 
            className="absolute left-1.5 top-1.5 md:left-2 md:top-2 rounded px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-medium text-white shadow-lg"
            style={{ background: `linear-gradient(to right, ${theme.accentGradient.from}, ${theme.accentGradient.to})` }}
          >
            {theme.saleBadgeEmoji} {theme.saleBadgeText}
          </span>
        )}
        <WishlistButton 
          product={product} 
          size="sm" 
          variant="ghost"
          className="absolute right-1.5 top-1.5 md:right-2 md:top-2 bg-background/80 hover:bg-background h-7 w-7 md:h-8 md:w-8"
        />
        <img 
          src={product.image} 
          alt={`${product.name} - 1Health Essentials product`} 
          className="h-48 md:h-56 w-full object-cover" 
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="mt-2 md:mt-3">
        <div className="flex items-start justify-between gap-2 md:gap-3">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium leading-tight text-sm md:text-base hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.rating && (
            <div className="inline-flex items-center gap-0.5 md:gap-1 text-primary">
              <Star className="h-3 w-3 md:h-4 md:w-4 fill-current" />
              <span className="text-[10px] md:text-xs text-foreground/70">{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="mt-1 font-semibold text-sm md:text-base">
          {product.priceDisplay || (typeof product.price === 'number' 
            ? `KES ${product.price.toLocaleString()}` 
            : product.price)}
        </div>
        
        {/* Inventory Alert */}
        <div className="mt-2">
          <InventoryAlert productName={product.name} remaining={remaining} />
        </div>
        
        <div className="mt-2 md:mt-3 flex gap-2">
          {cartEnabled && (
            <Button 
              onClick={() => addItem({ 
                id: product.id, 
                name: product.name, 
                price: typeof product.price === 'number' ? product.price : 0, 
                image: product.image 
              })} 
              className="flex-1 text-xs md:text-sm h-8 md:h-10"
              disabled={remaining === 0}
            >
              {remaining === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}
          <Button 
            variant="outline" 
            className={`${cartEnabled ? "flex-1" : "w-full"} text-xs md:text-sm h-8 md:h-10`}
            onClick={() => setShowQuickView(true)}
          >
            Quick View
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}

export default function BestSellers({ products, title = "Best Sellers", displayMode = "carousel" }: { products: Product[]; title?: string; displayMode?: "carousel" | "grid" }) {
  // Sort products to show holiday deals first
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      // Holiday deals (sale items) come first
      if (a.sale && !b.sale) return -1;
      if (!a.sale && b.sale) return 1;
      return 0;
    });
  }, [products]);

  return (
    <section id="shop" className="container mt-8" aria-labelledby="bestsellers-heading">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 id="bestsellers-heading" className="font-serifDisplay text-xl md:text-2xl lg:text-3xl font-semibold">{title}</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full mt-2" />
        </div>
        <Link to="/shop">
          <Button variant="outline" className="group">
            Shop Bestsellers
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
      {sortedProducts.length === 0 ? (
        <div className="mt-8 text-center py-12">
          <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
          <p className="text-muted-foreground text-sm mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : displayMode === "grid" ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
          {sortedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <Carousel
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full animate-fade-in"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {sortedProducts.map((p) => (
              <CarouselItem key={p.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ProductCard product={p} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      )}
    </section>
  );
}
