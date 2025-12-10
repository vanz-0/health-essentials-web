import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BeautyTips from "./pages/BeautyTips";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import Addresses from "./pages/Addresses";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import ContactManagement from "./pages/admin/ContactManagement";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import CatalogueImport from "./pages/admin/CatalogueImport";
import Challenges from "./pages/Challenges";
import ChallengeDetail from "./pages/ChallengeDetail";
import { usePerformance } from "./hooks/usePerformance";
import { useAnalytics } from "./hooks/useAnalytics";
import { useErrorLogging } from "./hooks/useErrorLogging";
import AdminRoute from "./components/auth/AdminRoute";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import ErrorBoundary from "./components/error/ErrorBoundary";
import Snowfall from "./components/home/Snowfall";
import Snowman from "./components/home/Snowman";

const queryClient = new QueryClient();

const AppContent = () => {
  usePerformance();
  useAnalytics();
  useErrorLogging();
  
  return (
    <>
      {/* Festive Snowfall Effect - Appears on all pages */}
      <Snowfall count={15} />
      
      {/* Festive Snowman Animation - Appears on all pages */}
      <Snowman />
      
      <Toaster />
      <Sonner />
      <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/beauty-tips" element={<BeautyTips />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/addresses" element={<Addresses />} />
                
                {/* Challenge Routes */}
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/challenges/:challengeId" element={<ChallengeDetail />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><ProductManagement /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />
                    <Route path="/admin/contacts" element={<AdminRoute><ContactManagement /></AdminRoute>} />
                    <Route path="/admin/analytics" element={<AdminRoute><AnalyticsDashboard /></AdminRoute>} />
                    <Route path="/admin/catalogue-import" element={<AdminRoute><CatalogueImport /></AdminRoute>} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <ThemeProvider>
                <CartProvider>
                  <WishlistProvider>
                    <ComparisonProvider>
                      <AppContent />
                    </ComparisonProvider>
                  </WishlistProvider>
                </CartProvider>
              </ThemeProvider>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
