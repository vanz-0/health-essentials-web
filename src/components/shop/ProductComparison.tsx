import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CatalogueProduct } from "@/hooks/useCatalogueProducts";

interface ProductComparisonProps {
  products: CatalogueProduct[];
  onRemoveProduct: (id: string) => void;
  onClose: () => void;
}

export default function ProductComparison({ products, onRemoveProduct, onClose }: ProductComparisonProps) {
  if (products.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serifDisplay font-bold">Compare Products</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="p-6 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => onRemoveProduct(product.id)}
              >
                <X className="h-4 w-4" />
              </Button>

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />

              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <div className="text-2xl font-bold text-primary mb-4">{product.priceDisplay}</div>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-muted-foreground mb-1">Category</div>
                  <Badge variant="secondary" className="capitalize">{product.category || 'N/A'}</Badge>
                </div>

                <div>
                  <div className="font-medium text-muted-foreground mb-1">Type</div>
                  <div className="capitalize">{product.product_type || 'N/A'}</div>
                </div>

                <div>
                  <div className="font-medium text-muted-foreground mb-1">Size</div>
                  <div>{product.size || 'N/A'}</div>
                </div>

                <div>
                  <div className="font-medium text-muted-foreground mb-1">Best For</div>
                  <div className="line-clamp-2">{product.use_case || 'N/A'}</div>
                </div>

                {product.rating && (
                  <div>
                    <div className="font-medium text-muted-foreground mb-1">Rating</div>
                    <div className="flex items-center gap-1">
                      <span className="text-primary font-semibold">{product.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">/ 5.0</span>
                    </div>
                  </div>
                )}

                <div>
                  <div className="font-medium text-muted-foreground mb-1">Key Benefits</div>
                  <p className="line-clamp-3 text-muted-foreground">{product.copy || product.description || 'N/A'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {products.length < 3 && (
          <div className="mt-6 text-center text-muted-foreground">
            <p>Select up to 3 products to compare</p>
          </div>
        )}
      </div>
    </div>
  );
}