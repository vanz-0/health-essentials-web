import skincare from "@/assets/category-skincare.jpg";
import haircare from "@/assets/category-haircare.jpg";
import bodycare from "@/assets/category-bodycare.jpg";
import { Button } from "@/components/ui/button";

const categories = [
  { key: "skincare", name: "Skincare", image: skincare, count: 24 },
  { key: "haircare", name: "Hair Care", image: haircare, count: 18 },
  { key: "bodycare", name: "Body Care", image: bodycare, count: 16 },
];

export default function Categories() {
  return (
    <section className="container mt-16" aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="font-serifDisplay text-2xl md:text-3xl font-semibold">Featured Categories</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <a key={cat.key} href="#shop" className="group relative block overflow-hidden rounded-lg">
            <img src={cat.image} alt={`${cat.name} category - 1Health Essentials`} className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="text-sm text-foreground/80">{cat.count}+ products</div>
              <div className="font-serifDisplay text-xl font-semibold">{cat.name}</div>
              <Button variant="outline" size="sm" className="mt-2">Shop Now</Button>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
