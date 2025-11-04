import { useState, useEffect } from 'react';
import { FilterOptions } from '@/components/shop/SearchAndFilter';

const STORAGE_KEY = '1health_search_filters';
const TTL_HOURS = 24;

interface StoredFilters {
  filters: Partial<FilterOptions>;
  timestamp: number;
}

export function usePersistedFilters() {
  const [filters, setFilters] = useState<Partial<FilterOptions>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setIsLoaded(true);
        return;
      }

      const data: StoredFilters = JSON.parse(stored);
      const now = Date.now();
      const hoursSinceStored = (now - data.timestamp) / (1000 * 60 * 60);

      // Check if data is still valid (within TTL)
      if (hoursSinceStored < TTL_HOURS) {
        setFilters(data.filters);
      } else {
        // Clear expired data
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to load persisted filters:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded) return;

    try {
      const data: StoredFilters = {
        filters,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist filters:', error);
    }
  }, [filters, isLoaded]);

  const clearPersistedFilters = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setFilters({});
    } catch (error) {
      console.error('Failed to clear persisted filters:', error);
    }
  };

  return {
    filters,
    setFilters,
    clearPersistedFilters,
    isLoaded,
  };
}
