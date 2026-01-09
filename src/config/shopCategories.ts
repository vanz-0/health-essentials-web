import { Sparkles, Shirt, Heart, LucideIcon } from "lucide-react";

export interface ShopCategory {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  accentColor: string;
  comingSoon: boolean;
}

export const shopCategories: ShopCategory[] = [
  {
    id: 'cosmetics',
    name: 'Essential Cosmetics',
    subtitle: 'Beauty & Personal Care',
    description: 'Natural beauty products, skincare, hair care, and personal care essentials',
    icon: Sparkles,
    gradient: 'linear-gradient(135deg, hsl(35 78% 60%), hsl(28 85% 55%))',
    accentColor: 'hsl(35 78% 60%)',
    comingSoon: false,
  },
  {
    id: 'wear',
    name: 'Essential Wear',
    subtitle: 'Fashion & Accessories',
    description: 'Stylish clothes, shoes, and accessories for every occasion',
    icon: Shirt,
    gradient: 'linear-gradient(135deg, hsl(280 45% 45%), hsl(300 40% 50%))',
    accentColor: 'hsl(280 45% 45%)',
    comingSoon: true,
  },
  {
    id: 'health',
    name: 'Essential Health',
    subtitle: 'Wellness & Recovery',
    description: 'Health products including Nuga Best therapeutic beds and wellness essentials',
    icon: Heart,
    gradient: 'linear-gradient(135deg, hsl(174 72% 40%), hsl(180 60% 45%))',
    accentColor: 'hsl(174 72% 40%)',
    comingSoon: false,
  },
];

export const getCategoryById = (id: string): ShopCategory | undefined => {
  return shopCategories.find(cat => cat.id === id);
};
