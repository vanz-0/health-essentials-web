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
      className="relative group cursor-pointer rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
      style={{ background: category.gradient }}
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
        style={{ background: category.gradient }}
      />
      
      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 min-h-[380px] md:min-h-[420px] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl"
          >
            <Icon className="h-8 w-8 text-white" />
          </motion.div>
          
          {category.comingSoon && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
              <Clock className="h-3.5 w-3.5 text-white" />
              <span className="text-xs font-medium text-white">Coming Soon</span>
            </div>
          )}
        </div>
        
        {/* Title */}
        <h3 className="font-serifDisplay text-2xl md:text-3xl font-bold text-white mb-2">
          {category.name}
        </h3>
        <p className="text-white/80 text-sm mb-1">{category.subtitle}</p>
        <p className="text-white/60 text-sm mb-6 line-clamp-2">{category.description}</p>
        
        {/* Banner Image */}
        <div className="flex-1 flex items-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
            className="w-full rounded-xl overflow-hidden shadow-lg"
          >
            <img 
              src={bannerImage} 
              alt={category.name}
              className="w-full h-32 md:h-40 object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
        
        {/* CTA */}
        <motion.div 
          className="mt-6 flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all duration-300"
        >
          <span>{category.comingSoon ? 'View Preview' : 'Explore'}</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </motion.div>
      </div>
      
      {/* Coming Soon Overlay */}
      {category.comingSoon && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-5" />
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
