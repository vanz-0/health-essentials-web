import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { Product } from '@/components/home/BestSellers';

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
      </DialogContent>
    </Dialog>
  );
}
