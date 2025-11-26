import { useState } from "react";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useCatalogueProducts } from "@/hooks/useCatalogueProducts";
import { useNavigate } from "react-router-dom";
import { fuzzyMatch, highlightMatch } from "@/lib/searchUtils";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { data: products } = useCatalogueProducts();
  const navigate = useNavigate();

  // Strict search - only show exact matches
  const searchResults = products?.filter(product => {
    if (!debouncedQuery.trim()) return false;
    const query = debouncedQuery.toLowerCase().trim();
    return (
      product.name.toLowerCase().includes(query) ||
      product.use_case?.toLowerCase().includes(query)
    );
  }).slice(0, 8) || [];

  const handleProductClick = (productId: string) => {
    onOpenChange(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  const handleSearchAll = () => {
    onOpenChange(false);
    navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Search Products</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                handleSearchAll();
              }
            }}
            className="pl-10 pr-10 h-12 text-base"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {searchQuery && (
          <div className="mt-4 max-h-[400px] overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">
                        {highlightMatch(product.name, debouncedQuery).map((part, i) => (
                          <span key={i} className={part.isMatch ? "bg-yellow-200 dark:bg-yellow-800" : ""}>
                            {part.text}
                          </span>
                        ))}
                      </p>
                      {product.use_case && product.use_case.toLowerCase().includes(debouncedQuery.toLowerCase()) && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {highlightMatch(product.use_case, debouncedQuery).map((part, i) => (
                            <span key={i} className={part.isMatch ? "bg-yellow-200 dark:bg-yellow-800" : ""}>
                              {part.text}
                            </span>
                          ))}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground truncate">{product.product_type}</p>
                    </div>
                    <p className="font-semibold text-primary">{product.priceDisplay}</p>
                  </button>
                ))}
                
                <button
                  onClick={handleSearchAll}
                  className="w-full p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-center font-medium text-primary"
                >
                  View all results for "{searchQuery}"
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No products found</p>
                <p className="text-sm text-muted-foreground mt-1">Try different keywords</p>
              </div>
            )}
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Start typing to search products</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
