import { useState } from "react";
import { Plus, Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/contexts/CartContext";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useToast } from "@/hooks/use-toast";

interface QuickAddToCartProps {
  product: Omit<CartItem, "qty">;
  className?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  showIcon?: boolean;
}

export default function QuickAddToCart({ 
  product, 
  className, 
  variant = "default", 
  size = "default",
  showIcon = true 
}: QuickAddToCartProps) {
  const { addItem } = useCart();
  const { isEnabled: cartEnabled } = useFeatureFlag('bit_3_cart');
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!cartEnabled) return;
    
    setIsAdding(true);
    addItem(product);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });

    // Reset animation after a short delay
    setTimeout(() => setIsAdding(false), 1000);
  };

  if (!cartEnabled) return null;

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={className}
      disabled={isAdding}
    >
      {isAdding ? (
        <>
          <Check className="w-4 h-4 mr-2 animate-cart-success" />
          <span className="animate-wiggle">Added!</span>
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="w-4 h-4 mr-2" />}
          Add to Cart
        </>
      )}
    </Button>
  );
}