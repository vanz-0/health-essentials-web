import { Button } from "@/components/ui/button";
import { FilterOptions } from "./SearchAndFilter";
import { Sparkles, TrendingUp, Tag, Star } from "lucide-react";

interface FilterPresetsProps {
  onApplyPreset: (filters: Partial<FilterOptions>) => void;
}

const presets = [
  {
    id: 'budget',
    label: 'Budget Friendly',
    icon: Tag,
    filters: {
      priceRange: { min: 0, max: 1500 } as { min: number; max: number },
      sortBy: 'price-low' as const,
    },
  },
  {
    id: 'premium',
    label: 'Premium',
    icon: Sparkles,
    filters: {
      priceRange: { min: 2500, max: 10000 } as { min: number; max: number },
      sortBy: 'price-high' as const,
    },
  },
  {
    id: 'best-rated',
    label: 'Best Rated',
    icon: Star,
    filters: {
      minRating: 4.5,
      sortBy: 'rating' as const,
    },
  },
  {
    id: 'on-sale',
    label: 'On Sale',
    icon: TrendingUp,
    filters: {
      onSale: true,
      sortBy: 'price-low' as const,
    },
  },
];

export default function FilterPresets({ onApplyPreset }: FilterPresetsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Quick Filters</h3>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => {
          const Icon = preset.icon;
          return (
            <Button
              key={preset.id}
              variant="outline"
              size="sm"
              onClick={() => onApplyPreset(preset.filters)}
              className="h-auto flex-col gap-2 py-3"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{preset.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
