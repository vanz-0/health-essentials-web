import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import type { Product } from '@/components/home/BestSellers';

interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'ghost' | 'outline' | 'default';
  showText?: boolean;
  className?: string;
}

export default function WishlistButton({ 
  product, 
  size = 'default', 
  variant = 'ghost',
  showText = false,
  className 
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (inWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        "gap-2 transition-all",
        isAnimating && "scale-110",
        className
      )}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-all",
          inWishlist && "fill-primary text-primary",
          isAnimating && "animate-scale-in"
        )} 
      />
      {showText && (
        <span>{inWishlist ? "In Wishlist" : "Add to Wishlist"}</span>
      )}
    </Button>
  );
}
