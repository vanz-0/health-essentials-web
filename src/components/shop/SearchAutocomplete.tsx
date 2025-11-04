import { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Search, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFuzzyScore, highlightMatch, getRecentSearches, clearRecentSearches } from "@/lib/searchUtils";
import type { Product } from "@/components/home/BestSellers";

interface SearchAutocompleteProps {
  products: Product[];
  searchQuery: string;
  onSelect: (query: string) => void;
  show: boolean;
}

const categories = ["Skincare", "Hair Care", "Body Care", "Sun Care"];

export default function SearchAutocomplete({ 
  products, 
  searchQuery, 
  onSelect,
  show 
}: SearchAutocompleteProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [searchQuery]);

  if (!show || !searchQuery.trim()) {
    return recentSearches.length > 0 && show ? (
      <div className="absolute top-full mt-2 w-full rounded-lg border bg-popover shadow-lg z-50 animate-fade-in">
        <Command>
          <CommandList>
            <CommandGroup heading="Recent Searches">
              {recentSearches.map((search, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => onSelect(search)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{search}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearRecentSearches();
                  setRecentSearches([]);
                }}
                className="w-full text-xs text-muted-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear History
              </Button>
            </div>
          </CommandList>
        </Command>
      </div>
    ) : null;
  }

  // Filter and score products
  const matchedProducts = products
    .map(product => ({
      product,
      score: getFuzzyScore(product.name, searchQuery),
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Filter categories
  const matchedCategories = categories
    .filter(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 3);

  const hasResults = matchedProducts.length > 0 || matchedCategories.length > 0;

  return (
    <div className="absolute top-full mt-2 w-full rounded-lg border bg-popover shadow-lg z-50 animate-fade-in">
      <Command>
        <CommandList>
          {!hasResults && (
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <Search className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No results found</p>
              </div>
            </CommandEmpty>
          )}
          
          {matchedProducts.length > 0 && (
            <CommandGroup heading="Products">
              {matchedProducts.map(({ product }) => {
                const highlighted = highlightMatch(product.name, searchQuery);
                return (
                  <CommandItem
                    key={product.id}
                    onSelect={() => onSelect(product.name)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm">
                        {highlighted.map((part, i) => (
                          <span 
                            key={i} 
                            className={part.isMatch ? "font-semibold text-primary" : ""}
                          >
                            {part.text}
                          </span>
                        ))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        KES {product.price.toLocaleString()}
                      </p>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {matchedCategories.length > 0 && (
            <CommandGroup heading="Categories">
              {matchedCategories.map((category) => (
                <CommandItem
                  key={category}
                  onSelect={() => onSelect(category)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span>{category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}
