import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import InventoryAlert from "./InventoryAlert";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  sale?: boolean;
  category?: string;
};

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isEnabled: cartEnabled } = useFeatureFlag('bit_3_cart');
  
  // Mock inventory for demonstration
  const mockInventory = { serum: 3, shampoo: 8, butter: 2, sunscreen: 6 };
  const remaining = mockInventory[product.id as keyof typeof mockInventory] || 5;
  return (
    <div className="rounded-lg border p-3 hover:shadow-sm transition-shadow">
      <div className="relative overflow-hidden rounded-md">
        {product.sale && (
          <span className="absolute left-2 top-2 rounded bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">Sale</span>
        )}
        <img src={product.image} alt={`${product.name} - 1Health Essentials product`} className="h-56 w-full object-cover" loading="lazy" />
      </div>
      <div className="mt-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium leading-tight">{product.name}</h3>
          {product.rating && (
            <div className="inline-flex items-center gap-1 text-primary">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-xs text-foreground/70">{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="mt-1 font-semibold">KES {product.price.toLocaleString()}</div>
        
        {/* Inventory Alert */}
        <div className="mt-2">
          <InventoryAlert productName={product.name} remaining={remaining} />
        </div>
        
        <div className="mt-3 flex gap-2">
          {cartEnabled && (
            <Button 
              onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })} 
              className="flex-1"
              disabled={remaining === 0}
            >
              {remaining === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}
          <Button variant="outline" className={cartEnabled ? "flex-1" : "w-full"}>Quick View</Button>
        </div>
      </div>
    </div>
  );
}

export default function BestSellers({ products, title = "Best Sellers" }: { products: Product[]; title?: string }) {
  return (
    <section id="shop" className="container mt-8" aria-labelledby="bestsellers-heading">
      <h2 id="bestsellers-heading" className="font-serifDisplay text-2xl md:text-3xl font-semibold">{title}</h2>
      {products.length === 0 ? (
        <div className="mt-8 text-center py-12">
          <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
          <p className="text-muted-foreground text-sm mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
