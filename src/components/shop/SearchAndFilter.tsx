import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";

export type FilterOptions = {
  categories: string[];
  priceRange: { min: number; max: number };
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating';
};

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Partial<FilterOptions>) => void;
  searchQuery: string;
  activeFilters: Partial<FilterOptions>;
  productCount: number;
}

const categories = [
  { id: 'skincare', name: 'Skincare', count: 12 },
  { id: 'haircare', name: 'Hair Care', count: 8 },
  { id: 'bodycare', name: 'Body Care', count: 15 },
  { id: 'suncare', name: 'Sun Care', count: 5 },
];

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
  productCount 
}: SearchAndFilterProps) {
  const { isEnabled: filteringEnabled } = useFeatureFlag('bit_4_filtering');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  if (!filteringEnabled) return null;

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = activeFilters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(c => c !== categoryId)
      : [...currentCategories, categoryId];
    
    onFilter({ ...activeFilters, categories: newCategories });
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    onFilter({ ...activeFilters, sortBy });
  };

  const clearFilters = () => {
    onFilter({});
    onSearch('');
  };

  const activeFilterCount = (activeFilters.categories?.length || 0) + 
    (activeFilters.sortBy !== 'name' ? 1 : 0);

  return (
    <div className="container mt-8 space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 animate-fade-in"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearch('')}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
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
              
              <div className="mt-6 space-y-6">
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
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Active Filters */}
          {activeFilters.categories && activeFilters.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.categories.map((categoryId) => {
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