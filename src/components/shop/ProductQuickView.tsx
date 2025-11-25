import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, ExternalLink } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { Product } from '@/components/home/BestSellers';
import { useCatalogueProducts } from '@/hooks/useCatalogueProducts';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductQuickView({ product, open, onOpenChange }: ProductQuickViewProps) {
  const { addItem } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { isEnabled: cartEnabled } = useFeatureFlag('bit_6_shopping_cart');
  const [quantity, setQuantity] = useState(1);
  const { data: allProducts = [] } = useCatalogueProducts();

  // Get related products based on category and use case
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => 
        p.id !== product.id && 
        (p.category === product.category || p.use_case === product.useCase)
      )
      .slice(0, 3);
  }, [product, allProducts]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (cartEnabled) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: typeof product.price === 'number' ? product.price : 0,
          image: product.image,
        });
      }
      onOpenChange(false);
    }
  };

  const handleAddToWishlist = () => {
    addToWishlist({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'number' ? product.price : 0,
      image: product.image,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serifDisplay">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Product Image */}
          <div className="relative">
            {product.sale && (
              <span className="absolute left-2 top-2 z-10 rounded bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                Sale
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-4">
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 0)
                          ? 'fill-primary text-primary'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} / 5.0
                </span>
              </div>
            )}

            {/* Price */}
            <div className="text-3xl font-bold">
              {product.priceDisplay || (typeof product.price === 'number' 
                ? `KSh ${product.price.toLocaleString()}` 
                : product.price)}
            </div>

            {/* Category */}
            {product.category && (
              <div className="text-sm text-muted-foreground">
                Category: <span className="capitalize">{product.category}</span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              {cartEnabled && (
                <Button className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddToWishlist}
                className={isInWishlist(product.id) ? 'bg-accent' : ''}
              >
                <Heart
                  className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`}
                />
              </Button>
            </div>

            {/* Product Information Tabs */}
            <div className="mt-4 pt-4 border-t space-y-4">
              {/* Product Description */}
              {product.copy && (
                <div>
                  <h3 className="font-semibold mb-2">About This Product</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.copy}
                  </p>
                </div>
              )}

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {product.size && (
                  <div>
                    <span className="font-medium text-foreground">Size:</span>
                    <p className="text-muted-foreground">{product.size}</p>
                  </div>
                )}
                {product.productType && (
                  <div>
                    <span className="font-medium text-foreground">Type:</span>
                    <p className="text-muted-foreground capitalize">{product.productType}</p>
                  </div>
                )}
              </div>

              {/* Use Case */}
              {product.useCase && (
                <div>
                  <h3 className="font-semibold mb-2">Perfect For</h3>
                  <p className="text-sm text-muted-foreground">{product.useCase}</p>
                </div>
              )}

              {/* Instructions */}
              {product.instructions && (
                <div>
                  <h3 className="font-semibold mb-2">How to Use</h3>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {product.instructions}
                  </div>
                </div>
              )}

              {/* Fun Fact */}
              {product.funFact && (
                <div className="bg-accent/20 rounded-lg p-3">
                  <h3 className="font-semibold mb-1 text-sm">Did You Know?</h3>
                  <p className="text-sm text-muted-foreground">{product.funFact}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold text-lg mb-4">You May Also Like</h3>
            <div className="grid grid-cols-3 gap-4">
              {relatedProducts.map((related) => (
                <Card key={related.id} className="overflow-hidden group cursor-pointer">
                  <Link to={`/product/${related.id}`} onClick={() => onOpenChange(false)}>
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">{related.name}</h4>
                      <div className="text-primary font-semibold text-sm">{related.priceDisplay}</div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* View Full Details Link */}
        <div className="border-t pt-4 mt-4">
          <Link to={`/product/${product.id}`} onClick={() => onOpenChange(false)}>
            <Button variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Product Details
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
