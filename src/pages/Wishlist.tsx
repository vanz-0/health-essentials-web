import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Trash2, Share2, ShoppingCart, Copy, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist, loading } = useWishlist();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: typeof item.price === 'number' ? item.price : 0,
      image: item.image,
    }, 1);
    toast.success('Added to cart');
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach(item => {
      addItem({
        id: item.id,
        name: item.name,
        price: typeof item.price === 'number' ? item.price : 0,
        image: item.image,
      }, 1);
    });
    toast.success(`Added ${wishlistItems.length} items to cart`);
  };

  const handleGenerateShareLink = async () => {
    if (!user) {
      toast.error('Please sign in to share your wishlist');
      return;
    }

    try {
      setGeneratingLink(true);
      const shareToken = `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const { error } = await supabase
        .from('shared_wishlists')
        .insert({
          user_id: user.id,
          share_token: shareToken,
          title: 'My Wishlist',
        });

      if (error) throw error;

      const link = `${window.location.origin}/wishlist/shared/${shareToken}`;
      setShareLink(link);
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error('Failed to generate share link');
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="font-sansBody min-h-screen flex flex-col">
      <Helmet>
        <title>My Wishlist | 1Health Essentials</title>
        <meta name="description" content="View and manage your favorite products wishlist at 1Health Essentials" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-serifDisplay font-semibold">My Wishlist</h1>
                <p className="text-muted-foreground">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            
            {wishlistItems.length > 0 && (
              <div className="flex gap-2">
                <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share Your Wishlist</DialogTitle>
                      <DialogDescription>
                        Generate a link to share your wishlist with friends and family
                      </DialogDescription>
                    </DialogHeader>
                    {!shareLink ? (
                      <Button 
                        onClick={handleGenerateShareLink} 
                        disabled={generatingLink}
                        className="w-full"
                      >
                        {generatingLink ? 'Generating...' : 'Generate Share Link'}
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input value={shareLink} readOnly />
                          <Button 
                            size="icon" 
                            variant="outline"
                            onClick={handleCopyLink}
                          >
                            {copied ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Anyone with this link can view your wishlist
                        </p>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button onClick={handleAddAllToCart} className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Add All to Cart
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear Wishlist?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove all items from your wishlist. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={clearWishlist}>
                        Clear Wishlist
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {/* Wishlist Items */}
          {wishlistItems.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Save your favorite products to keep track of items you love
                </p>
                <Button asChild>
                  <a href="/">Start Shopping</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.sale && (
                        <Badge className="absolute top-2 right-2 bg-destructive">
                          Sale
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-medium mb-2 line-clamp-2">{item.name}</h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">
                        {item.priceDisplay || (typeof item.price === 'number' 
                          ? `KES ${item.price.toLocaleString()}` 
                          : item.price)}
                      </span>
                      {item.rating && (
                        <div className="flex items-center gap-1">
                          <span className="text-sm">⭐</span>
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button 
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
