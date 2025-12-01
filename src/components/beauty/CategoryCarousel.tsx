import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CatalogueProduct } from "@/hooks/useCatalogueProducts";
import { BeautyTipCard } from "./BeautyTipCard";

interface CategoryCarouselProps {
  categoryName: string;
  products: CatalogueProduct[];
  onProductClick: (product: CatalogueProduct) => void;
}

export function CategoryCarousel({ categoryName, products, onProductClick }: CategoryCarouselProps) {
  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="font-serifDisplay text-2xl md:text-3xl font-bold text-primary mb-2">
          {categoryName}
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <BeautyTipCard 
                product={product} 
                onImageClick={() => onProductClick(product)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4" />
        <CarouselNext className="hidden md:flex -right-4" />
      </Carousel>
    </div>
  );
}
