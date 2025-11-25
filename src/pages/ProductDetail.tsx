import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, ArrowLeft, Sparkles } from "lucide-react";
import { useCatalogueProducts } from "@/hooks/useCatalogueProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: products = [], isLoading } = useCatalogueProducts();
  const { addItem } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { isEnabled: cartEnabled } = useFeatureFlag('bit_6_shopping_cart');
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => {
    return products.find((p) => p.id === id);
  }, [products, id]);

  // Get related products based on category and use case
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => 
        p.id !== product.id && 
        (p.category === product.category || p.use_case === product.use_case)
      )
      .slice(0, 4);
  }, [product, products]);

  if (isLoading) {
    return (
      <div className="font-sansBody min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="font-sansBody min-h-screen">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (cartEnabled) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: typeof product.price === 'number' ? product.price : 0,
          image: product.image,
        });
      }
    }
  };

  return (
    <div className="font-sansBody">
      <Helmet>
        <title>{product.name} | 1Health Essentials</title>
        <meta name="description" content={product.description || product.copy || `Shop ${product.name} - natural beauty and wellness products`} />
        <link rel="canonical" href={`/product/${product.id}`} />
      </Helmet>

      <Header />
      <main className="min-h-screen pt-[112px]">
        <div className="container py-8">
          <Link to="/shop">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="relative">
              {product.sale && (
                <Badge className="absolute left-4 top-4 z-10">Sale</Badge>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[500px] object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="font-serifDisplay text-3xl md:text-4xl font-bold mb-2">
                  {product.name}
                </h1>
                {product.category && (
                  <Badge variant="secondary" className="capitalize">
                    {product.category}
                  </Badge>
                )}
              </div>

              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating || 0)
                            ? 'fill-primary text-primary'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    {product.rating.toFixed(1)} / 5.0
                  </span>
                </div>
              )}

              <div className="text-4xl font-bold text-primary">
                {product.priceDisplay}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.size && (
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <p className="font-medium">{product.size}</p>
                  </div>
                )}
                {product.product_type && (
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium capitalize">{product.product_type}</p>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {cartEnabled && (
                  <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => addToWishlist({
                    id: product.id,
                    name: product.name,
                    price: typeof product.price === 'number' ? product.price : 0,
                    image: product.image,
                  })}
                  className={isInWishlist(product.id) ? 'bg-accent' : ''}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="description" className="mb-12">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="instructions">How to Use</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="facts">Fun Facts</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Product</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <p>{product.copy || product.description || 'No description available.'}</p>
                  {product.use_case && (
                    <div className="mt-4">
                      <h3 className="font-semibold">Perfect For:</h3>
                      <p>{product.use_case}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>How to Use</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">
                    {product.instructions || 'No instructions available.'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Reviews coming soon! Be the first to review this product.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="facts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Did You Know?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{product.funFact || 'No fun facts available.'}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="font-serifDisplay text-2xl font-bold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((related) => (
                  <Link key={related.id} to={`/product/${related.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={related.image}
                        alt={related.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <CardContent className="p-4">
                        <h3 className="font-medium line-clamp-2 mb-2">{related.name}</h3>
                        <div className="font-semibold text-primary">{related.priceDisplay}</div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}