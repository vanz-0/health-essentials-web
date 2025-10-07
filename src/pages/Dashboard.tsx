import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { User, Package, MapPin, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useOrders } from "@/hooks/useOrders";
import { useAddresses } from "@/hooks/useAddresses";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentOrders from "@/components/dashboard/RecentOrders";

export default function Dashboard() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { orders, orderStats } = useOrders();
  const { addresses } = useAddresses();

  return (
    <ProtectedRoute>
      <Helmet>
        <title>Dashboard | 1Health Essentials</title>
        <meta name="description" content="Manage your account, orders, and addresses" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {profile?.username || user?.email?.split("@")[0]}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your account and track your orders
              </p>
            </div>

            {/* Stats Grid */}
            {orderStats && (
              <DashboardStats
                orderStats={orderStats}
                addressCount={addresses.length}
              />
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Button variant="outline" asChild className="h-auto py-6">
                    <Link to="/profile" className="flex flex-col items-center gap-2">
                      <User className="h-6 w-6" />
                      <span>Edit Profile</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto py-6">
                    <Link to="/orders" className="flex flex-col items-center gap-2">
                      <Package className="h-6 w-6" />
                      <span>View Orders</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto py-6">
                    <Link to="/addresses" className="flex flex-col items-center gap-2">
                      <MapPin className="h-6 w-6" />
                      <span>Manage Addresses</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <RecentOrders orders={orders} />
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
