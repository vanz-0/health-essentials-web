import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  sale?: boolean;
};

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
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
        <div className="mt-3 flex gap-2">
          <Button onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })} className="flex-1">Add to Cart</Button>
          <Button variant="outline" className="flex-1">Quick View</Button>
        </div>
      </div>
    </div>
  );
}

export default function BestSellers({ products }: { products: Product[] }) {
  return (
    <section id="shop" className="container mt-16" aria-labelledby="bestsellers-heading">
      <h2 id="bestsellers-heading" className="font-serifDisplay text-2xl md:text-3xl font-semibold">Best Sellers</h2>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
