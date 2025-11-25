import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuickAddToCart from "@/components/cart/QuickAddToCart";
import { CatalogueProduct } from "@/hooks/useCatalogueProducts";

interface HotDealsCarouselProps {
  products: CatalogueProduct[];
}

export default function HotDealsCarousel({ products }: HotDealsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter products that have compelling copy (longer descriptions indicate better copywriting)
  const hotDeals = products
    .filter(p => p.copy && p.copy.length > 150)
    .slice(0, 5);

  useEffect(() => {
    if (hotDeals.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % hotDeals.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [hotDeals.length]);

  if (hotDeals.length === 0) return null;

  const currentProduct = hotDeals[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % hotDeals.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + hotDeals.length) % hotDeals.length);
  };

  return (
    <section className="container my-12">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="h-6 w-6 text-accent fill-accent" />
        <h2 className="font-serifDisplay text-2xl md:text-3xl font-semibold">
          Hot Deals
        </h2>
      </div>

      <div className="relative bg-gradient-to-br from-accent/10 via-background to-primary/5 rounded-2xl overflow-hidden border">
        <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            {currentProduct.sale && (
              <span className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                Sale
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h3 className="font-serifDisplay text-2xl md:text-3xl font-bold mb-3">
              {currentProduct.name}
            </h3>
            
            <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-4">
              {currentProduct.copy}
            </p>

            {currentProduct.funFact && (
              <div className="bg-primary/5 border-l-4 border-primary p-3 mb-4 rounded">
                <p className="text-sm italic">{currentProduct.funFact}</p>
              </div>
            )}

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">
                {currentProduct.priceDisplay}
              </span>
              {currentProduct.size && (
                <span className="text-sm text-muted-foreground">
                  {currentProduct.size}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <QuickAddToCart
                product={{
                  id: currentProduct.id,
                  name: currentProduct.name,
                  price: currentProduct.price,
                  image: currentProduct.image,
                }}
                className="flex-1"
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        {hotDeals.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
              onClick={goToPrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {hotDeals.map((_, idx) => (
                <button
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-muted'
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
