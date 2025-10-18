import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import Addresses from "./pages/Addresses";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import ContactManagement from "./pages/admin/ContactManagement";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import { usePerformance } from "./hooks/usePerformance";
import { useAnalytics } from "./hooks/useAnalytics";
import { useErrorLogging } from "./hooks/useErrorLogging";
import AdminRoute from "./components/auth/AdminRoute";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/error/ErrorBoundary";

const queryClient = new QueryClient();

const AppContent = () => {
  usePerformance();
  useAnalytics();
  useErrorLogging();
  
  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/addresses" element={<Addresses />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><ProductManagement /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />
                    <Route path="/admin/contacts" element={<AdminRoute><ContactManagement /></AdminRoute>} />
                    <Route path="/admin/analytics" element={<AdminRoute><AnalyticsDashboard /></AdminRoute>} />
                
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
              <CartProvider>
                <AppContent />
              </CartProvider>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
