import { useState } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";

interface CartDrawerProps {
  children: React.ReactNode;
}

export default function CartDrawer({ children }: CartDrawerProps) {
  const { items, addItem, removeItem, totalPrice, totalQty } = useCart();
  const { isEnabled: cartEnabled } = useFeatureFlag('bit_3_cart');
  const [isOpen, setIsOpen] = useState(false);

  const updateQuantity = (id: string, name: string, price: number, image: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(id);
      return;
    }
    
    const currentItem = items.find(item => item.id === id);
    if (currentItem) {
      const qtyDiff = newQty - currentItem.qty;
      if (qtyDiff > 0) {
        addItem({ id, name, price, image }, qtyDiff);
      } else if (qtyDiff < 0) {
        // Remove the exact difference needed
        removeItem(id);
        if (newQty > 0) {
          addItem({ id, name, price, image }, newQty);
        }
      }
    }
  };

  if (!cartEnabled) return <>{children}</>;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Shopping Cart
            <span className="text-sm font-normal text-muted-foreground">
              {totalQty} {totalQty === 1 ? 'item' : 'items'}
            </span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <X className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Your cart is empty</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        KES {item.price.toLocaleString()}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => updateQuantity(item.id, item.name, item.price, item.image, item.qty - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => updateQuantity(item.id, item.name, item.price, item.image, item.qty + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        KES {(item.price * item.qty).toLocaleString()}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive mt-1"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">KES {totalPrice.toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
                <Button className="bg-primary">
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}