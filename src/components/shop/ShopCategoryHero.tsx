import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { shopCategories, ShopCategory } from "@/config/shopCategories";
import cosmeticsImage from "@/assets/shop-cosmetics.png";
import wearImage from "@/assets/shop-wear.png";
import healthImage from "@/assets/shop-health.png";

interface ShopCategoryHeroProps {
  onSelectCategory: (categoryId: string) => void;
}

const getCategoryImage = (categoryId: string): string => {
  switch (categoryId) {
    case 'cosmetics':
      return cosmeticsImage;
    case 'wear':
      return wearImage;
    case 'health':
      return healthImage;
    default:
      return cosmeticsImage;
  }
};

const CategoryCard = ({ 
  category, 
  bannerImage,
  onSelect,
  index
}: { 
  category: ShopCategory; 
  bannerImage: string;
  onSelect: () => void;
  index: number;
}) => {
  const Icon = category.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="relative group cursor-pointer rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* Full Banner Image Background */}
      <div className="absolute inset-0">
        <img 
          src={bannerImage} 
          alt={category.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Gradient overlay for text readability */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 min-h-[380px] md:min-h-[420px] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="p-3 backdrop-blur-md rounded-2xl"
            style={{ backgroundColor: `${category.accentColor.replace(')', ' / 0.3)').replace('hsl', 'hsla')}` }}
          >
            <Icon className="h-8 w-8 text-white drop-shadow-md" />
          </motion.div>
          
          {category.comingSoon && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-full border border-white/20">
              <Clock className="h-3.5 w-3.5 text-white" />
              <span className="text-xs font-medium text-white">Coming Soon</span>
            </div>
          )}
        </div>
        
        {/* Spacer to push content to bottom */}
        <div className="flex-1" />
        
        {/* Title & Description */}
        <div className="mt-auto">
          <h3 className="font-serifDisplay text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            {category.name}
          </h3>
          <p className="text-white/90 text-sm font-medium mb-1 drop-shadow">{category.subtitle}</p>
          <p className="text-white/70 text-sm mb-6 line-clamp-2">{category.description}</p>
          
          {/* CTA Button */}
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold transition-all duration-300 group-hover:gap-4"
            style={{ background: category.gradient }}
          >
            <span>{category.comingSoon ? 'View Preview' : 'Explore'}</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </div>
      </div>
      
      {/* Coming Soon Overlay */}
      {category.comingSoon && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-5" />
      )}
    </motion.div>
  );
};

export default function ShopCategoryHero({ onSelectCategory }: ShopCategoryHeroProps) {
  return (
    <section className="py-12 md:py-20">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="font-serifDisplay text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Shop <span className="text-primary">Essentials</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our curated collections of beauty, fashion, and wellness products
          </p>
        </motion.div>
        
        {/* Category Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {shopCategories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              bannerImage={getCategoryImage(category.id)}
              onSelect={() => onSelectCategory(category.id)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
