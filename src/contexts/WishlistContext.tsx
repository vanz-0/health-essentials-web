import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import type { Product } from '@/components/home/BestSellers';

interface WishlistItem extends Product {
  wishlistId?: string;
  addedAt?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  loading: boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist items from database or localStorage
  useEffect(() => {
    loadWishlist();
  }, [user]);

  const loadWishlist = async () => {
    try {
      if (user) {
        // Load from database for authenticated users
        const { data, error } = await supabase
          .from('wishlist_items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const items = (data || []).map(item => {
          const productData = item.product_data as Record<string, any>;
          return {
            ...productData,
            wishlistId: item.id,
            addedAt: item.created_at,
          } as WishlistItem;
        });

        setWishlistItems(items);
      } else {
        // Load from localStorage for non-authenticated users
        const stored = localStorage.getItem('1health_wishlist');
        if (stored) {
          const items = JSON.parse(stored) as WishlistItem[];
          setWishlistItems(items);
        }
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const syncToLocalStorage = (items: WishlistItem[]) => {
    localStorage.setItem('1health_wishlist', JSON.stringify(items));
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };

  const addToWishlist = async (product: Product) => {
    try {
      if (isInWishlist(product.id)) {
        toast.info('Already in wishlist');
        return;
      }

      if (user) {
        // Add to database for authenticated users
        const { data, error } = await supabase
          .from('wishlist_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            product_data: product,
          })
          .select()
          .single();

        if (error) throw error;

        const newItem: WishlistItem = {
          ...product,
          wishlistId: data.id,
          addedAt: data.created_at,
        };

        setWishlistItems(prev => [newItem, ...prev]);
        toast.success('Added to wishlist');
      } else {
        // Add to localStorage for non-authenticated users
        const newItem: WishlistItem = {
          ...product,
          addedAt: new Date().toISOString(),
        };
        const updatedItems = [newItem, ...wishlistItems];
        setWishlistItems(updatedItems);
        syncToLocalStorage(updatedItems);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      if (user) {
        // Remove from database
        const item = wishlistItems.find(i => i.id === productId);
        if (!item?.wishlistId) return;

        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('id', item.wishlistId);

        if (error) throw error;

        setWishlistItems(prev => prev.filter(i => i.id !== productId));
        toast.success('Removed from wishlist');
      } else {
        // Remove from localStorage
        const updatedItems = wishlistItems.filter(i => i.id !== productId);
        setWishlistItems(updatedItems);
        syncToLocalStorage(updatedItems);
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const clearWishlist = async () => {
    try {
      if (user) {
        // Clear from database
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      }

      setWishlistItems([]);
      syncToLocalStorage([]);
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  const value = {
    wishlistItems,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    loading,
    wishlistCount: wishlistItems.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
