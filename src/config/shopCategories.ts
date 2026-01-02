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
    gradient: 'linear-gradient(135deg, hsl(160 84% 31%), hsl(188 94% 43%))',
    accentColor: 'hsl(160 84% 31%)',
    comingSoon: false,
  },
  {
    id: 'wear',
    name: 'Essential Wear',
    subtitle: 'Fashion & Accessories',
    description: 'Stylish clothes, shoes, and accessories for every occasion',
    icon: Shirt,
    gradient: 'linear-gradient(135deg, hsl(239 84% 67%), hsl(280 87% 65%))',
    accentColor: 'hsl(239 84% 67%)',
    comingSoon: true,
  },
  {
    id: 'health',
    name: 'Essential Health',
    subtitle: 'Wellness & Recovery',
    description: 'Health products including Nuga Best therapeutic beds and wellness essentials',
    icon: Heart,
    gradient: 'linear-gradient(135deg, hsl(142 76% 36%), hsl(160 84% 31%))',
    accentColor: 'hsl(142 76% 36%)',
    comingSoon: false,
  },
];

export const getCategoryById = (id: string): ShopCategory | undefined => {
  return shopCategories.find(cat => cat.id === id);
};
