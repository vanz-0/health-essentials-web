import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplets, Sparkles, Palette, Wind, Scissors, Package, Flame } from "lucide-react";
import skincareImg from "@/assets/category-skincare.jpg";
import haircareImg from "@/assets/category-haircare.jpg";
import bodycareImg from "@/assets/category-bodycare.jpg";

const categories = [
  {
    name: "Soaps & Cleansers",
    icon: Droplets,
    description: "Body washes, soaps & cleansers",
    image: bodycareImg,
    filter: "soaps"
  },
  {
    name: "Body Lotions & Oils",
    icon: Sparkles,
    description: "Moisturizers, oils & butters",
    image: bodycareImg,
    filter: "body-lotions"
  },
  {
    name: "Hair Care",
    icon: Scissors,
    description: "Shampoos, conditioners & treatments",
    image: haircareImg,
    filter: "hair-care"
  },
  {
    name: "Face Care",
    icon: Sparkles,
    description: "Serums, creams & toners",
    image: skincareImg,
    filter: "face-care"
  },
  {
    name: "Makeup",
    icon: Palette,
    description: "Foundations, lipsticks & more",
    image: skincareImg,
    filter: "makeup"
  },
  {
    name: "Fragrances",
    icon: Wind,
    description: "Perfumes & body mists",
    image: bodycareImg,
    filter: "fragrances"
  },
  {
    name: "Hair Styling",
    icon: Flame,
    description: "Gels, mousses & sprays",
    image: haircareImg,
    filter: "hair-styling"
  }
];

export default function Categories() {
  return (
    <section className="container mt-12">
      <h2 className="font-serifDisplay text-2xl md:text-3xl font-semibold text-center mb-8">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link 
              key={category.name} 
              to={`/shop?category=${category.filter}`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-2xl h-48 md:h-64 transition-transform hover:scale-105">
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
                  <Icon className="h-8 w-8 md:h-10 md:w-10" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{category.name}</h3>
                    <p className="text-xs md:text-sm mb-2 md:mb-4 opacity-90">{category.description}</p>
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
