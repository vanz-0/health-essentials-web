import { Package, MapPin, ShoppingBag, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardStatsProps = {
  orderStats: {
    total: number;
    processing: number;
    shipped: number;
    delivered: number;
  };
  addressCount: number;
};

export default function DashboardStats({ orderStats, addressCount }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Orders",
      value: orderStats.total,
      icon: ShoppingBag,
      description: "All time",
    },
    {
      title: "Processing",
      value: orderStats.processing,
      icon: Package,
      description: "Currently processing",
    },
    {
      title: "Shipped",
      value: orderStats.shipped,
      icon: Package,
      description: "In transit",
    },
    {
      title: "Saved Addresses",
      value: addressCount,
      icon: MapPin,
      description: "Quick checkout",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
