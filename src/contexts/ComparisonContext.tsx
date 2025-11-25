import { createContext, useContext, useState, ReactNode } from 'react';
import { CatalogueProduct } from '@/hooks/useCatalogueProducts';

interface ComparisonContextType {
  comparisonProducts: CatalogueProduct[];
  addToComparison: (product: CatalogueProduct) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonProducts, setComparisonProducts] = useState<CatalogueProduct[]>([]);

  const addToComparison = (product: CatalogueProduct) => {
    setComparisonProducts((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      if (prev.length >= 3) {
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
  };

  const removeFromComparison = (productId: string) => {
    setComparisonProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearComparison = () => {
    setComparisonProducts([]);
  };

  const isInComparison = (productId: string) => {
    return comparisonProducts.some((p) => p.id === productId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonProducts,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
}