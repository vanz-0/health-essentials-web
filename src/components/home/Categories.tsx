import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Droplets, Heart } from "lucide-react";

const categories = [
  {
    name: "Skincare",
    icon: Sparkles,
    description: "Nourish and protect your skin",
    color: "from-pink-500 to-rose-500"
  },
  {
    name: "Haircare",
    icon: Droplets,
    description: "Healthy, beautiful hair",
    color: "from-purple-500 to-indigo-500"
  },
  {
    name: "Body Care",
    icon: Heart,
    description: "Pamper your body",
    color: "from-orange-500 to-amber-500"
  }
];

export default function Categories() {
  return (
    <section className="container mt-12">
      <h2 className="font-serifDisplay text-2xl md:text-3xl font-semibold text-center mb-8">
        Shop by Category
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link 
              key={category.name} 
              to={`/shop?category=${category.name.toLowerCase()}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl p-8 text-white h-48 flex flex-col justify-between transition-transform hover:scale-105">
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`} />
                <div className="relative z-10">
                  <Icon className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                </div>
                <Button 
                  variant="secondary" 
                  className="relative z-10 w-fit"
                  asChild
                >
                  <span>Explore {category.name}</span>
                </Button>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
