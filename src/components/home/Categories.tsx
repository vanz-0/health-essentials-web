import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Droplets, Heart } from "lucide-react";
import skincareImg from "@/assets/category-skincare.jpg";
import haircareImg from "@/assets/category-haircare.jpg";
import bodycareImg from "@/assets/category-bodycare.jpg";

const categories = [
  {
    name: "Skincare",
    icon: Sparkles,
    description: "Nourish and protect your skin",
    image: skincareImg
  },
  {
    name: "Haircare",
    icon: Droplets,
    description: "Healthy, beautiful hair",
    image: haircareImg
  },
  {
    name: "Body Care",
    icon: Heart,
    description: "Pamper your body",
    image: bodycareImg
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
              className="group block"
            >
              <div className="relative overflow-hidden rounded-2xl h-64 transition-transform hover:scale-105">
                {/* Background Image */}
                <img 
                  src={category.image} 
                  alt={`${category.name} products`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
                  <Icon className="h-10 w-10" />
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm mb-4 opacity-90">{category.description}</p>
                    <Button 
                      variant="secondary" 
                      className="w-fit"
                      asChild
                    >
                      <span>Explore {category.name}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
