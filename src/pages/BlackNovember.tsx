import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ShoppingCart, Shield, Lock, Truck, Headset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import FlashBanner from '@/components/home/FlashBanner';
import UrgentDeal from '@/components/home/UrgentDeal';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { toast } from 'sonner';
import productSerum from '@/assets/product-serum.jpg';
import productBodyButter from '@/assets/product-bodybutter.jpg';
import productShampoo from '@/assets/product-shampoo.jpg';

export default function BlackNovember() {
  const { addItem, totalQty } = useCart();
  const { isEnabled: cartEnabled } = useFeatureFlag('bit_6_shopping_cart');

  // Countdown end time: November 30, 2025 at 23:59:59
  const saleEndTime = new Date('2025-11-30T23:59:59');

  // Smooth scroll to deals section
  const scrollToDeals = () => {
    const dealsSection = document.getElementById('featured-deals');
    if (dealsSection) {
      dealsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle add to cart with toast notification
  const handleAddToCart = (product: { id: string; name: string; price: number; image: string }) => {
    if (!cartEnabled) {
      toast.error('Shopping cart is currently unavailable');
      return;
    }

    addItem(product, 1);
    toast.success(`${product.name} added to cart!`, {
      duration: 3000,
    });
  };

  // Featured products data
  const featuredDeals = [
    {
      id: 'deal-1-serum',
      title: 'Hydrating Facial Serum',
      image: productSerum,
      discount: 60,
      originalPrice: 3499,
      salePrice: 1399,
      timeLeft: 180, // 3 hours in minutes
      claimed: 42,
      total: 100,
    },
    {
      id: 'deal-2-butter',
      title: 'Nourishing Body Butter',
      image: productBodyButter,
      discount: 70,
      originalPrice: 2999,
      salePrice: 899,
      timeLeft: 120, // 2 hours in minutes
      claimed: 67,
      total: 100,
    },
    {
      id: 'deal-3-shampoo',
      title: 'Repair Hair Shampoo',
      image: productShampoo,
      discount: 50,
      originalPrice: 2499,
      salePrice: 1249,
      timeLeft: 300, // 5 hours in minutes
      claimed: 28,
      total: 100,
    },
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Black November Sale 2025 - Up to 70% Off | Health Essentials</title>
        <meta
          name="description"
          content="Don't miss our Black November deals! Get up to 70% off on premium health and beauty products. Limited time offers on skincare, hair care, and body care essentials."
        />
        <meta property="og:title" content="Black November Sale 2025 - Up to 70% Off | Health Essentials" />
        <meta
          property="og:description"
          content="Don't miss our Black November deals! Get up to 70% off on premium health and beauty products. Limited time offers on skincare, hair care, and body care essentials."
        />
        <meta property="og:url" content="https://yourdomain.com/black-november" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Black November Sale 2025 - Up to 70% Off | Health Essentials" />
        <meta
          name="twitter:description"
          content="Don't miss our Black November deals! Get up to 70% off on premium health and beauty products."
        />
      </Helmet>

      {/* Minimal Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b h-16 md:h-[70px]">
        <div className="container h-full flex items-center justify-between px-4">
          {/* Logo */}
          <Link
            to="/"
            className="font-serifDisplay text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 via-purple-700 to-rose-700 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            1Health Essentials
          </Link>

          {/* Right side: Theme Toggle + Cart */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {cartEnabled && (
              <CartDrawer>
                <Button variant="accent" size="icon" aria-label="Cart" className="relative">
                  <ShoppingCart />
                  {totalQty > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] px-1">
                      {totalQty}
                    </span>
                  )}
                </Button>
              </CartDrawer>
            )}
          </div>
        </div>
      </header>

      {/* FlashBanner - Sticky below header */}
      <div className="fixed top-16 md:top-[70px] left-0 right-0 z-40">
        <div className="bg-gradient-to-r from-emerald-700 to-purple-700 text-white py-2 px-4 animate-fade-in">
          <FlashBanner
            endTime={saleEndTime}
            message="FLASH SALE ENDS IN"
          />
        </div>
      </div>

      {/* Main Content - Add top margin to account for fixed header + banner */}
      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[500px] lg:min-h-[80vh] flex items-center justify-center overflow-hidden animate-fade-in bg-background">
          {/* Gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/10 via-purple-700/10 to-rose-700/10 dark:from-emerald-700/20 dark:via-purple-700/20 dark:to-rose-700/20" />

          {/* Hero Content */}
          <div className="relative z-10 container px-4 py-16 md:py-20 text-center">
            <h1 className="font-serifDisplay text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-purple-700 to-rose-700 bg-clip-text text-transparent">
              BLACK NOVEMBER
            </h1>

            {/* Discount Box */}
            <div className="inline-block mb-6 animate-scale-in">
              <div className="bg-gradient-to-r from-emerald-700 via-purple-700 to-rose-700 text-white px-8 md:px-12 py-4 md:py-6 rounded-lg shadow-2xl animate-pulse-glow">
                <p className="text-5xl md:text-6xl lg:text-7xl font-bold">UP TO 70% OFF</p>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Limited Time Deals on Health & Beauty Essentials
            </p>

            {/* CTA Button */}
            <Button
              onClick={scrollToDeals}
              size="lg"
              className="bg-gradient-to-r from-emerald-700 to-purple-700 hover:from-emerald-800 hover:to-purple-800 text-white font-bold px-10 py-6 text-lg transition-transform hover:scale-105"
            >
              Shop All Deals
            </Button>
          </div>
        </section>

        {/* Featured Deals Section */}
        <section id="featured-deals" className="py-16 md:py-20 bg-muted/30">
          <div className="container px-4">
            <h2 className="font-serifDisplay text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-700 via-purple-700 to-rose-700 bg-clip-text text-transparent">
              Featured Deals
            </h2>

            {/* 3-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {featuredDeals.map((deal, index) => (
                <div
                  key={deal.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <UrgentDeal
                      title={deal.title}
                      discount={deal.discount}
                      originalPrice={deal.originalPrice}
                      timeLeft={deal.timeLeft}
                      claimed={deal.claimed}
                      total={deal.total}
                      image={deal.image}
                    />

                    {/* Override the default button with custom add to cart functionality */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <Button
                        onClick={() => handleAddToCart({
                          id: deal.id,
                          name: deal.title,
                          price: deal.salePrice,
                          image: deal.image,
                        })}
                        className="w-full bg-white text-red-600 hover:bg-gray-100 font-bold transition-transform hover:scale-105"
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Claim Deal Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {/* Badge 1: Money-Back Guarantee */}
              <div className="text-center space-y-3 animate-fade-in group">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-emerald-700 to-purple-700 text-white transition-transform group-hover:scale-110">
                    <Shield className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="font-bold text-lg">30-Day Guarantee</h3>
                <p className="text-sm text-muted-foreground">100% money-back guarantee</p>
              </div>

              {/* Badge 2: Secure Payment */}
              <div className="text-center space-y-3 animate-fade-in group" style={{ animationDelay: '100ms' }}>
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-emerald-700 to-purple-700 text-white transition-transform group-hover:scale-110">
                    <Lock className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="font-bold text-lg">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">Safe & secure checkout</p>
              </div>

              {/* Badge 3: Free Shipping */}
              <div className="text-center space-y-3 animate-fade-in group" style={{ animationDelay: '200ms' }}>
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-emerald-700 to-purple-700 text-white transition-transform group-hover:scale-110">
                    <Truck className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="font-bold text-lg">Free Delivery</h3>
                <p className="text-sm text-muted-foreground">On orders over KSh 2,000</p>
              </div>

              {/* Badge 4: Customer Support */}
              <div className="text-center space-y-3 animate-fade-in group" style={{ animationDelay: '300ms' }}>
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-emerald-700 to-purple-700 text-white transition-transform group-hover:scale-110">
                    <Headset className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="font-bold text-lg">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">Dedicated customer service</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
