import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { shopCategories, getCategoryById } from "@/config/shopCategories";
import { Button } from "@/components/ui/button";
import cosmeticsImage from "@/assets/shop-cosmetics.png";
import wearImage from "@/assets/shop-wear.png";
import healthImage from "@/assets/shop-health.png";

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

interface ShopCategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onBack: () => void;
  thumbnails?: string[];
}

export default function ShopCategoryTabs({ 
  activeCategory, 
  onCategoryChange, 
  onBack,
  thumbnails = []
}: ShopCategoryTabsProps) {
  const currentCategory = getCategoryById(activeCategory);
  
  const categoryImage = currentCategory ? getCategoryImage(currentCategory.id) : '';
  
  return (
    <section className="sticky top-[104px] z-40 -mt-1">
      {/* Themed Header Banner */}
      {currentCategory && (
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden"
          style={{ background: currentCategory.gradient }}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src={categoryImage} 
              alt={currentCategory.name}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
          </div>
          
          <div className="container relative z-10 py-8 md:py-12">
            <div className="flex items-center gap-6">
              {/* Category Thumbnail */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:block w-24 h-24 lg:w-32 lg:h-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30"
              >
                <img 
                  src={categoryImage} 
                  alt={currentCategory.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Category Info */}
              <div className="flex-1">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-serifDisplay text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg"
                >
                  {currentCategory.name}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-white/80 text-sm md:text-base mt-2 max-w-xl"
                >
                  {currentCategory.description}
                </motion.p>
              </div>
              
              {/* Back Button */}
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onBack}
                className="shrink-0 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Categories
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Category Tabs */}
      <div className="bg-background/95 backdrop-blur-md border-b">
        <div className="container py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {shopCategories.map((category) => {
              const Icon = category.icon;
              const isActive = category.id === activeCategory;
              
              return (
                <motion.button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm
                    transition-all duration-300 whitespace-nowrap
                    ${isActive 
                      ? 'text-white shadow-lg' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                  `}
                  style={isActive ? { background: category.gradient } : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                  
                  {category.comingSoon && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-white/20 rounded-full">
                      Soon
                    </span>
                  )}
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full -z-10"
                      style={{ background: category.gradient }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
