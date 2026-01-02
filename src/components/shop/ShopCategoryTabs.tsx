import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { shopCategories, getCategoryById } from "@/config/shopCategories";
import { Button } from "@/components/ui/button";

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
  
  return (
    <section className="sticky top-[112px] z-40 bg-background/95 backdrop-blur-md border-b">
      <div className="container py-4">
        {/* Header with back button and thumbnails */}
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            All Categories
          </Button>
          
          {/* Floating thumbnails */}
          {thumbnails.length > 0 && (
            <div className="hidden md:flex items-center gap-2 ml-auto">
              {thumbnails.slice(0, 4).map((thumb, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-10 h-10 rounded-lg overflow-hidden shadow-sm border"
                >
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
        
        {/* Current category info */}
        {currentCategory && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t"
          >
            <h2 className="font-serifDisplay text-2xl md:text-3xl font-bold">
              {currentCategory.name}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {currentCategory.description}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
