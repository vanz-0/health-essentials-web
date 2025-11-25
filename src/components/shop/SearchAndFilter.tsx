import { useState } from "react";
import { Search, Filter, X, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useDebounce } from "@/hooks/useDebounce";
import { addRecentSearch } from "@/lib/searchUtils";
import SearchAutocomplete from "./SearchAutocomplete";
import PriceRangeSlider from "./PriceRangeSlider";
import FilterPresets from "./FilterPresets";
import type { Product } from "@/components/home/BestSellers";

export type FilterOptions = {
  categories: string[];
  productTypes: string[];
  priceRange: { min: number; max: number };
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating';
  minRating?: number;
  inStock?: boolean;
  onSale?: boolean;
};

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Partial<FilterOptions>) => void;
  searchQuery: string;
  activeFilters: Partial<FilterOptions>;
  productCount: number;
  products: Product[];
  minPrice: number;
  maxPrice: number;
}

// Helper function to get unique values with counts
const getUniqueValuesWithCount = (items: Product[], key: 'category' | 'product_type') => {
  const counts = items.reduce((acc, item) => {
    const value = item[key];
    if (value && typeof value === 'string') {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(counts)
    .map(([value, count]) => ({ id: value, name: value, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Predefined categories based on product types
const predefinedCategories = [
  { id: 'soaps', name: 'Soaps & Cleansers', description: 'Body washes, soaps & cleansers' },
  { id: 'body-lotions', name: 'Body Lotions & Oils', description: 'Moisturizers, oils & butters' },
  { id: 'hair-care', name: 'Hair Care', description: 'Shampoos, conditioners & treatments' },
  { id: 'face-care', name: 'Face Care', description: 'Serums, creams & toners' },
  { id: 'makeup', name: 'Makeup', description: 'Foundations, lipsticks & more' },
  { id: 'fragrances', name: 'Fragrances', description: 'Perfumes & body mists' },
  { id: 'hair-styling', name: 'Hair Styling', description: 'Gels, mousses & sprays' },
];

const getCategoryProductCount = (products: Product[], categoryId: string): number => {
  const mappings: Record<string, string[]> = {
    'soaps': ['Body wash', 'Body Wash', 'Cleanser', 'Cleaning Soap', 'Cleanser (bar soap)', 'Cleanser (Bar Soap)'],
    'body-lotions': ['Body lotion', 'Body Lotion', 'Body cream', 'Body Cream', 'Body butter', 'Body oil', 'Body Oil'],
    'hair-care': ['Hair Shampoo', 'Shampoo', 'Conditioner', 'Hair treatment', 'Hair food', 'Hair Food', 'Hair lotion'],
    'face-care': ['Face cream', 'Facial serum', 'Facial Serum', 'Face Serum', 'Facial toner', 'Eye cream'],
    'makeup': ['Foundation', 'Lipstick', 'Lipgloss', 'Mascara', 'Eyeliner', 'Eyeshadow palette'],
    'fragrances': ['Eau de Parfum', 'Eau de Toilette (fragrance)', 'Perfume'],
    'hair-styling': ['Hair gel', 'Hair spray', 'Hair styling mousse', 'Hair pomade'],
  };
  
  const productTypes = mappings[categoryId] || [];
  return products.filter(p => productTypes.some(type => p.product_type?.includes(type))).length;
};

const sortOptions = [
  { value: 'name', label: 'Name A-Z' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function SearchAndFilter({ 
  onSearch, 
  onFilter, 
  searchQuery, 
  activeFilters, 
  productCount,
  products,
  minPrice,
  maxPrice
}: SearchAndFilterProps) {
  const { isEnabled: filteringEnabled } = useFeatureFlag('bit_4_filtering');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearchQuery, 300);
  const [isProductTypesOpen, setIsProductTypesOpen] = useState(false);
  
  // Generate categories with counts
  const categories = predefinedCategories.map(cat => ({
    ...cat,
    count: getCategoryProductCount(products, cat.id)
  }));
  
  // Generate dynamic product types from products
  const productTypes = getUniqueValuesWithCount(products, 'product_type');
  
  // Update parent when debounced search changes
  useState(() => {
    if (debouncedSearch !== searchQuery) {
      onSearch(debouncedSearch);
      if (debouncedSearch.trim()) {
        addRecentSearch(debouncedSearch);
      }
    }
  });
  
  if (!filteringEnabled) return null;

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = activeFilters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(c => c !== categoryId)
      : [...currentCategories, categoryId];
    
    onFilter({ ...activeFilters, categories: newCategories });
  };

  const handleProductTypeToggle = (typeId: string) => {
    const currentTypes = activeFilters.productTypes || [];
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter(t => t !== typeId)
      : [...currentTypes, typeId];
    
    onFilter({ ...activeFilters, productTypes: newTypes });
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    onFilter({ ...activeFilters, sortBy });
  };

  const clearFilters = () => {
    onFilter({});
    onSearch('');
  };

  const handleApplyPreset = (presetFilters: Partial<FilterOptions>) => {
    onFilter({ ...activeFilters, ...presetFilters });
    setIsFilterOpen(false);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    onFilter({ ...activeFilters, priceRange: { min: range[0], max: range[1] } });
  };

  const activeFilterCount = 
    (activeFilters.categories?.length || 0) + 
    (activeFilters.productTypes?.length || 0) +
    (activeFilters.sortBy && activeFilters.sortBy !== 'name' ? 1 : 0) +
    (activeFilters.minRating ? 1 : 0) +
    (activeFilters.inStock ? 1 : 0) +
    (activeFilters.onSale ? 1 : 0) +
    (activeFilters.priceRange && (activeFilters.priceRange.min !== minPrice || activeFilters.priceRange.max !== maxPrice) ? 1 : 0);

  return (
    <div className="container mt-8 space-y-4">
      {/* Search Bar with Autocomplete */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
        <Input
          placeholder="Search products... (try 'under 2000', 'shampoo')"
          value={localSearchQuery}
          onChange={(e) => {
            setLocalSearchQuery(e.target.value);
            setShowAutocomplete(true);
          }}
          onFocus={() => setShowAutocomplete(true)}
          onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
          className="pl-10 animate-fade-in"
        />
        {localSearchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLocalSearchQuery('');
              onSearch('');
            }}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0 z-10"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        <SearchAutocomplete
          products={products}
          searchQuery={localSearchQuery}
          onSelect={(query) => {
            setLocalSearchQuery(query);
            onSearch(query);
            setShowAutocomplete(false);
            addRecentSearch(query);
          }}
          show={showAutocomplete}
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                {/* Filter Presets */}
                <FilterPresets onApplyPreset={handleApplyPreset} />

                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-muted ${
                          activeFilters.categories?.includes(category.id) 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'bg-muted/30'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="text-sm text-muted-foreground">({category.count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Types - Collapsible */}
                <Collapsible open={isProductTypesOpen} onOpenChange={setIsProductTypesOpen}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/50 transition-colors bg-background border border-border">
                      <h3 className="font-medium">Product Type</h3>
                      <div className="flex items-center gap-2">
                        {activeFilters.productTypes && activeFilters.productTypes.length > 0 && (
                          <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs">
                            {activeFilters.productTypes.length}
                          </Badge>
                        )}
                        <ChevronDown className={`h-4 w-4 transition-transform ${isProductTypesOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="space-y-2 max-h-[300px] overflow-y-auto bg-background rounded-lg border border-border p-2">
                      {productTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => handleProductTypeToggle(type.id)}
                          className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-muted ${
                            activeFilters.productTypes?.includes(type.id) 
                              ? 'bg-primary/10 text-primary border border-primary/20' 
                              : 'bg-muted/30'
                          }`}
                        >
                          <span className="text-sm">{type.name}</span>
                          <span className="text-xs text-muted-foreground">({type.count})</span>
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <PriceRangeSlider
                    min={minPrice}
                    max={maxPrice}
                    value={[
                      activeFilters.priceRange?.min ?? minPrice,
                      activeFilters.priceRange?.max ?? maxPrice,
                    ]}
                    onChange={handlePriceRangeChange}
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="font-medium mb-3">Minimum Rating</h3>
                  <RadioGroup
                    value={activeFilters.minRating?.toString() || 'all'}
                    onValueChange={(value) => 
                      onFilter({ 
                        ...activeFilters, 
                        minRating: value === 'all' ? undefined : parseFloat(value) 
                      })
                    }
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="rating-all" />
                        <Label htmlFor="rating-all" className="flex items-center gap-1 cursor-pointer">
                          All Ratings
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4.5" id="rating-45" />
                        <Label htmlFor="rating-45" className="flex items-center gap-1 cursor-pointer">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          4.5 & Up
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4" id="rating-4" />
                        <Label htmlFor="rating-4" className="flex items-center gap-1 cursor-pointer">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          4.0 & Up
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="rating-3" />
                        <Label htmlFor="rating-3" className="flex items-center gap-1 cursor-pointer">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          3.0 & Up
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Availability & Special Filters */}
                <div className="space-y-4">
                  <h3 className="font-medium">Filters</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="in-stock" className="cursor-pointer">In Stock Only</Label>
                    <Switch
                      id="in-stock"
                      checked={activeFilters.inStock || false}
                      onCheckedChange={(checked) => 
                        onFilter({ ...activeFilters, inStock: checked || undefined })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="on-sale" className="cursor-pointer">On Sale</Label>
                    <Switch
                      id="on-sale"
                      checked={activeFilters.onSale || false}
                      onCheckedChange={(checked) => 
                        onFilter({ ...activeFilters, onSale: checked || undefined })
                      }
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="font-medium mb-3">Sort By</h3>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value as FilterOptions['sortBy'])}
                        className={`flex w-full items-center rounded-lg p-3 text-left transition-colors hover:bg-muted ${
                          activeFilters.sortBy === option.value
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'bg-muted/30'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear All Filters ({activeFilterCount})
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Active Filters */}
          {((activeFilters.categories && activeFilters.categories.length > 0) || 
            (activeFilters.productTypes && activeFilters.productTypes.length > 0)) && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.categories?.map((categoryId) => {
                const category = categories.find(c => c.id === categoryId);
                return (
                  <Badge
                    key={categoryId}
                    variant="secondary"
                    className="gap-1 animate-fade-in hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                    onClick={() => handleCategoryToggle(categoryId)}
                  >
                    {category?.name}
                    <X className="h-3 w-3" />
                  </Badge>
                );
              })}
              {activeFilters.productTypes?.map((typeId) => {
                const type = productTypes.find(t => t.id === typeId);
                return (
                  <Badge
                    key={typeId}
                    variant="secondary"
                    className="gap-1 animate-fade-in hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                    onClick={() => handleProductTypeToggle(typeId)}
                  >
                    {type?.name}
                    <X className="h-3 w-3" />
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          {productCount} {productCount === 1 ? 'product' : 'products'} found
        </div>
      </div>
    </div>
  );
}